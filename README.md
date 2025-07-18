# VeluTalk

VeluTalk is a real-time chat application built with Next.js, Node.js, and Socket.io.

## Project Structure

This project is organized into two main directories:

- [`/frontend`](./frontend): Next.js-based web application
- [`/backend`](./backend): Node.js server application

Please refer to the README files in each directory for specific setup instructions and documentation:

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)

## Features

- � Real-time messaging with instant updates
- 👥 Group chat rooms for team collaboration
- 🔒 Secure authentication and data protection
- 🌙 Dark mode support
- 🎨 Modern and responsive UI
- ⚡ Fast and reliable performance

## Tech Stack

### Frontend
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Backend
- Node.js
- MongoDB
- Socket.io for real-time communication

### Authentication
- JWT (JSON Web Tokens)
- bcrypt for password hashing
- Create private rooms with unique invite codes
- Join rooms using invite codes
- Room member management and moderation
- Persistent message history

### 📱 Modern UI/UX
- Responsive design for mobile and desktop
- Clean, modern interface with Tailwind CSS
- Dark mode support (coming soon)
- Intuitive user experience

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Next.js 14** - Full-stack React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Beautiful, accessible component library
- **Socket.IO Client** - Real-time WebSocket communication

### Backend
- **Node.js** - JavaScript runtime
- **Next.js API Routes** - Serverless API endpoints
- **Socket.IO Server** - WebSocket server for real-time features
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security

### Database
- **MongoDB Atlas** - Cloud-hosted NoSQL database (free tier)
- **MongoDB Driver** - Native MongoDB driver for Node.js

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sreyansu/velutalk.git
   cd velutalk
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:

   a) **MongoDB URI**:
   - Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
   - Create a new cluster (free tier works fine)
   - Click "Connect" and choose "Connect your application"
   - Copy the connection string and replace `<username>`, `<password>`, and `<cluster-url>` with your details

   b) **JWT Secret**:
   - Generate a secure random string using:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Copy the output and set it as your `JWT_SECRET`

   c) **Other Variables**:
   - Update `NEXT_PUBLIC_API_URL` if deploying to production
   - Configure email settings if implementing email verification
   - Adjust rate limiting values based on your needs

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to \`http://localhost:3000\`

## 📁 Project Structure

```
velutalk/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── rooms/         # Room management endpoints
│   ├── dashboard/         # Dashboard page
│   ├── room/             # Chat room pages
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── navbar.tsx       # Navigation component
│   ├── mode-toggle.tsx  # Theme toggle component
│   └── theme-provider.tsx # Theme context provider
├── lib/                 # Utility libraries
│   ├── mongodb.ts       # Database connection
│   ├── auth.ts         # Authentication helpers
│   └── socket.ts       # Socket.IO setup
├── public/             # Static files
└── styles/            # Global styles
\`\`\`

## 🔧 Configuration

### MongoDB Setup
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to your \`.env.local\` file

### JWT Secret
Generate a secure JWT secret:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - Copy each variable from your `.env.local`
   - Make sure to update `NEXT_PUBLIC_API_URL` to your production URL
   - Set `NODE_ENV` to "production"
   - Double-check that your MongoDB URI and JWT secret are secure
4. Deploy!

> **Security Note**: Never commit your `.env` or `.env.local` files to version control. They contain sensitive information that should be kept private.

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 📖 API Documentation

### Authentication Endpoints
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/verify\` - Token verification

### Room Management
- \`GET /api/rooms\` - Get user's rooms
- \`POST /api/rooms/create\` - Create new room
- \`POST /api/rooms/join\` - Join room with invite code
- \`GET /api/rooms/[id]\` - Get room details
- \`GET /api/rooms/[id]/messages\` - Get room messages

### WebSocket Events
- \`join-room\` - Join a chat room
- \`send-message\` - Send a message
- \`typing\` - Typing indicator
- \`stop-typing\` - Stop typing indicator

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Make your changes
4. Run tests: \`npm test\`
5. Commit your changes: \`git commit -m 'Add amazing feature'\`
6. Push to the branch: \`git push origin feature/amazing-feature\`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Socket.IO](https://socket.io/) - Real-time bidirectional event-based communication
- [MongoDB](https://www.mongodb.com/) - The database for modern applications
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [ShadCN UI](https://ui.shadcn.com/) - Beautiful, accessible components

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/sreyansu/velutalk/issues) page
2. Create a new issue if your problem isn't already reported
3. Consider contributing to make VeluTalks even better!

---

**Made with ❤️ by [Sreyansu](https://github.com/sreyansu)**
