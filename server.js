var express = require("express");
var app = express();
var MongoClient = require("mongodb").MongoClient;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var server = require("http").Server(app);
var io = require("socket.io")(server);
var Message = require('./app/message');
const dotenv = require('dotenv');
dotenv.config();
server.listen(3000);
//============================
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//============================
var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin:admin@cluster0-rv13h.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {

    if (err) throw err;

    console.log('Successfully connected');
});

// mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }, )
//     .then(() => console.log("DB connect!!"))

// mongoose.connection.on('error', err => {
//     console.log(`DB connect error: ${err.message}`);
// })

//===========================

var mangUsers = [];
io.on("connection", function(socket) {
    var query = Message.find({});
    query.limit(8).exec(function(err, docs) {
        if (err) throw err;
        socket.emit("load-old-mess", docs);
    });
    //kiểm tra có người kết nối
    console.log("co nguoi ket noi: " + socket.id);
    //đăng ký username
    socket.on("client-Send-username", function(data) {
        //dk thất bại
        if (mangUsers.indexOf(data) >= 0) {
            socket.emit("sever-Send-dki-thatbai");
        } else {
            //dk thành công
            mangUsers.push(data);
            socket.Username = data;
            socket.emit("sever-Send-dki-thanhcong", data);
            io.sockets.emit("server-send-danhsach-user", mangUsers);
        };
    });
    //đăng xuất
    socket.on("logOut", function() {
        mangUsers.splice(
            mangUsers.indexOf(socket.Username), 1
        );
        socket.broadcast.emit("server-send-danhsach-user", mangUsers);
    });
    //gửi tin nhắn
    socket.on("user-Send-messages", function(data) {
        var newMsg = new Message({ nick: socket.Username, msg: data });
        newMsg.save(function(err) {
            if (err) throw err;
            io.sockets.emit("server-Send-messages", { nick: socket.Username, msg: data });
        });

    });
    socket.on("mouse-Focus", function() {
        var s = socket.Username + ": đang nhập văn bản";
        io.sockets.emit("mouse-Focus", s);
    });
    socket.on("mouse-Focus-Out", function() {
        io.sockets.emit("mouse-Focus-Out");
    });
    socket.on("create-Rooms", function(data) {
        socket.join(data);
        socket.nameRoom = data;

        var mangRoom = [];
        for (r in socket.adapter.rooms) {
            mangRoom.push(r);
        };
        io.sockets.emit("server-Send-rooms", mangRoom);
        socket.emit("server-Send-roomscanhan", data);
    });
    socket.on("user-Chat-rooms", function(data) {
        io.sockets.in(socket.nameRoom).emit("server-Chat-rooms", { nick: socket.Username, msg: data });
    });
    socket.on("mouse-Focus-rooms", function() {
        var s = socket.Username + ": đang nhập văn bản";
        io.sockets.emit("mouse-Focus-rooms", s);
    });
    socket.on("mouse-Focus-Out-rooms", function() {
        io.sockets.emit("mouse-Focus-Out-rooms");
    });
});
app.get("/", function(req, res) {
    res.render("trangchu");
});