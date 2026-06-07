# DevTinder APIs

authRouter
POST /signup
- POST /Login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter
- POST /request/send/intereted/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignore, interested, accepeted, rejected


we will use api routers which will be use to handle all the api effecitnly and we will use controllers to handle the logic of the api and we will use models to handle the database operations and we will use middlewares to handle the authentication and authorization of the api and we will use utils to handle the utility functions of the api. 

pagination 
/feed?page=1&limit=10  first 10 users 

/feed?page=2&limit=10 next 10 users

.skip() and .limit() are used to implement pagination in MongoDB.
skip -- > skips the first n documents in the collection and returns the rest of the documents.
limit --> limits the number of documents returned by the query to n.