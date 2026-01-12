// src/proxy.ts
import { NextRequest, NextResponse } from "next/server"
import { redis } from "./lib/redis"
import { nanoid } from "nanoid"
import { isPreviewBot, logBotDetection } from "./lib/bot-detection"

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname
  const userAgent = req.headers.get("user-agent")

  // Check if this is a bot
  const isBot = isPreviewBot(userAgent)
  logBotDetection(userAgent, isBot)

  const roomMatch = pathname.match(/^\/room\/([^/]+)$/)
  if (!roomMatch) return NextResponse.redirect(new URL("/", req.url))

  const roomId = roomMatch[1]

  const meta = await redis.hgetall<{ connected: string[]; createdAt: number }>(
    `meta:${roomId}`
  )

  if (!meta) {
    return NextResponse.redirect(new URL("/?error=room-not-found", req.url))
  }

  // If this is a preview bot, let it through WITHOUT counting as a participant
  // This allows link previews to work but doesn't fill up the room
  if (isBot) {
    const response = NextResponse.next()
    // Set a header so your app knows this is a bot (optional, for logging)
    response.headers.set("x-is-bot", "true")
    return response
  }

  const existingToken = req.cookies.get("x-auth-token")?.value

  // USER IS ALLOWED TO JOIN ROOM
  if (existingToken && meta.connected.includes(existingToken)) {
    return NextResponse.next()
  }

  // Clean up stale tokens (users who left without explicitly leaving)
  const cleanedConnected = await cleanStaleTokens(roomId, meta.connected)

  // USER IS NOT ALLOWED TO JOIN - Check with cleaned list
  if (cleanedConnected.length >= 2) {
    return NextResponse.redirect(new URL("/?error=room-full", req.url))
  }

  const response = NextResponse.next()

  const token = nanoid()

  response.cookies.set("x-auth-token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  await redis.hset(`meta:${roomId}`, {
    connected: [...cleanedConnected, token],
  })

  // Track activity for this token
  await redis.setex(`activity:${roomId}:${token}`, 120, Date.now()) // 2 min TTL

  return response
}

/**
 * Clean stale tokens from connected array
 * Removes tokens that haven't had activity in the last 2 minutes
 */
async function cleanStaleTokens(
  roomId: string, 
  connected: string[]
): Promise<string[]> {
  if (connected.length === 0) return []

  const now = Date.now()
  const STALE_THRESHOLD = 2 * 60 * 1000 // 2 minutes

  // Check activity for each token
  const activeTokens = await Promise.all(
    connected.map(async (token) => {
      const lastActivity = await redis.get<number>(`activity:${roomId}:${token}`)
      
      // If no activity record or activity is too old, consider it stale
      if (!lastActivity || (now - lastActivity) > STALE_THRESHOLD) {
        return null
      }
      
      return token
    })
  )

  // Filter out null values (stale tokens)
  const cleaned = activeTokens.filter((token): token is string => token !== null)

  // Update Redis if we removed any tokens
  if (cleaned.length !== connected.length) {
    await redis.hset(`meta:${roomId}`, {
      connected: cleaned,
    })
  }

  return cleaned
}

export const config = {
  matcher: "/room/:path*",
}