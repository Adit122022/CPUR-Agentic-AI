import os
import base64
import time
from typing import List, Dict, Any
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from dotenv import load_dotenv

import prompt as pb

# Load environment variables
load_dotenv()

# Define structured schema for story output
class CharacterSchema(BaseModel):
    name: str = Field(description="Name of the character")
    description: str = Field(description="Detailed physical and role description")
    personality: str = Field(description="Personality traits, habits, and flaws")

class ChapterSchema(BaseModel):
    chapterNumber: int = Field(description="The sequential chapter number, starting at 1")
    title: str = Field(description="The title of this specific chapter")
    text: str = Field(description="The complete prose narrative of this chapter. Make it immersive, dramatic, and substantial (150-300 words).")
    imagePrompt: str = Field(description="A spectacular, descriptive image generation prompt. It must describe a specific scene from this chapter. Use the selected style to inform the visual description (e.g. dramatic lighting, color palette, camera framing, atmospheric elements). Do not mention words like 'generate', 'text', or 'chapter'.")

class StorySchema(BaseModel):
    title: str = Field(description="The official creative and gripping title of the story.")
    summary: str = Field(description="A professional back-cover blurb / summary of the entire story.")
    characters: List[CharacterSchema] = Field(description="List of key characters in the story.")
    chapters: List[ChapterSchema] = Field(description="List of chapters making up the story.")

# Define structured schema for suggestion output
class SuggestionSchema(BaseModel):
    plotTwists: List[str] = Field(description="3 unexpected plot twists")
    alternateEndings: List[str] = Field(description="2 alternative endings")
    characterImprovements: List[str] = Field(description="3 character development suggestions")

def get_gemini_client() -> genai.Client:
    """Lazy-initializes the official Gemini API client."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not configured. Please define it in the Secrets panel.")
    
    # Configure client with user-agent header matching the Express server configuration
    return genai.Client(
        api_key=api_key,
        http_options={"headers": {"User-Agent": "aistudio-build"}}
    )

def generate_content_with_retry(
    client: genai.Client,
    model_name: str,
    contents: str,
    config: types.GenerateContentConfig,
    retries: int = 3,
    delay_sec: float = 1.5
) -> Any:
    """
    Robust generation helper with retries and a fallback list of models.
    """
    models_to_try = [
        model_name,            # Primary model requested
        "gemini-3.5-flash",    # Fast premium fallback
        "gemini-2.5-flash",    # Fast modern fallback
        "gemini-2.0-flash",    # Fast stable fallback
        "gemini-flash-latest", # 1.5 Flash fallback
        "gemini-2.5-pro",      # Powerful fallback
    ]
    
    # Filter unique models to avoid redundant attempts
    unique_models = []
    for m in models_to_try:
        if m and m not in unique_models:
            unique_models.append(m)

    last_error = None
    for model in unique_models:
        for attempt in range(1, retries + 1):
            try:
                print(f"[Gemini API] Querying model \"{model}\" (Attempt {attempt}/{retries})...")
                response = client.models.generate_content(
                    model=model,
                    contents=contents,
                    config=config
                )
                if response and response.text:
                    print(f"[Gemini API] Successfully generated content using model: {model}")
                    return response
                raise ValueError("Empty response received from Gemini model.")
            except Exception as error:
                last_error = error
                print(f"[Gemini API] Error with model \"{model}\" on attempt {attempt}/{retries}: {error}")
                if attempt < retries:
                    wait_time = delay_sec * (2 ** (attempt - 1))
                    time.sleep(wait_time)

    raise last_error or RuntimeError("Failed to generate content after trying multiple models and retries.")

def generate_story(topic: str, genre: str, length: str, age_group: str, writing_style: str) -> Dict[str, Any]:
    """
    Generates a full story with characters and chapters matching the requested criteria.
    """
    client = get_gemini_client()
    system_instruction, user_prompt = pb.build_generation_prompts(
        topic=topic,
        genre=genre,
        length=length,
        age_group=age_group,
        writing_style=writing_style
    )

    response = generate_content_with_retry(
        client=client,
        model_name="gemini-3.5-flash",
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=StorySchema,
        )
    )

    # In Python SDK with Pydantic response_schema, response.text is a JSON string
    import json
    return json.loads(response.text)

def generate_suggestions(title: str, summary: str, chapters: List[Dict[str, Any]], genre: str) -> Dict[str, Any]:
    """
    Generates plot twists, character improvements, and alternate endings for a story.
    """
    client = get_gemini_client()
    system_instruction, user_prompt = pb.build_suggestion_prompts(
        title=title,
        summary=summary,
        chapters=chapters,
        genre=genre
    )

    response = generate_content_with_retry(
        client=client,
        model_name="gemini-3.5-flash",
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=SuggestionSchema,
        )
    )

    import json
    return json.loads(response.text)

def generate_tts(text: str, voice: str) -> str:
    """
    Generates Text-to-Speech audio for story narration, returning a base64 encoded string.
    """
    client = get_gemini_client()
    
    # Truncate text to avoid token limits
    truncated_text = text[:800] + "..." if len(text) > 800 else text
    selected_voice = voice or "Kore"

    response = client.models.generate_content(
        model="gemini-3.1-flash-tts-preview",
        contents=f"Say with beautiful dramatic storytelling cadence: {truncated_text}",
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=selected_voice
                    )
                )
            )
        )
    )

    try:
        candidate = response.candidates[0]
        part = candidate.content.parts[0]
        if part.inline_data and part.inline_data.data:
            audio_bytes = part.inline_data.data
            return base64.b64encode(audio_bytes).decode("utf-8")
        raise ValueError("No audio payload returned from Gemini TTS.")
    except (IndexError, AttributeError) as e:
        raise ValueError(f"Failed to parse audio from Gemini TTS response: {e}")
