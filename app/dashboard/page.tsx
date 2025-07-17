"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, MessageCircle, LogOut, Copy, Check } from "lucide-react"

interface Room {
  _id: string
  name: string
  description: string
  inviteCode: string
  createdBy: string
  members: string[]
  createdAt: string
}

interface User {
  _id: string
  username: string
  email: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))
    fetchRooms()
  }, [router])

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setRooms(data.rooms)
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
        }),
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        fetchRooms()
        // Reset form
        ;(e.target as HTMLFormElement).reset()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create room")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    }
  }

  const handleJoinRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/rooms/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inviteCode: formData.get("inviteCode"),
        }),
      })

      if (response.ok) {
        setIsJoinDialogOpen(false)
        fetchRooms()
        // Reset form
        ;(e.target as HTMLFormElement).reset()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to join room")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const copyInviteCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ChatRoom</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Chat Rooms</h2>
            <p className="text-gray-600 mt-2">Create or join private chat rooms</p>
          </div>
          <div className="flex space-x-3">
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Join Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join a Room</DialogTitle>
                  <DialogDescription>Enter the invite code to join an existing room</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteCode">Invite Code</Label>
                    <Input id="inviteCode" name="inviteCode" placeholder="Enter invite code" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Join Room
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Room</DialogTitle>
                  <DialogDescription>Create a private chat room for your team or friends</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Room Name</Label>
                    <Input id="name" name="name" placeholder="Enter room name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input id="description" name="description" placeholder="What's this room about?" />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Room
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms yet</h3>
            <p className="text-gray-600 mb-6">Create your first room or join an existing one</p>
            <div className="flex justify-center space-x-3">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Room
              </Button>
              <Button variant="outline" onClick={() => setIsJoinDialogOpen(true)}>
                <Users className="h-4 w-4 mr-2" />
                Join Room
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Card key={room._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <Badge variant="secondary">
                      {room.members.length} member{room.members.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  {room.description && <CardDescription>{room.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Invite Code:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{room.inviteCode}</code>
                      <Button size="sm" variant="ghost" onClick={() => copyInviteCode(room.inviteCode)}>
                        {copiedCode === room.inviteCode ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => router.push(`/room/${room._id}`)}>
                    Enter Room
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
