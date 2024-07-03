const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const conversationRoutes = require("./routes/conversation");
const app = express();
const socket = require("socket.io");
const db = require("./models");
const config = require("./config/app.config");
async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await db.sequelize.authenticate();
    console.log('Database connection OK!');
  } catch (error) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  console.log(`Starting Express server...`);

  // init table
  db.sequelize.sync({ force: false })
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });

  // // drop the table if it already exists
  // db.sequelize.sync({ force: true }).then(() => {
  //   console.log("Drop and re-sync db.");
  // });

  app.use(cors());
  app.use(express.json());

  app.get("/ping", (_req, res) => {
    return res.json({ msg: "Ping Successful" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/conversation", conversationRoutes);

  // handling error
  app.use((_req, _res, next) => {
    const error = new Error('not found');
    error['status'] = 404;
    next(error);
  });

  app.use((error, _req, res, _next) => {
    const statusCode = Number(error.status) || 500;
    return res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message: error.message || 'Internal server error',
    });
  });

  // handling error
  app.use((req, res, next) => {
    const error = new Error('not found');
    error['status'] = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    const statusCode = Number(error.status) || 500;
    return res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message: error.message || 'Internal server error',
    });
  });

  const server = app.listen(config.app.port, () =>
    console.log(`Server started on ${config.app.port}`)
  );
  const io = socket(server, {
    cors: {
      origin: config.feUrl,
      credentials: true,
    },
  });

  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on('join-Conv', async ({ convId, userId }) => {
      socket.join(convId);
      console.log(`User ${userId} has join room ${convId}`);
    });

    socket.on('leave-conv', (convId) => {
      socket.leave(convId);
      console.log(`User ${userId} has leave room ${convId}`);
    });

    socket.on("send-msg", (data) => {
      socket.to(data.to).emit("msg-recieve", data.msg);
    });
  });
}

init()

