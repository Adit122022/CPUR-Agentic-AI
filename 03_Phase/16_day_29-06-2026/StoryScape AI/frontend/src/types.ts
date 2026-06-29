export interface Character {
  name: string;
  description: string;
  personality: string;
}

export interface Chapter {
  chapterNumber: number;
  title: string;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  genre: string;
  writingStyle: string;
  ageGroup: string;
  length: string;
  characters: Character[];
  chapters: Chapter[];
  createdAt: string;
  suggestions?: {
    plotTwists?: string[];
    alternateEndings?: string[];
    characterImprovements?: string[];
  };
}

export interface GenerationParams {
  topic: string;
  genre: string;
  length: 'short' | 'medium' | 'long';
  ageGroup: 'kids' | 'teen' | 'adult';
  writingStyle: string;
}
