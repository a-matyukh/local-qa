import express from "express"
import multer from "multer"
import cors from "cors"
import {set_document_text} from "./functions.js"

const app = express()
const upload = multer()
app.use(cors())

let chain = null

app.post('/set-text', upload.none(), async (req, res) => {
    chain = await set_document_text(req.body.text)
    res.json("text setted")
})
app.post('/qa', upload.none(), async (req, res) => {
    if (chain) {
        if (req.body.question) {
            const response = await chain.call({query: req.body.question})
            res.json(response.text.trim())
        } else {
            res.json("set your question")
        }
    } else {
        res.json("load your text")
    }
})
app.listen(3666)
console.log('ready')