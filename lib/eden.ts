import { treaty } from "@elysiajs/eden";
import type { app } from "../app/api/[[...slugs]]/route";

// this require .api to enter /api prefix
export const api = treaty<app>(process.env.NEXT_PUBLIC_URL!).api;