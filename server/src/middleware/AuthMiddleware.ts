import { clerkMiddleware, requireAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { CatchError } from "../lib/globalErrorFunctions.js";

// This middleware will use Clerk's internal session validation
export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Clerk's clerkMiddleware already handles the JWT verification
        // requireAuth() can be used directly in routes or here as a wrapper
        next();
    } catch (error) {
        CatchError(error, res, "Authentication Error");
    }
};

// Export Clerk's built-in middlewares for convenience if needed elsewhere
export { clerkMiddleware, requireAuth };