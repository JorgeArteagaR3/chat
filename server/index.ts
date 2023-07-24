import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});

io.on("connection", (socket) => {
    console.log("client connected", socket.id);

    socket.on("message", (body) => {
        console.log(body);
        socket.broadcast.emit("message", {
            ...body,
            from: socket.id.slice(0, 6),
        });
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT:", PORT);
});
