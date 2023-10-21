import express from "express";


const mainRouter = express.Router()
mainRouter.get('/', (req, res) => {
    res.send({
        "message": "[INFO] - Server is up ! You can make requests."
    })
})

export default mainRouter