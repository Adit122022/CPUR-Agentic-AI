import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Ensure local storage directory exists
const DATA_DIR = path.join(process.cwd(), "data");
const STORIES_FILE = path.join(DATA_DIR, "stories.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(STORIES_FILE)) {
  fs.writeFileSync(STORIES_FILE, JSON.stringify([], null, 2), "utf-8");
}

app.use(express.json({ limit: "50mb" }));

// Helper to load stories
const getSavedStories = (): any[] => {
  try {
    const data = fs.readFileSync(STORIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading stories file:", error);
    return [];
  }
};

// Helper to save stories
const saveStoriesToFile = (stories: any[]) => {
  try {
    fs.writeFileSync(STORIES_FILE, JSON.stringify(stories, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving stories file:", error);
  }
};

// Lazy-initialization of Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured. Please define it in the Secrets panel.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Robust Content Generation with Retries and Model Fallback Strategy
async function generateContentWithRetry(
  ai: any,
  config: { model: string; contents: any; config: any },
  retries = 3,
  delayMs = 1500
): Promise<any> {
  const modelsToTry = [
    config.model,          // Primary model requested (e.g. gemini-3.5-flash)
    "gemini-3.5-flash",    // Fast premium fallback
    "gemini-2.5-flash",    // Fast modern fallback
    "gemini-2.0-flash",    // Fast stable fallback
    "gemini-flash-latest", // 1.5 Flash fallback (highly reliable free tier capacity)
    "gemini-2.5-pro",      // Powerful multi-reasoning fallback
  ];

  // Remove duplicates while preserving priority order
  const uniqueModels = Array.from(new Set(modelsToTry));
  let lastError: any = null;

  for (const model of uniqueModels) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[Gemini API] Querying model "${model}" (Attempt ${attempt}/${retries})...`);
        const response = await ai.models.generateContent({
          ...config,
          model,
        });

        if (response && response.text) {
          console.log(`[Gemini API] Successfully generated content using model: ${model}`);
          return response;
        }
        throw new Error("Empty response received from Gemini model.");
      } catch (error: any) {
        lastError = error;
        console.warn(
          `[Gemini API] Error with model "${model}" on attempt ${attempt}/${retries}: ${error.message || error}`
        );

        // Wait with backoff before next attempt with the same model
        if (attempt < retries) {
          const waitTime = delayMs * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content after trying multiple models and retries.");
}

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// Library endpoints
app.get("/api/stories", (req, res) => {
  const stories = getSavedStories();
  res.json(stories);
});

app.post("/api/stories", (req, res) => {
  const newStory = req.body;
  if (!newStory || !newStory.id) {
    return res.status(400).json({ error: "Invalid story data" });
  }

  const stories = getSavedStories();
  const existingIndex = stories.findIndex((s) => s.id === newStory.id);

  if (existingIndex > -1) {
    stories[existingIndex] = { ...stories[existingIndex], ...newStory };
  } else {
    stories.unshift(newStory); // Add to beginning
  }

  saveStoriesToFile(stories);
  res.json({ success: true, story: newStory });
});

app.delete("/api/stories/:id", (req, res) => {
  const { id } = req.params;
  const stories = getSavedStories();
  const filtered = stories.filter((s) => s.id !== id);
  saveStoriesToFile(filtered);
  res.json({ success: true });
});

// Story Generation Endpoint using @google/genai and structured JSON schema
app.post("/api/generate", async (req, res) => {
  try {
    const { topic, genre, length, ageGroup, writingStyle } = req.body;

    if (!topic || !genre) {
      return res.status(400).json({ error: "Topic and Genre are required." });
    }

    const ai = getGeminiClient();

    let chapterCount = 3;
    if (length === "medium") chapterCount = 5;
    if (length === "long") chapterCount = 8;

    const systemInstruction = `You are an award-winning master novelist, creative director, and interactive storyteller.
Your task is to write an exceptionally high-quality, fully realized story based on the user's prompt.
Adhere strictly to the requested constraints:
- Genre: ${genre}
- Target Audience Age Group: ${ageGroup}
- Writing & Literary Style: ${writingStyle}
- Number of Chapters: Generate EXACTLY ${chapterCount} chapters. Do not include fewer or more.

Provide a rich, descriptive title, a hook-filled story summary, a detailed cast of main characters, and the full chapters.
Each chapter MUST have:
1. A unique chapter title.
2. A substantial narrative text (150-300 words per chapter) containing engaging prose, rich descriptions, natural dialogue, and dramatic progression.
3. A highly detailed, custom-tailored image generation prompt that describes a key, cinematic scene from the chapter. Use the selected style (${writingStyle}) to inform the visual description (e.g. dramatic lighting, color palette, camera framing, atmospheric elements).

Keep the content appropriate for the selected age group (${ageGroup}). Ensure the narrative has a satisfying arc (beginning, rising action, climax, and resolution).`;

    const prompt = `Create a spectacular story about: "${topic}".
Generate exactly ${chapterCount} chapters, written beautifully in the style of ${writingStyle}. Ensure it is tailored perfectly for ${ageGroup} readers.`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The official creative and gripping title of the story."
            },
            summary: {
              type: Type.STRING,
              description: "A professional back-cover blurb / summary of the entire story."
            },
            characters: {
              type: Type.ARRAY,
              description: "List of key characters in the story.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the character" },
                  description: { type: Type.STRING, description: "Detailed physical and role description" },
                  personality: { type: Type.STRING, description: "Personality traits, habits, and flaws" }
                },
                required: ["name", "description", "personality"]
              }
            },
            chapters: {
              type: Type.ARRAY,
              description: `List of exactly ${chapterCount} chapters making up the story.`,
              items: {
                type: Type.OBJECT,
                properties: {
                  chapterNumber: { type: Type.INTEGER, description: "The sequential chapter number, starting at 1" },
                  title: { type: Type.STRING, description: "The title of this specific chapter" },
                  text: { type: Type.STRING, description: "The complete prose narrative of this chapter. Make it immersive, dramatic, and substantial (150-300 words)." },
                  imagePrompt: { type: Type.STRING, description: `A spectacular, descriptive image generation prompt. It must describe a specific scene from this chapter in ${writingStyle} visual aesthetic. Focus on subjects, atmospheric lighting, color key, and framing. Do not mention words like 'generate', 'text', or 'chapter'.` }
                },
                required: ["chapterNumber", "title", "text", "imagePrompt"]
              }
            }
          },
          required: ["title", "summary", "characters", "chapters"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini API.");
    }

    const parsedStory = JSON.parse(resultText);

    // Provide default Pollinations AI image urls for each chapter using their generated image prompts
    parsedStory.chapters = parsedStory.chapters.map((ch: any) => {
      const sanitizedPrompt = encodeURIComponent(
        `${writingStyle} style illustration: ${ch.imagePrompt}, beautiful illustration, high quality digital art`
      );
      const seed = Math.floor(Math.random() * 100000);
      return {
        ...ch,
        imageUrl: `https://image.pollinations.ai/prompt/${sanitizedPrompt}?width=800&height=600&nologo=true&seed=${seed}`
      };
    });

    res.json(parsedStory);
  } catch (error: any) {
    console.error("Story generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate story." });
  }
});

// AI Suggestions (plot twists, character improvements, alternate endings)
app.post("/api/suggest", async (req, res) => {
  try {
    const { title, summary, chapters, genre } = req.body;

    if (!title || !chapters) {
      return res.status(400).json({ error: "Missing story details for generating suggestions." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a professional creative editor and script consultant.
Analyze the story titled "${title}" in the genre of "${genre}".
Based on its summary and chapters, generate highly creative suggestions to expand or alter the story.
Provide:
- 3 surprising but logical plot twists that would elevate the drama.
- 2 alternate endings (one bittersweet/happy, one dramatic/mysterious).
- 3 suggestions to deepen the characters' relationships or emotional growth.`;

    const prompt = `Story Summary: ${summary || "N/A"}.
Chapters: ${JSON.stringify(chapters.map((c: any) => ({ title: c.title, text: c.text })))}`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plotTwists: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 unexpected plot twists"
            },
            alternateEndings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 alternative endings"
            },
            characterImprovements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 character development suggestions"
            }
          },
          required: ["plotTwists", "alternateEndings", "characterImprovements"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from suggestions API.");
    }

    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("AI Suggestions error:", error);
    res.status(500).json({ error: error.message || "Failed to generate suggestions." });
  }
});

// Gemini TTS Narration Endpoint
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required for narration." });
    }

    const ai = getGeminiClient();

    // Limit text length to avoid token issues in preview
    const truncatedText = text.length > 800 ? text.substring(0, 800) + "..." : text;

    const selectedVoice = voice || "Kore"; // Kore, Puck, Zephyr, Fenrir, Charon

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say with beautiful dramatic storytelling cadence: ${truncatedText}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio payload returned from Gemini TTS.");
    }

    res.json({ audio: base64Audio });
  } catch (error: any) {
    console.error("TTS error:", error);
    res.status(500).json({ error: error.message || "Failed to generate TTS audio." });
  }
});

// Start application
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[StoryScape AI] Server running on http://localhost:${PORT}`);
  });
}

startServer();
