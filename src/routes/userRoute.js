import express from "express"
import { login, register } from "../controller/userController.js"
import { verify } from "../middleware/tokenVerification.js"

const userRoute = express.Router()

userRoute.post("/register", register)
userRoute.get("/verify", verify)
userRoute.post("/login", login)
export default userRoute