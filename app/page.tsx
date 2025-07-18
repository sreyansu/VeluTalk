"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Users, Shield, Zap, Github } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-16">
        <div className="flex flex-col items-center text-center gap-8 pb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">VeluTalks</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[800px]">
            An open-source real-time chat application built with modern technologies.
            Connect, collaborate, and communicate with anyone, anywhere.
          </p>
          <div className="flex gap-4">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="https://github.com/sreyansu/velutalk" target="_blank">
              <Button size="lg" variant="outline">
                <Github className="mr-2 h-4 w-4" />
                Star on GitHub
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <MessageCircle className="h-10 w-10 text-primary" />
                <h3 className="font-bold">Real-time Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Instant messaging with real-time updates and message delivery status.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="font-bold">Group Chats</h3>
                <p className="text-sm text-muted-foreground">
                  Create and join chat rooms for team collaboration or casual conversations.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Shield className="h-10 w-10 text-primary" />
                <h3 className="font-bold">Secure</h3>
                <p className="text-sm text-muted-foreground">
                  End-to-end encryption and secure authentication to protect your privacy.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Zap className="h-10 w-10 text-primary" />
                <h3 className="font-bold">Fast & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Built with modern tech stack for optimal performance and reliability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
          } else {
            localStorage.removeItem("token")
          }
        })
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ChatRoom</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => document.getElementById("login-tab")?.click()}>
                Sign In
              </Button>
              <Button onClick={() => document.getElementById("register-tab")?.click()}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Private Chat Rooms
            <span className="block text-blue-600">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create secure, real-time chat rooms for your team, friends, or community. Up to 50 users per room with
            end-to-end encryption and modern features.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Messaging</h3>
              <p className="text-gray-600">Instant message delivery with typing indicators and online status</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">JWT authentication with encrypted connections and private rooms</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">Create rooms for up to 50 users with invite codes and moderation</p>
            </div>
          </div>

          {/* Auth Section */}
          <div className="max-w-md mx-auto">
            <AuthTabs />
          </div>
        </div>
      </section>
    </div>
  )
}

function AuthTabs() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (endpoint: string, data: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem("token", result.token)
        localStorage.setItem("user", JSON.stringify(result.user))
        router.push("/dashboard")
      } else {
        alert(result.error || "Authentication failed")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    handleAuth("login", {
      email: formData.get("email"),
      password: formData.get("password"),
    })
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    handleAuth("register", {
      username: formData.get("username"),
      email: formData.get("email"),
      password: password,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Join ChatRoom</CardTitle>
        <CardDescription>Sign in to your account or create a new one</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" id="login-tab">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" id="register-tab">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>{" "}
        {/* Expected corresponding JSX closing tag for 'Tabs' */}
      </CardContent>
    </Card>
  )
}
