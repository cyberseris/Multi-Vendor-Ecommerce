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
    origin: ['http://localhost:3000','http://localhost:3001'],
    credentials: true   
}))

const io = socket(server, {
    cors: {
      origin: '*',
      credentials: true
    }
})
// 重整頁面 allCustomer 就會不見
let allCustomer = []
let allSeller = []
let admin = {}

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

const add_seller = (sellerId,socketId,userInfo) => {
    const checkSeller = allSeller.some(u => u.sellerId === sellerId)
    if(!checkSeller){
        allSeller.push({
            sellerId,
            socketId,
            userInfo
        })
    }
}

const findCustomer = (cusTomerId) => {
  return allCustomer.find(c=>c.customerId === cusTomerId)
}

const findSeller = (sellerId) => {
  console.log("findSeller sellerId:", sellerId)
  console.log("findSeller allSeller:", allSeller)
  console.log("findSeller allSeller.find:", allSeller.find(s=>s.sellerId === sellerId))
  return allSeller.find(s=>s.sellerId === sellerId)
}

const remove = (socketId) => {
  allCustomer = allCustomer.filter(c => c.socketId !== socketId)
  allSeller = allSeller.filter(c => c.socketId !== socketId)
} 

io.on('connection', (soc) => {
  soc.on('add_user', (customerId, userInfo) => {
    add_user(customerId,soc.id,userInfo)
    io.emit('activeSeller', allSeller)
  })

  // 這邊有問題待修改, server 斷線, allSeller 會變成 []
  soc.on('add_seller', (sellerId, userInfo) => {
    console.log("=============add_seller===========", sellerId)
    console.log(sellerId, soc.id, userInfo)
    console.log("=============add_seller===========", sellerId)
    add_seller(sellerId, soc.id, userInfo)
    io.emit('activeSeller', allSeller)
  })

  soc.on('send_seller_message', (msg) => {
    /* console.log("send_seller_message: ", msg) */
    const customer = findCustomer(msg.receiverId)
    if(customer){
      soc.to(customer.socketId).emit('seller_message', msg)
    }
  })  

  soc.on('send_customer_message', (msg) => {
      const seller = findSeller(msg.receiverId)
      if(seller){
        soc.to(seller.socketId).emit('customer_message', msg)
      }
  })

  // send_message_admin_to_seller
  soc.on('send_message_admin_to_seller', (msg) => {
      const seller = findSeller(msg.receiverId)
      if(seller){
        soc.to(seller.socketId).emit('received_admin_message', msg)
      }
  })

  soc.on('send_message_seller_to_admin', (msg) => {
      if(admin.socketId){
        soc.to(admin.socketId).emit('received_seller_message', msg)
      }
  })

  soc.on('add_admin', (adminInfo) => {
      delete adminInfo.email
      delete adminInfo.password
      admin = adminInfo
      admin.socketId = soc.id
      io.emit('activeSeller', allSeller)
  })

  soc.on('disconnect', () => {
      console.log('user disconnect....')
      remove(soc.id)
      io.emit('activeSeller', allSeller)
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
app.use('/api', require('./routes/paymentRoutes'))
app.use('/api', require('./routes/dashboard/dashboardRoutes'))

const port = process.env.PORT;

dbConnect();

//未使用 io 前
/* app.listen(port, () => console.log(`Server running on port ${port}`)); */

//使用 io 後, 改用 server 啟動
server.listen(port, () => {
  console.log(`Server + Socket.IO running on port ${port}`)
})
