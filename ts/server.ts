/*const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))*/

import {Express} from "express";

const server = Express.express()
const PORT = 3112

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
