import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/chatroom"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db()

    // Create indexes for better performance
    await Promise.all([
      db.collection("users").createIndex({ email: 1 }, { unique: true }),
      db.collection("users").createIndex({ username: 1 }, { unique: true }),
      db.collection("rooms").createIndex({ inviteCode: 1 }, { unique: true }),
      db.collection("rooms").createIndex({ members: 1 }),
      db.collection("messages").createIndex({ roomId: 1, timestamp: 1 }),
      db.collection("messages").createIndex({ sender: 1 }),
    ])

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}
