import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { LinkModel } from "../model/LinkModel.js";
import ContentModel from "../model/ContentModel.js";
import UserModel from "../model/UserModel.js";
import { CatchError } from "../lib/globalErrorFunctions.js";
import crypto from "crypto";

// 1. Logic to turn sharing ON or OFF
export const shareContent = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        const { share } = req.body; // Expecting { share: true } or false
        console.log("User Id --> ", userId);

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (share) {
            // Check if link already exists
            const existingLink = await LinkModel.findOne({ userId });
            if (existingLink) {
                return res.status(200).json({ hash: existingLink.hash });
            }

            // Create a random 10-character hash
            const hash = crypto.randomBytes(5).toString("hex");
            await LinkModel.create({ userId, hash });
            
            return res.status(200).json({ hash });
        } else {
            // Remove the link to stop sharing
            await LinkModel.deleteOne({ userId });
            return res.status(200).json({ message: "Sharing disabled" });
        }
    } catch (error) {
        CatchError(error, res, "Share Toggle Error");
    }
};

// 2. Logic for someone to VIEW a shared brain
export const getSharedBrain = async (req: Request, res: Response) => {
    try {
        const { shareLink } = req.params; // This is the hash from the URL

        const link = await LinkModel.findOne({ hash: shareLink });
        if (!link) {
            return res.status(404).json({ message: "Brain not found or link expired" });
        }

        // Fetch content
        const content = await ContentModel.find({ userId: link.userId });
        
        // Note: With Clerk, we might not have a local UserModel with the same userId.
        // For now, we'll return the content. Username retrieval might need Clerk Backend SDK.
        res.status(200).json({
            content: content
        });
    } catch (error) {
        CatchError(error, res, "Shared Brain Fetch Error");
    }
};