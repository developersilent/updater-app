import { treaty } from "@elysiajs/eden";
import type { app } from "../app/api/[[...slugs]]/route";

const domain = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// this require .api to enter /api prefix
export const api = treaty<app>(domain).api;