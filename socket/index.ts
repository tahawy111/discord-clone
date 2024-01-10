import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
app.use(cors());

app.get("/", (req, res) => res.send("Hello from socket server"));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  allowEIO3: true,
});

type UserType = {
  userId: string;
  socketId: string;
};

let users: UserType[] = [];

type MessageType = {
  id: string;
  body: string | null;
  image: string | null;
  createdAt: Date;
  seenIds: string[];
  conversationId: string;
  senderId: string;
};

function addUser(userId: string, socketId: string): void {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
}
function removeUser(socketId: string) {
  users = users.filter((socket) => socket.socketId !== socketId);
}

const getUser = (userId: string) => {
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
  socket.on(
    "sendMessage",
    ({ message, receiverId }: { message: MessageType; receiverId: string }) => {
      const user = getUser(receiverId);
      console.log(message);
      

      if (!user) return; //console.log("user is not exist on socket");

      io.to(user.socketId).emit("getMessage", message);
    }
  );

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
