const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./utils/db');
const socket = require('socket.io')
const http = require('http')
const server = http.createServer(app)

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true   
}))

const io = socket(server, {
    cors: {
      origin: '*',
      credentials: true
    }
})

let allCustomer = []
const add_user = (customerId,socketId,userInfo) => {
    const checkUser = allCustomer.some(u => u.customerId === customerId)
    if(!checkUser){
        allCustomer.push({
            customerId,
            socketId,
            userInfo
        })
    }
}


io.on('connection', (soc) => {
  soc.on('add_user', (customerId, userInfo) => {
    add_user(customerId,soc.id,userInfo)
/*     console.log("allCustomer: ", allCustomer) */
  })
})

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/home', require('./routes/home/homeRoutes'))
app.use('/api', require('./routes/authRoutes'))
app.use('/api', require('./routes/dashboard/categoryRoutes'))
app.use('/api', require('./routes/dashboard/productRoutes'))
app.use('/api', require('./routes/dashboard/sellerRoutes'))
app.use('/api', require('./routes/home/customerAuthRoutes'))
app.use('/api', require('./routes/home/cartRoutes'))
app.use('/api', require('./routes/order/orderRoutes'))
app.use('/api', require('./routes/chat/chatRoutes'))

const port = process.env.PORT;

dbConnect();

//未使用 io 前
/* app.listen(port, () => console.log(`Server running on port ${port}`)); */

//使用 io 後, 改用 server 啟動
server.listen(port, () => {
  console.log(`Server + Socket.IO running on port ${port}`)
})
