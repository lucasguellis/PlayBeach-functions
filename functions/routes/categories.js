const express = require("express");
const CategoriesController = require("../controllers/categories");
const Category = require("../models/category");
const { logger } = require("firebase-functions");
const { AppError } = require('../middlewares/errorHandler');

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;

    let categories;
    if (name) {
      categories = await CategoriesController.getCategoryByName(name);
    } else {
      categories = await CategoriesController.getAllCategories();
    }

    if (!categories) {
      return next(new AppError(404, 'No categories found'));
    }

    res.status(200).json({categories: categories});
  } catch (error) {
    next(new AppError(500, 'Failed finding categories'));
  }
});

router.get("/:categoryId", async (req, res, next) => {
  try {
    const {categoryId} = req.params;
    const category = await CategoriesController.getCategoryById(categoryId);

    if (!category) {
      return next(new AppError(404, 'Category not found'));
    }

    res.status(200).json({category: category});
  } catch (error) {
    next(new AppError(500, 'Failed finding category'));
  }
});

router.post("/createCategory", async (req, res, next) => {
  try {
    const categoryData = req.body;

    categoryData.createdAt = `${Date.now()}`;
    categoryData.updatedAt = 0;

    const validationErrors = Category.validate(categoryData);
    if (validationErrors.length > 0) {
      return next(new AppError(400, validationErrors.join(', ')));
    }

    const newCategory = JSON.parse(JSON.stringify(new Category(categoryData)));

    const categoryRef = await CategoriesController.createCategory(newCategory.id);
    logger.info(`Category added with ID: ${categoryRef.id}`);

    res.status(201).json({message: "Category added successfully", id: categoryRef.id});
  } catch (error) {
    next(new AppError(500, 'Failed to add category'));
  }
});

router.put("/:categoryId", async (req, res, next) => {
  try {
    const {categoryId} = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = Date.now();

    const updatedCategory = await CategoriesController.updateCategory(categoryId, updatedData);

    if (!updatedCategory) {
      return next(new AppError(404, 'Category not found'));
    }

    res.status(200).json({message: "Category updated successfully"});
  } catch (error) {
    next(new AppError(500, 'Failed to update category'));
  }
});

router.delete("/:categoryId", async (req, res, next) => {
  try {
    const {categoryId} = req.params;
    const deletedCategory = await CategoriesController.deleteCategory(categoryId);

    if (!deletedCategory) {
      return next(new AppError(404, 'Category not found'));
    }

    res.status(200).json({message: "Category deleted successfully"});
  } catch (error) {
    next(new AppError(500, 'Failed to delete category'));
  }
});

module.exports = router;