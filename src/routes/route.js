const express = require('express')
const router = express.Router()
const userController =require("../controllers/userController")
const bookController =require("../controllers/bookController")
const reviewController=require("../controllers/reviewController")
const auth = require("../middleWare/auth")
//const aws= require("aws-sdk")



//******************************User APIs************************************************* */
//user creation
router.post("/register",userController.createUser)

//user Login
router.post("/login",userController.login)

//**********************************Book API*********************************************** */
//book creation
router.post("/books",auth.authentication,auth.authorization,bookController.createBook)

//get books
router.get("/books",auth.authentication,bookController.getBooks)

//get books by id
router.get("/books/:bookId",auth.authentication,bookController.getBookSByBookId)

//Update the datails of a book
router.put("/books/:bookId",auth.authentication,auth.authorization,bookController.updateBook)

//deleted book
router.delete("/books/:bookId",auth.authentication,auth.authorization,bookController.deleteData)


//****************************************Review Api ******************************************/
//Post API of review 
router.post("/books/:bookId/review",reviewController.createReview)

//put API of review
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

//Delete API of review
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)
module.exports =router