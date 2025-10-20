import { Hono } from "hono"
import { GetAllController, GetOneByIdController, RegisterController } from "../controllers"

const api = new Hono()

// Get All Users
api.get("/", GetAllController)

// Get One User by ID
api.get("/:id", GetOneByIdController)

// Register a User
api.post("/", RegisterController)

// Update a User
api.patch("/:id", (c) => {
    const id = c.req.param("id")
    return c.json({message: `User #${id} Updated`})
})

// Delete a User
api.delete("/:id", (c) => {
    const id = c.req.param("id")
    return c.json({message: `User #${id} Deleted`})
})

// Login
api.post("/login", (c) => {
    return c.json({message: 'Logged', token: "token"})
})


export {api}