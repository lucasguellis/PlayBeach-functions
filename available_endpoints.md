## Available Endpoints

| Method | Endpoint                                            | Description
|--------|-----------------------------------------------------|--------------
| GET    | /users                                              | Retrieve all users
| GET    | /users?name=xxx                                     | Search for users by name
| GET    | /users/profile/:userId                              | Get user profile by id
| GET    | /users/:userId/getPlaces                           | Get user places by id
| PUT    | /users/:userId                                      | Update a user
| DELETE | /users/:userId                                      | Delete a user
| POST   | /users/createUser                                   | Create a user
| GET    | /places                                             | Retrieve all places
| GET    | /places                                             | Retrieve all places
| GET    | /places?name=xxx                                    | Search for places by name
| GET    | /places/:placeId                                    | Get place by id
| PUT    | /places/:placeId                                    | Update a place
| DELETE | /places/:placeId                                    | Delete a place
| POST   | /places/createPlace                                 | Create a place
| GET    | /places/:placeId/getUsers                          | Get users by place id
| GET    | /tournaments                                        | Retrieve all tournaments
| GET    | /tournaments?name=xxx                               | Search for tournaments by name
| GET    | /tournaments/:tournamentId                          | Get tournament by id
| PUT    | /tournaments/:tournamentId                          | Update a tournament
| DELETE | /tournaments/:tournamentId                          | Delete a tournament
| POST   | /tournaments/createTournament                       | Create a tournament
| POST   | /tournaments/:tournamentId/addCategory              | Add a category to a tournament
| GET    | /tournaments/:tournamentId/categories               | Get categories by tournament id
| GET    | /tournaments/:tournamentId/categories/:categoryId   | Get category by id
| DELETE | /tournaments/:tournamentId/categories/:categoryId   | Delete a category from a tournament
| PUT    | /tournaments/:tournamentId/categories/:categoryId   | Update a category from a tournament
| GET    | /tournaments/:tournamentId/matches                  | Get matches by tournament id
| GET    | /matches                                            | Retrieve all matches
| GET    | /matches/:matchId                                   | Get match by id
| PUT    | /matches/:matchId                                   | Update a match
| DELETE | /matches/:matchId                                   | Delete a match
| POST   | /matches/createMatch                                | Create a match
