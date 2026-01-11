import { NextRequest, NextResponse } from "next/server"
import { redis } from "./lib/redis"

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname

  // Only protect /room/:roomId routes
  const roomMatch = pathname.match(/^\/room\/([^/]+)$/)
  if (!roomMatch) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  const roomId = roomMatch[1]

  // Fetch room metadata
  const meta = await redis.hgetall<{ connected?: string[] }>(
    `meta:${roomId}`
  )

  // Room does not exist
  if (!meta || !Array.isArray(meta.connected)) {
    return NextResponse.redirect(
      new URL("/?error=room-not-found", req.url)
    )
  }

  /**
   * IMPORTANT:
   * - Do NOT assign tokens here
   * - Do NOT mutate Redis
   * - Joining happens via explicit API call (/api/room/join)
   */

  return NextResponse.next()
}

export const config = {
  matcher: "/room/:path*",
}
