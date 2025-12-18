import express from "express"
import { hasToken } from "../middleware/hasToken.js"
import { createTodo, getTodo } from "../controller/todoController.js"

const todoRoute = express.Router()

todoRoute.post("/create", hasToken, createTodo)
todoRoute.get("/get", hasToken, getTodo)

export default todoRoute