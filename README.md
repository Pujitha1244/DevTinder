# DevTinder

packages downloaded
validator
bcrypt

Tinder for Developers

uB3mfDASPTGrOdXw, saipoojithavankadara_db_user cluster in mail saipujithavanakadar mail
mongodb+srv://saipoojithavankadara_db_user:uB3mfDASPTGrOdXw@poojicluster.kyq1ene.mongodb.net/ - connction string for saipujithavanakadara mail

create a free cluster on MongoDB Official website(Mondo Atlas)
Install mongoose library
connect your application to the Database "Connection URL"/devTinder
call the connectDb function and connect to Dbbefore starting the application on 3001

create a user Schema & user Model
create Post signUp API to add Data to database

Add a express.json middleware to your app
Make your signup API dynamic to receive data from end user

Explore schematype options fron the documentation
add require, unique, lowercase, min, minLength, trim
add default case
create custome validate function for gender
Improve the DB schema - pul all appropriate validations on each field in schema
add timestams to userSchema
add API level validation on patch request and sighup post APi
DATA sanitization - Add API validation for each field
install validator
explore validator libray function and use Validator functions for password, email, photoURL
Never trust req.body

Validate data in Signup API
Install bcrypt package
create passwordHash using bcrypt.hash and save the user with wncrypted password
create login APi
compare passwords and throe errors if email and password is invalid

install cookie-parser
just send dummy cookie to user
create GET/profile api check you get the cookie back
install JSON web token
In login api after email and password validation, create JWT token and sent it to user in cookies
read the cookies inside your profile API and find the logged in User
userAuth Middleware
Add user Auth middleware for API's that we need like profile and sendConnectionRequest api's
set JWT and cookies expiry
Create user Schema method to getJWT()
Create user Schema method to comparepassword(password)

Go and explore tinder API's
Create a list of all API's you can think of in Dev Tinder
Group multiple routed under respective routers
React Documentation for express.Router
Create Routes folder for managing auth, profile, request routers
create authRouter, profile Router, requestRouter
import these routers in app.js
Create POST /Logout APi
Create PATCH /profile/edit
Create PATCH /profile/password API - Forgot Password API
Make sure to validate all data in every POST and PATCH API's