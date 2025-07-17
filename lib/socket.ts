import type { Server as HTTPServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import jwt from "jsonwebtoken"
import { connectDB } from "./mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function initializeSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  })

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error("Authentication error"))
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any
      socket.userId = decoded.userId
      socket.username = decoded.username

      next()
    } catch (error) {
      next(new Error("Authentication error"))
    }
  })

  const onlineUsers = new Map<string, Set<string>>() // roomId -> Set of userIds

  io.on("connection", (socket) => {
    console.log(`User ${socket.username} connected`)

    socket.on("join-room", async (roomId: string) => {
      try {
        const { db } = await connectDB()

        // Verify user is member of room
        const room = await db.collection("rooms").findOne({
          _id: new ObjectId(roomId),
          members: new ObjectId(socket.userId),
        })

        if (!room) {
          socket.emit("error", "Access denied")
          return
        }

        socket.join(roomId)
        socket.currentRoom = roomId

        // Track online users
        if (!onlineUsers.has(roomId)) {
          onlineUsers.set(roomId, new Set())
        }
        onlineUsers.get(roomId)!.add(socket.userId)

        // Notify room about user joining
        socket.to(roomId).emit("user-joined", {
          userId: socket.userId,
          username: socket.username,
        })

        // Send current online users to the joining user
        const roomOnlineUsers = Array.from(onlineUsers.get(roomId) || [])
        socket.emit("online-users", roomOnlineUsers)
      } catch (error) {
        console.error("Join room error:", error)
        socket.emit("error", "Failed to join room")
      }
    })

    socket.on("send-message", async (data: { roomId: string; content: string }) => {
      try {
        const { roomId, content } = data

        if (!content || content.trim().length === 0) {
          return
        }

        const { db } = await connectDB()

        // Verify user is member of room
        const room = await db.collection("rooms").findOne({
          _id: new ObjectId(roomId),
          members: new ObjectId(socket.userId),
        })

        if (!room) {
          socket.emit("error", "Access denied")
          return
        }

        // Save message to database
        const message = {
          roomId: new ObjectId(roomId),
          sender: new ObjectId(socket.userId),
          content: content.trim(),
          timestamp: new Date(),
        }

        const result = await db.collection("messages").insertOne(message)

        // Get message with sender info
        const savedMessage = await db
          .collection("messages")
          .aggregate([
            { $match: { _id: result.insertedId } },
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [{ $project: { username: 1 } }],
              },
            },
            { $unwind: "$sender" },
          ])
          .toArray()

        // Broadcast message to room
        io.to(roomId).emit("new-message", savedMessage[0])
      } catch (error) {
        console.error("Send message error:", error)
        socket.emit("error", "Failed to send message")
      }
    })

    socket.on("typing", (data: { roomId: string; username: string }) => {
      socket.to(data.roomId).emit("user-typing", {
        userId: socket.userId,
        username: data.username,
      })
    })

    socket.on("stop-typing", (data: { roomId: string }) => {
      socket.to(data.roomId).emit("user-stopped-typing", {
        userId: socket.userId,
        username: socket.username,
      })
    })

    socket.on("disconnect", () => {
      console.log(`User ${socket.username} disconnected`)

      if (socket.currentRoom) {
        const roomUsers = onlineUsers.get(socket.currentRoom)
        if (roomUsers) {
          roomUsers.delete(socket.userId)
          if (roomUsers.size === 0) {
            onlineUsers.delete(socket.currentRoom)
          }
        }

        socket.to(socket.currentRoom).emit("user-left", {
          userId: socket.userId,
        })
      }
    })
  })

  return io
}
