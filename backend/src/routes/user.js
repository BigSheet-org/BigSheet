import express from "express";

const userRouter = express.Router()
userRouter
    /**
     * Personnal getter for the logged in user.
     */
    .get('/me', (req, res) => {

    })

export default userRouter