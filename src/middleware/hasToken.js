import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema.js";


export const hasToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        sucess: false,
        message: "Authorization token is missing or Invalid",
      });
    } else {
      const authToken = authHeader.split(" ")[1];
      // console.log(`authToken is ${authToken}`);
      jwt.verify(authToken, process.env.secretKey, async (error, decoded) => {
        // console.log("decoded", decoded);

        if (error) {
          if (error.name === "TokenExpiredError") {
            return res.status(401).json({
              success: false,
              message: "Token is expired",
            });
          }
          return res.status(401).json({
            success: false,
            message: "Token is expired or invalid",
          });
        } else {
          const { id } = decoded;
          // console.log(`the id is ${id}`);
          const user = await userSchema.findById(id);
          // console.log(`The user is ${user}`);
          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          } 
          
          // const exsistingUser = await sessionSchema.findOne({
          //   userId : id
          // })

          // if(exsistingUser) {
          // }
          req.userId = id
          next()

        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};