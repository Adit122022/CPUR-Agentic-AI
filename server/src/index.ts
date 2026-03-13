import express from "express";
import ShareRouter from "./routes/share.routes.js";
import AuthRouter from "./routes/auth.routes.js";
import ContentRouter from "./routes/content.routes.js";
import connectDB from "./db/db.js";
import config from "./config/_config.js";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";

const PORT = config.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

// Clerk middleware should be used before any routes
app.use(clerkMiddleware());

connectDB();

// Removed legacy AuthRouter as Clerk handles auth
//  content
app.use("/api/v1/content", ContentRouter);
//  sharing
app.use("/api/v1/brain", ShareRouter);

app.listen(PORT, () => {
  console.log("Server is Runnning.......");
});
