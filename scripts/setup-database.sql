-- MongoDB setup script (run in MongoDB shell or MongoDB Compass)

-- Create database
use chatroom;

-- Create users collection with indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "lastActive": 1 });

-- Create rooms collection with indexes
db.rooms.createIndex({ "inviteCode": 1 }, { unique: true });
db.rooms.createIndex({ "members": 1 });
db.rooms.createIndex({ "createdBy": 1 });
db.rooms.createIndex({ "createdAt": -1 });

-- Create messages collection with indexes
db.messages.createIndex({ "roomId": 1, "timestamp": 1 });
db.messages.createIndex({ "sender": 1 });
db.messages.createIndex({ "timestamp": -1 });

-- Create sample data (optional)
-- Sample user
db.users.insertOne({
  username: "demo_user",
  email: "demo@example.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6uk6L7Q1JG", // password: "demo123"
  createdAt: new Date(),
  lastActive: new Date()
});

-- Sample room
db.rooms.insertOne({
  name: "General Chat",
  description: "Welcome to the general chat room!",
  inviteCode: "DEMO01",
  createdBy: ObjectId(), // Replace with actual user ID
  members: [ObjectId()], // Replace with actual user ID
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Database setup completed successfully!");
