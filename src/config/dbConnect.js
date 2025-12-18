import mongoose from "mongoose";

export async function dbConnect() {
    try {
        await mongoose.connect(process.env.URL)
        console.log("database is connected");
    } catch (error) {
        console.log("Error",error);
    }
}