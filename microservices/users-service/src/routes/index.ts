import { Hono } from "hono"
import { DeleteController, GetAllController, GetOneByIdController, RegisterController, UpdateController } from "../controllers"

const api = new Hono()

// Get All Users
api.get("/", GetAllController)

// Get One User by ID
api.get("/:id", GetOneByIdController)

// Register a User
api.post("/", RegisterController)

// Update a User
api.put("/:id", UpdateController)

// Delete a User
api.delete("/:id", DeleteController)

// Login
api.post("/login", (c) => {
    return c.json({message: 'Logged', token: "token"})
})


export {api}