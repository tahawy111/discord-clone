"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/", (req, res) => res.send("Hello from socket server"));
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    },
    allowEIO3: true,
});
let users = [];
function addUser(userId, socketId) {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
}
function removeUser(socketId) {
    users = users.filter((socket) => socket.socketId !== socketId);
}
const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
    // When connect
    console.log("a user connected.");
    // after every connection take userId & socketId from user.
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });
    // Send and get message
    socket.on("sendMessage", ({ message, receiverId }) => {
        const user = getUser(receiverId);
        if (!user)
            return; //console.log("user is not exist on socket");
        io.to(user.socketId).emit("getMessage", message);
    });
    socket.on("removeUser", () => {
        console.log("a user disconnected from removeUser.");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
    // When disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected.");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
httpServer.listen(process.env.PORT || 8900);
