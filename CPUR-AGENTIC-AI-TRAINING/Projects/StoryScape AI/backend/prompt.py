def get_chapter_count(length_id: str) -> int:
    """Helper to convert length string to chapter count."""
    if length_id == "short":
        return 3
    elif length_id == "long":
        return 8
    else:  # default to medium
        return 5

def build_generation_prompts(topic: str, genre: str, length: str, age_group: str, writing_style: str) -> tuple[str, str]:
    """
    Builds the system instruction and user prompt for story generation.
    Returns: (system_instruction, user_prompt)
    """
    chapter_count = get_chapter_count(length)
    
    system_instruction = (
        "You are an award-winning master novelist, creative director, and interactive storyteller.\n"
        "Your task is to write an exceptionally high-quality, fully realized story based on the user's prompt.\n"
        "Adhere strictly to the requested constraints:\n"
        f"- Genre: {genre}\n"
        f"- Target Audience Age Group: {age_group}\n"
        f"- Writing & Literary Style: {writing_style}\n"
        f"- Number of Chapters: Generate EXACTLY {chapter_count} chapters. Do not include fewer or more.\n\n"
        "Provide a rich, descriptive title, a hook-filled story summary, a detailed cast of main characters, and the full chapters.\n"
        "Each chapter MUST have:\n"
        "1. A unique chapter title.\n"
        "2. A substantial narrative text (150-300 words per chapter) containing engaging prose, rich descriptions, natural dialogue, and dramatic progression.\n"
        f"3. A highly detailed, custom-tailored image generation prompt that describes a key, cinematic scene from the chapter. Use the selected style ({writing_style}) to inform the visual description (e.g. dramatic lighting, color palette, camera framing, atmospheric elements).\n\n"
        f"Keep the content appropriate for the selected age group ({age_group}). Ensure the narrative has a satisfying arc (beginning, rising action, climax, and resolution)."
    )
    
    user_prompt = (
        f'Create a spectacular story about: "{topic}".\n'
        f"Generate exactly {chapter_count} chapters, written beautifully in the style of {writing_style}. Ensure it is tailored perfectly for {age_group} readers."
    )
    
    return system_instruction, user_prompt

def build_suggestion_prompts(title: str, summary: str, chapters: list[dict], genre: str) -> tuple[str, str]:
    """
    Builds the system instruction and user prompt for creative suggestions.
    Returns: (system_instruction, user_prompt)
    """
    system_instruction = (
        f'You are a professional creative editor and script consultant.\n'
        f'Analyze the story titled "{title}" in the genre of "{genre}".\n'
        f'Based on its summary and chapters, generate highly creative suggestions to expand or alter the story.\n'
        f'Provide:\n'
        f'- 3 surprising but logical plot twists that would elevate the drama.\n'
        f'- 2 alternate endings (one bittersweet/happy, one dramatic/mysterious).\n'
        f'- 3 suggestions to deepen the characters\' relationships or emotional growth.'
    )
    
    simplified_chapters = [{"title": ch.get("title", ""), "text": ch.get("text", "")} for ch in chapters]
    
    user_prompt = (
        f"Story Summary: {summary or 'N/A'}.\n"
        f"Chapters: {simplified_chapters}"
    )
    
    return system_instruction, user_prompt
