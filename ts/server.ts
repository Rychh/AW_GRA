import express = require('express');

const server = express()
const PORT = 3112
import * as path from "path"

// ROUTES
server.use(express.static(path.join(__dirname, '..')))

// SERVER SETUP
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))