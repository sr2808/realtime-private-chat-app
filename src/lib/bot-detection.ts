// src/lib/bot-detection.ts

/**
 * List of known user agents from link preview bots and crawlers
 * These should NOT be counted as real users in chat rooms
 */
const PREVIEW_BOT_PATTERNS = [
  // Messaging apps
  'WhatsApp',
  'facebookexternalhit',
  'FacebookBot',
  'Twitterbot',
  'Twitter',
  'TelegramBot',
  'Slackbot',
  'LinkedInBot',
  'DiscordBot',
  'Discordbot',
  'SkypeUriPreview',
  
  // Social media crawlers
  'Pinterest',
  'Pinterestbot',
  'Instagram',
  
  // Search engines
  'Googlebot',
  'Bingbot',
  'Slurp', // Yahoo
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  
  // Other crawlers
  'Embedly',
  'Applebot',
  'redditbot',
  'Tumblr',
  'bitlybot',
  'vkShare',
  'quora link preview',
  'developers.google.com/+/web/snippet',
  'rogerbot',
  'showyoubot',
  'outbrain',
  'Lighthouse',
  
  // Generic bot indicators
  'crawler',
  'spider',
  'bot',
  'preview',
  'scraper',
  'http',
  'axios',
  'curl',
  'wget',
]

/**
 * Detects if a request is from a link preview bot or crawler
 */
export function isPreviewBot(userAgent: string | null): boolean {
  if (!userAgent) {
    // No user agent is suspicious, likely a bot
    return true
  }

  const lowerUserAgent = userAgent.toLowerCase()

  return PREVIEW_BOT_PATTERNS.some(pattern => 
    lowerUserAgent.includes(pattern.toLowerCase())
  )
}

/**
 * Log bot detection for debugging purposes
 */
export function logBotDetection(userAgent: string | null, isBot: boolean) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Bot Detection]", {
      userAgent: userAgent?.substring(0, 100),
      isBot,
      timestamp: new Date().toISOString(),
    })
  }
}