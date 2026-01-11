import { treaty } from "@elysiajs/eden"
import type { App } from "../app/api/[[...slugs]]/route"

const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL!
    : window.location.origin

export const client = treaty<App>(baseUrl).api
