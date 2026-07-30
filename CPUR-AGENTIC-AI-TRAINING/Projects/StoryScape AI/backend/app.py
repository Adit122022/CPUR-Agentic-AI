import os
import random
import urllib.parse
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import gemini

app = FastAPI(title="StoryScape AI API Server")

# Allow CORS for development proxying
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths for database storage
DATA_DIR = os.path.join(os.getcwd(), "data")
STORIES_FILE = os.path.join(DATA_DIR, "stories.json")

# Ensure storage setup exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR, exist_ok=True)

if not os.path.exists(STORIES_FILE):
    import json
    with open(STORIES_FILE, "w", encoding="utf-8") as f:
        json.dump([], f)

# Request schemas
class StoryGenerateParams(BaseModel):
    topic: str
    genre: str
    length: str
    ageGroup: str
    writingStyle: str

class SuggestParams(BaseModel):
    title: str
    summary: str
    chapters: list
    genre: str

class TTSParams(BaseModel):
    text: str
    voice: str = "Kore"

# Local storage helpers
def get_saved_stories() -> list:
    try:
        if os.path.exists(STORIES_FILE):
            import json
            with open(STORIES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        return []
    except Exception as error:
        print("Error reading stories file:", error)
        return []

def save_stories(stories: list):
    try:
        import json
        with open(STORIES_FILE, "w", encoding="utf-8") as f:
            json.dump(stories, f, indent=2, ensure_ascii=False)
    except Exception as error:
        print("Error saving stories file:", error)

# Health Check Route
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "geminiConfigured": bool(os.getenv("GEMINI_API_KEY"))
    }

# Stories Shelf Endpoints
@app.get("/api/stories")
async def list_stories():
    return get_saved_stories()

@app.post("/api/stories")
async def save_story(story: dict):
    if not story or "id" not in story:
        return JSONResponse(status_code=400, content={"error": "Invalid story data"})
    
    stories = get_saved_stories()
    existing_index = next((i for i, s in enumerate(stories) if s.get("id") == story["id"]), -1)
    
    if existing_index > -1:
        stories[existing_index] = {**stories[existing_index], **story}
    else:
        stories.insert(0, story)
        
    save_stories(stories)
    return {"success": True, "story": story}

@app.delete("/api/stories/{story_id}")
async def delete_story(story_id: str):
    stories = get_saved_stories()
    filtered = [s for s in stories if s.get("id") != story_id]
    save_stories(filtered)
    return {"success": True}

# Content Generation Endpoint
@app.post("/api/generate")
async def generate_story(params: StoryGenerateParams):
    if not params.topic or not params.genre:
        return JSONResponse(status_code=400, content={"error": "Topic and Genre are required."})
        
    try:
        story_data = gemini.generate_story(
            topic=params.topic,
            genre=params.genre,
            length=params.length,
            age_group=params.ageGroup,
            writing_style=params.writingStyle
        )
        
        # Inject Pollinations AI image generation URLs for each chapter illustration
        for ch in story_data.get("chapters", []):
            image_prompt = ch.get("imagePrompt", "")
            sanitized = urllib.parse.quote(
                f"{params.writingStyle} style illustration: {image_prompt}, beautiful illustration, high quality digital art"
            )
            seed = random.randint(0, 100000)
            ch["imageUrl"] = f"https://image.pollinations.ai/prompt/{sanitized}?width=800&height=600&nologo=true&seed={seed}"
            
        return story_data
    except Exception as error:
        print("Story generation error:", error)
        return JSONResponse(status_code=500, content={"error": str(error) or "Failed to generate story."})

# Editor Suggestions Endpoint
@app.post("/api/suggest")
async def get_suggestions(params: SuggestParams):
    if not params.title or not params.chapters:
        return JSONResponse(status_code=400, content={"error": "Missing story details for generating suggestions."})
        
    try:
        suggestions = gemini.generate_suggestions(
            title=params.title,
            summary=params.summary,
            chapters=params.chapters,
            genre=params.genre
        )
        return suggestions
    except Exception as error:
        print("Suggestions generation error:", error)
        return JSONResponse(status_code=500, content={"error": str(error) or "Failed to generate suggestions."})

# Text-To-Speech Narration Endpoint
@app.post("/api/tts")
async def get_tts(params: TTSParams):
    if not params.text:
        return JSONResponse(status_code=400, content={"error": "Text is required for narration."})
        
    try:
        audio_base64 = gemini.generate_tts(text=params.text, voice=params.voice)
        return {"audio": audio_base64}
    except Exception as error:
        print("TTS generation error:", error)
        return JSONResponse(status_code=500, content={"error": str(error) or "Failed to generate TTS audio."})

# SPA Route Middleware
# Serves static files from dist directory, falling back to index.html for SPA routes.
dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))


@app.middleware("http")
async def spa_middleware(request: Request, call_next):
    path = request.url.path
    
    # Let FastAPI router handle the API requests
    if path.startswith("/api"):
        return await call_next(request)
        
    if os.path.exists(dist_path):
        # Look for the exact file inside dist
        file_path = os.path.join(dist_path, path.lstrip("/"))
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # SPA fallback - serve index.html for frontend routing paths (e.g. /library)
        index_file = os.path.join(dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
            
    return await call_next(request)

if __name__ == "__main__":
    import uvicorn
    # Port 3000 is used to match Express dev port and keep URL consistency
    uvicorn.run("app:app", host="0.0.0.0", port=3000, reload=True)
