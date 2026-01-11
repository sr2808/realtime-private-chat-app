# Private Chat

A secure, private, and self-destructing chat room application built with Next.js 16, Elysia.js, and Upstash Redis. Messages are ephemeral and rooms automatically expire after a set time.

## Features

- **Private Rooms**: Create secure chat rooms with unique IDs
- **Self-Destruct Timer**: Rooms automatically expire after 10 minutes
- **Real-time Messaging**: Instant message delivery using WebSocket connections
- **Ephemeral Messages**: All messages are temporary and disappear with the room
- **Anonymous Identity**: Users get randomly generated anonymous usernames
- **Copy Room Link**: Easy sharing with one-click room link copying
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark interface with green accents

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Elysia.js API framework
- **Database**: Upstash Redis for real-time data storage
- **Real-time**: Upstash Realtime for WebSocket connections
- **State Management**: React Query for server state
- **Validation**: Zod for runtime type validation
- **Fonts**: JetBrains Mono for terminal-style aesthetics

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Upstash Redis account (free tier available)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd private-chat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

Get your Upstash credentials from [https://upstash.com](https://upstash.com):
1. Create a free account
2. Create a new Redis database
3. Copy the REST URL and REST TOKEN

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── [[...slugs]]/  # Catch-all API route
│   ├── room/[roomId]/     # Dynamic room pages
│   ├── layout.tsx         # Root layout with font setup
│   ├── page.tsx           # Home page (room creation)
│   └── globals.css        # Global styles with Tailwind
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── client.ts          # API client configuration
│   ├── redis.ts           # Upstash Redis client
│   └── realtime.ts        # Real-time messaging
└── hooks/                 # Custom React hooks
```

### API Endpoints

- `POST /api/room/create` - Create a new chat room
- `POST /api/messages` - Send a message to a room (query: roomId)

### Key Components

#### Room Creation Flow
1. User clicks "CREATE SECURE ROOM" on homepage
2. Frontend generates anonymous username if not exists
3. API creates room with unique ID and 10-minute TTL
4. User is redirected to `/room/{roomId}`

#### Message Flow
1. User types message and presses Enter
2. Message is sent via API with sender and roomId
3. Message is stored in Redis list `messages:{roomId}`
4. Real-time updates broadcast to all connected clients

#### Self-Destruct Mechanism
- Rooms expire after 10 minutes (configurable via `ROOM_TTL_SECONDS`)
- All associated data (metadata, messages) is automatically cleaned up
- Timer displayed in room header shows remaining time

## Usage Guide

### Creating a Room
1. Visit the homepage
2. Your anonymous identity is automatically generated
3. Click "CREATE SECURE ROOM"
4. Share the room link with others

### Joining a Room
1. Open the shared room link
2. Your identity is preserved from localStorage
3. Start typing messages in the input field
4. Press Enter to send messages

### Room Features
- **Room ID**: Unique identifier displayed in header
- **Copy Link**: Click to copy room URL to clipboard
- **Self-Destruct Timer**: Shows remaining room lifetime
- **Destroy Now**: Manual room destruction (coming soon)

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for utility-first styling
- React Query for server state management
- Zod for API validation
- JetBrains Mono for consistent typography

### Key Files to Modify

- `src/app/api/[[...slugs]]/route.ts` - API logic and room management
- `src/app/room/[roomId]/page.tsx` - Room UI and messaging
- `src/lib/redis.ts` - Redis configuration
- `tailwind.config.js` - Styling configuration (if needed)

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
- Ensure Node.js 18+ is available
- Set environment variables
- Run `npm run build` and `npm start`

## Security Considerations

- Rooms are ephemeral and automatically expire
- No persistent user accounts or data storage
- Anonymous usernames prevent identity tracking
- Redis data is encrypted at rest (Upstash)
- No sensitive data is logged or stored permanently

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. Feel free to use, modify, and distribute.

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and reproduction steps

---

Built with ❤️ for private, ephemeral conversations.