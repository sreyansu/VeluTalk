import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectDB()

    // Find rooms where user is a member
    const rooms = await db
      .collection("rooms")
      .find({
        members: new ObjectId(user.userId),
      })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ rooms })
  } catch (error) {
    console.error("Fetch rooms error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
