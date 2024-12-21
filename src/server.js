const express = require('express');
const bodyParser = require('body-parser');
const viewEngine = require('./config/viewEngine');
const uploadRouter = require('./routes/uploadRouter');
const adminRouter = require('./routes/loginAdminRouter');
const categoryRouter = require('./routes/theLoaiRouter');
const hangSXRouter = require('./routes/hangSXRouter');
const productRouter = require('./routes/productRouter');
const khRouter = require('./routes/loginKHRouter');
const voucherRouter = require('./routes/voucherRouter');
const orderRouter = require('./routes/orderRouter');
const commentRouter = require('./routes/commentRouter');
const connectDB = require('./config/connectDB');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cron = require('node-cron');
const moment = require('moment');
const WebSocket = require('ws'); // Thêm thư viện WebSocket

require("dotenv").config();

let app = express();
let port = process.env.PORT || 6969;
const hostname = process.env.HOST_NAME;

connectDB();

// Cài đặt CORS
const allowedOrigins = [
    'http://localhost:3006', // Local development - admin
    'http://localhost:3008', // Local development
    'https://bandodientu-admin.vercel.app',
    'https://bandodientu-kt-trangchu.vercel.app',
    'https://admin-dodientu.dokhactu.site',
    'https://shopbandodientu.dokhactu.site',
    'https://backend-bandodientu-node.dokhactu.site'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) { // Dùng includes thay cho indexOf
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,    
    methods: ['GET', 'POST', 'OPTIONS'],  // Cho phép phương thức OPTIONS (preflight)
    allowedHeaders: ['Content-Type', 'Authorization', 'upload-type'],
}));
app.options('*', cors()); // Enable preflight requests for all routes



// Config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Đặt thư mục public/uploads làm public để có thể truy cập
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));


// Config app
viewEngine(app);

const routes = [
    { path: '/api/accadmin', router: adminRouter },
    { path: '/api/category', router: categoryRouter },
    { path: '/api/hangsx', router: hangSXRouter },
    { path: '/api/product', router: productRouter },
    { path: '/api/acckh', router: khRouter },
    { path: '/api/voucher', router: voucherRouter },
    { path: '/api/order', router: orderRouter },
    { path: '/api/comment', router: commentRouter },
];
  
routes.forEach(route => app.use(route.path, route.router));
// // route cho login,register,logout admin
// app.use("/api/accadmin", adminRouter);
// // route cho The Loai
// app.use("/api/category", categoryRouter);
// // route cho hang sx
// app.use("/api/hangsx", hangSXRouter);


// Sử dụng uploadRouter
app.use("/api/upload", uploadRouter); // Đặt đường dẫn cho upload

// WebSocket setup
const wss = new WebSocket.Server({ noServer: true }); // Khởi tạo WebSocket server

let onlineUsers = 0;  // Biến lưu số người dùng online

// // Lắng nghe kết nối WebSocket
// wss.on('connection', (ws) => {
//     const origin = request.headers.origin;
//     if (origin !== 'http://localhost:3000') {  // Replace with your front-end domain
//         ws.close();  // Close the connection if the origin is not allowed
//         return;
//     }

//     onlineUsers++;  // Tăng số người dùng online
//     console.log(`Người dùng kết nối. Tổng số người online: ${onlineUsers}`);

//     // Gửi số lượng người online đến client
//     ws.send(JSON.stringify({ onlineUsers }));

//     // Khi kết nối bị ngắt
//     ws.on('close', () => {
//         onlineUsers--;  // Giảm số người dùng online
//         console.log(`Người dùng ngắt kết nối. Tổng số người online: ${onlineUsers}`);
//     });
// });

// // Tạo kết nối WebSocket với server HTTP
// app.server.on('upgrade', (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request);
//     });
// });

// // Kết nối WebSocket với HTTP server
// app.server = app.listen(port, () => {
//     console.log("Backend Node.js is running on the port:", port, `\n http://localhost:${port}`);
// });


app.get('/dokhactu', (req, res) => {
    setTimeout(function() {
        throw new Error('loi')
    })
})

app.listen(port, () => {
    console.log("backend nodejs is running on the port:", port, `\n http://localhost:${port}`);
});
