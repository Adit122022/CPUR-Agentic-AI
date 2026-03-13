import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { CatchError, TryError } from "../lib/globalErrorFunctions.js";
import ContentModel from "../model/ContentModel.js";

export const addContent = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const { title, link, type } = req.body;

    if (!title || !link) {
      throw TryError("Title and link are required!", 400);
    }

    if (!userId) {
      throw TryError("User not authenticated", 401);
    }

    const newContent = await ContentModel.create({
      title,
      link,
      type,
      userId,
      tags: [],
    });

    res.status(201).json({
      message: "Content added successfully! 🚀",
      data: newContent,
    });
  } catch (error) {
    CatchError(error, res, "Failed to add content");
  }
};

export const getContent = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      throw TryError("User not authenticated", 401);
    }
    const content = await ContentModel.find({ userId }).populate("userId");

    res.json({ message: "User contents", content });
  } catch (error) {
    CatchError(error, res, "Failed to get content");
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const contentId = req.body?.contentId;
    if (!contentId) {
      throw TryError("please enter content id");
    }

    if (!userId) {
      throw TryError("User not authenticated", 401);
    }
    await ContentModel.deleteOne({
      _id: contentId,
      userId,
    });
    res.json({ message: "Deleted" });
  } catch (error) {
    CatchError(error, res, "Failed to delete content");
  }
};
