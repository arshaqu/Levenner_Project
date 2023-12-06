const cors = require ('cors');
const express = require('express')
const app = express();
const http = require("http").createServer(app)
require('dotenv').config()   
const dbConfig = require("./Config/dbConfig");
const SI  = require("./Config/sockect.io")
app.use(cors({
    origin:["*"]
}))
app.use(express.json())
const userRoute = require('./routes/userRoute')
const adminRoute=require('./routes/adminRoute')
const port = process.env.PORT || 5000

app.use('/api/user',userRoute)
app.use('/api/admin',adminRoute)

app.use('/product', express.static('./File'));



app.use(cors())
 const server =  http.listen(port, () => console.log(`Nord Server start port at ${port}`))

SI(server)
