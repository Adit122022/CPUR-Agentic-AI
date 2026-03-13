import dotenv from "dotenv"
dotenv.config()


  const _config  = {
    PORT : process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || "dev",
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
 }

 const config = Object.freeze(_config);
  export default config