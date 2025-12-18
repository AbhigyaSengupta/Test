import todoSchema from "../models/todoSchema.js"

export const createTodo = async (req, res) => {
    try {

        const {title, description} = req.body
        // console.log(`Todo title is ${title} and des is ${description}`);
        const createdtodo = await todoSchema.create({
            title : title,
            description : description,
            userId : req.userId
        })
        

        return res.status(201).json({
            success : true,
            message : "todo created successfully",
            createdtodo
    
        })
    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "todo creation is not successful",
        })
    }
}

export const getTodo = async (req, res) => {
    try {
        const todo = await todoSchema.find({userId : req.userId})
        console.log(`Todo is ${todo}`);
        if(todo.length === 0) {
            return res.status(401).json({
                success : false,
                message : "no todo found",
            })
        }

        return res.status(201).json({
            success : true,
            todo
    
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}