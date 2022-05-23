const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

/* //Creating User Function
//Create a user - atleast 5 users
//Create a user document from request body.
//Return HTTP status 201 on a succesful user creation. Also return the user document. The response should be a JSON object like this
//Return HTTP status 400 if no params or invalid params received in request body. The response should be a JSON object like this
 */
const createUser = async function (req, res) {
    try {
        let data = req.body
        //Check if Body is empty or not 
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "data must be required" })
        }

        //Validation On title
        if (!data.title) {
            return res.status(400).send({ status: false, message: "title is required" })
        }
        // Title should be in enum [ "Mr" , "Mrs" , "Miss"]
        if (data.title !== "Mr" && data.title !== "Mrs" && data.title !== "Miss") {
            return res.status(400).send({ status: false, message: "title should be  Mr, Mrs, Miss" })
        }
        if (!data.name) {
            return res.status(400).send({ status: false, message: "name is required" })
        }
        let isValidName = /^[A-Za-z ]{1,100}$/
        if (!isValidName.test(data.name)) {
            return res.status(400).send({ status: false, msg: " Name should not be numeric" })
        }


        //Validation on Phone Number

        if (!data.phone) {
            return res.status(400).send({ status: false, message: "phone is required" })
        }

        //Checking the validation on phone number
        let isValidPhone = /^[6-9]{1}[0-9]{9}$/
        if (!isValidPhone.test(data.phone)) {
            return res.status(400).send({ status: false, message: "Phone Number is not valid" })
        }

        //checking the uniqueness of a phone no. 
        let phoneNum = await userModel.findOne({ phone: data.phone })

        if (phoneNum) {
            if (phoneNum.phone === data.phone) {
                return res.status(400).send({ status: false, message: "Phone number already Exist" })
            }

        }


        //Validation On email
        if (!data.email) {
            return res.status(400).send({ status: false, message: "email is required" })
        }

        //Checking EMail Format
        let isValidEmail = /^[a-z0-9]{1,100}@[a-z]{1,50}[.]{1}[a-z]{2,3}$/
        if (!isValidEmail.test(data.email)) return res.status(400).send({ status: false, msg: "email not valid" })

        // Checking the uniqueness of email
        let checkEmail = await userModel.findOne({ email: data.email })

        if (checkEmail) {
            if (checkEmail.email === data.email) {
                return res.status(400).send({ status: false, message: "Email already Exist" })
            }

        }

        //Validation On password
        if (!data.password) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        //cheking the password length 

        let isValidPassword = /^[A-Za-z0-9@$#]{8,15}$/
        if (!isValidPassword.test(data.password)) {
            return res.status(400).send({ status: false, message: "password length should be Min 8 and max 15" })
        }


        let users = await userModel.create(data)
        res.status(201).send({ status: true, message: "success", data: users })
    }
    catch (err) {
        res.status(500).send({Satus: false, msg: "Error", error: err.message })
    }
}

//**********************************************Login Function ************************************************
/* Allow an user to login with their email and password.
On a successful login attempt return a JWT token contatining the userId, exp, iat. The response should be a JSON object like this
If the credentials are incorrect return a suitable error message with a valid HTTP status code. The response should be a JSON object like this */

const login = async function (req, res) {
    try {
        let data = req.body

        //Check if Body is empty or not
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Data must be given inside body" })
        }
        //Validation On email
        if (!data.email) {
            return res.status(400).send({ status: false, message: "email is required" })
        }
        //Validation On password
        if (!data.password) {
            return res.status(400).send({ status: false, message: "password is required" })
        }
          //cheking the email and password
        let checkUser = await userModel.findOne({ email: data.email, password: data.password })
        if (!checkUser) {
            return res.status(400).send({ status: false, message: "Email or Password is not valid" })
        }
        //Token creation with userId, exp, iat 
        const token = jwt.sign({
            userId: checkUser._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // Signing a token with 1 hour of expiration
        }, "group34")
        
        res.setHeader("x-api-key", token);   //set the token in response Header
        res.status(200).send({ status: true, message: "success", data: token })
    }
    catch (err) {
        res.status(500).send({Satus: false, msg: "Error", error: err.message })
    }
}




module.exports.login = login
module.exports.createUser = createUser