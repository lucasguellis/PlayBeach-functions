const express = require("express");
const CategoriesController = require("../controllers/categories");
const Category = require("../models/category");
const {logger} = require("firebase-functions");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const name = req.query.name;

    let categories;
    if (name) {
      categories = await CategoriesController.getCategoryByName(name);
    } else {
      categories = await CategoriesController.getAllCategories();
    }
    res.status(200).json({categories: categories});
  } catch (error) {
    logger.error("Error finding categories:", error);
    res.status(500).json({error: "Failed finding categories"});
  }
});

router.get("/:categoryId", async (req, res) => {
  try {
    const {categoryId} = req.params;
    const category = await CategoriesController.getCategoryById(categoryId);
    res.status(200).json({category: category});
  } catch (error) {
    logger.error("Error finding category:", error);
    res.status(500).json({error: "Failed finding category"});
  }
});

router.post("/createCategory", async (req, res) => {
  try {
    const categoryData = req.body;

    categoryData.createdAt = `${Date.now()}`;
    categoryData.updatedAt = 0;

    const validationErrors = Category.validate(categoryData);
    if (validationErrors.length > 0) {
      return res.status(400).json({errors: validationErrors});
    }

    const newCategory = JSON.parse(JSON.stringify(new Category(categoryData)));

    const categoryRef = await CategoriesController.createCategory(newCategory.id);
    logger.info(`Category added with ID: ${categoryRef.id}`);

    res.status(201).json({message: "Category added successfully", id: categoryRef.id});
  } catch (error) {
    logger.error("Error adding category:", error);
    res.status(500).json({error: "Failed to add category"});
  }
});

router.put("/:categoryId", async (req, res) => {
  try {
    const {categoryId} = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = Date.now();

    await CategoriesController.updateCategory(categoryId, updatedData);
    res.status(200).json({message: "Category updated successfully"});
  } catch (error) {
    logger.error("Error updating category:", error);
    res.status(500).json({error: "Failed to update category"});
  }
});

router.delete("/:categoryId", async (req, res) => {
  try {
    const {categoryId} = req.params;
    await CategoriesController.deleteCategory(categoryId);
    res.status(200).json({message: "Category deleted successfully"});
  } catch (error) {
    logger.error("Error deleting category:", error);
    res.status(500).json({error: "Failed to delete category"});
  }
});

module.exports = router;
