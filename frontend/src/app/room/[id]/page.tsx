"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, Users, Circle } from "lucide-react"
import { io, type Socket } from "socket.io-client"

interface Message {
  _id: string
  content: string
  sender: {
    _id: string
    username: string
  }
  timestamp: string
}

interface Room {
  _id: string
  name: string
  description: string
  members: Array<{
    _id: string
    username: string
  }>
}

interface User {
  _id: string
  username: string
  email: string
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))
    fetchRoomData()
    initializeSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [roomId, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchRoomData = async () => {
    try {
      const token = localStorage.getItem("token")
      const [roomResponse, messagesResponse] = await Promise.all([
        fetch(`/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/rooms/${roomId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (roomResponse.ok && messagesResponse.ok) {
        const roomData = await roomResponse.json()
        const messagesData = await messagesResponse.json()

        setRoom(roomData.room)
        setMessages(messagesData.messages)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to fetch room data:", error)
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const initializeSocket = () => {
    const token = localStorage.getItem("token")
    socketRef.current = io({
      auth: { token },
    })

    socketRef.current.emit("join-room", roomId)

    socketRef.current.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    socketRef.current.on("user-joined", (data: { userId: string; username: string }) => {
      setOnlineUsers((prev) => [...prev.filter((id) => id !== data.userId), data.userId])
    })

    socketRef.current.on("user-left", (data: { userId: string }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId))
    })

    socketRef.current.on("online-users", (users: string[]) => {
      setOnlineUsers(users)
    })

    socketRef.current.on("user-typing", (data: { userId: string; username: string }) => {
      setTypingUsers((prev) => [...prev.filter((u) => u !== data.username), data.username])
    })

    socketRef.current.on("user-stopped-typing", (data: { userId: string; username: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== data.username))
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !socketRef.current) return

    const messageData = {
      roomId,
      content: newMessage.trim(),
    }

    socketRef.current.emit("send-message", messageData)
    setNewMessage("")

    // Stop typing indicator
    socketRef.current.emit("stop-typing", { roomId })
  }

  const handleTyping = () => {
    if (!socketRef.current || !user) return

    socketRef.current.emit("typing", { roomId, username: user.username })

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stop-typing", { roomId })
    }, 1000)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h2>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{room.name}</h1>
              {room.description && <p className="text-sm text-gray-600">{room.description}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <Users className="h-3 w-3 mr-1" />
              {onlineUsers.length} online
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.sender._id === user?._id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                      message.sender._id === user?._id ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{getInitials(message.sender.username)}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.sender._id === user?._id ? "bg-blue-600 text-white" : "bg-white text-gray-900 shadow-sm"
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender._id === user?._id ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {message.sender._id !== user?._id && `${message.sender.username} • `}
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">...</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-200 rounded-lg px-3 py-2">
                      <div className="text-sm text-gray-600">
                        {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t bg-white p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                placeholder="Type a message..."
                className="flex-1"
                maxLength={1000}
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-white border-l">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Members ({room.members.length})</h3>
            <div className="space-y-2">
              {room.members.map((member) => (
                <div key={member._id} className="flex items-center space-x-2">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{getInitials(member.username)}</AvatarFallback>
                    </Avatar>
                    {onlineUsers.includes(member._id) && (
                      <Circle className="absolute -bottom-1 -right-1 h-3 w-3 text-green-500 fill-current" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {member.username}
                      {member._id === user?._id && " (You)"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {onlineUsers.includes(member._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
