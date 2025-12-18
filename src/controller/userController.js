import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import userSchema from "../models/userSchema.js"


export const register = async (req,  res) => {
    try {
        const {userName, email, password} = req.body
        const exsisting = await userSchema.findOne({ email })
        // console.log(exsisting);
        if(exsisting) {
            return res.status(400).json({
                success : false,
                message : "Email already in use"
            })
        }

        const hashPass = await bcrypt.hash(password, 10)
        const user = await userSchema.create({
            userName,
            email,
            password : hashPass
        })

        const token = jwt.sign({id : user._id}, process.env.secretKey, {expiresIn : "5m"})
        user.token = token
        await user.save();
        if(user) {
            return res.status(201).json({
                sucess : true,
                message : "User created successfully!",
                user
            })
        }
    } catch (error) {
        return res.status(500).json({
            sucess : false,
            message : error.message,
        })
    }
}


export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        // console.log(email);
        // console.log(password);
        const user = await userSchema.findOne({email : email})
        console.log(`USer chcek from login ${user}`);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access!"
            })
        } else {
            const comparePass = await bcrypt.compare(password, user.password)
            if(!comparePass) {
                return res.status(403).json({
                    success : false,
                    message : "Invalid Password"
                })
            } else if(comparePass && user.isVerified === true) {
                // await sessionSchema.findOneAndDelete({userId : user._id})
                // await sessionSchema.create({userId : user._id})

                const accessToken = jwt.sign(
                    { id : user._id},
                    process.env.secretKey,
                    {expiresIn : "7d"}
                )

                user.isLoggedIn = true;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "User logged in successfully!",
                    accessToken: accessToken,
                    user
                })

            }
            
            else {
                return res.status(400).json({
                    message: "Please verify yourself and then Login!"
                });
            }
        }

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
        
    }
        
}