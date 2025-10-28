# DevTinder api's

# Auth Router
POST /signUp
POST /login
POST /logout

# Profile Router
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

# # # # # # # Status: ignore, intrested, accepted, rejected

# Connection Request Router
POSt /request/send/intrested/:userID
POSt /request/send/ignored/:userID
POST/request/review/accepted/:requestId
POST/request/review/rejected/:requestId

# User Router
GET /user/connections
GET /user/requests/received
GET /user/feed - Gets you the profiles of other users on platform
