const express = require("express");

const http = require("http");

const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const { userRouter } = require("./Routes/userRoutes");
const { connection } = require("./db");
const { Message } = require("./Model/MessageModel");
const app = express();
app.use(cors());

app.use(express.json());
app.use("/users", userRouter);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log("Message sent:", data);
    socket.to(data.room).emit("receive_message", data);
  });
  // socket.on("send_message", async (data) => {
  //   try {
  //     const newMessage = new Message(data);
  //     await newMessage.save();
  //     io.to(data.room).emit("receive_message", data);
  //   } catch (error) {
  //     console.error("Error saving message:", error);
  //   }
  // });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
const port = 3001;

app.listen(port, async () => {
  console.log(`server is running on ${port}`);
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
    console.log("error in connectiong");
  }
});
