## Available Endpoints

| Method | Endpoint                                | Description
|--------|-----------------------------------------|--------------
| GET    | /users                                  | Retrieve all users
| GET    | /users?name=xxx                         | Search for users by name
| GET    | /users/profile/<userId>                 | Get user profile by id
| GET    | /users/places/getPlaces?userId=xxx      | Get user places by id
| POST   | /users/createUser                       | Create a user
| GET    | /places                                 | Retrieve all places
| GET    | /places?name=xxx                        | Search for places by name
| POST   | /places/createPlace                     | Create a place