import React, { useState, useEffect } from "react";
import { Sparkles, BookOpen, AlertCircle, Wand2, ArrowRight } from "lucide-react";
import { GenerationParams } from "../types";

interface StoryFormProps {
  initialTopic?: string;
  initialGenre?: string;
  initialStyle?: string;
  isGenerating: boolean;
  onGenerate: (params: GenerationParams) => void;
}

const GENRES = [
  "Fantasy",
  "Science Fiction",
  "Adventure",
  "Mystery",
  "Horror",
  "Romance",
  "Comedy",
  "Thriller",
  "Historical",
  "Kids Story",
];

const WRITING_STYLES = [
  { id: "Pixar", name: "Pixar Style", desc: "Wholesome, colorful, emotional depth, 3D animated feel" },
  { id: "Harry Potter", name: "Harry Potter Style", desc: "Whimsical magic, detailed British world building" },
  { id: "Dark Fantasy", name: "Dark Fantasy Style", desc: "Gothic, dark shadows, atmospheric and epic" },
  { id: "Anime", name: "Studio Ghibli/Anime Style", desc: "Vibrant, highly expressive, mystical cinematic art" },
  { id: "Mythological", name: "Epic Mythological Style", desc: "Grand classical prose, ancient gods and legendary scales" },
  { id: "Cinematic", name: "Theatrical Cinematic Style", desc: "High contrast lighting, photorealistic dramatic focus" },
];

const LENGTHS = [
  { id: "short", label: "Short (3 Chapters)", desc: "Perfect for a quick read (3 chapters)" },
  { id: "medium", label: "Medium (5 Chapters)", desc: "Immersive narrative arc (5 chapters)" },
  { id: "long", label: "Long (8 Chapters)", desc: "Full epic odyssey (8 chapters)" },
];

const AGE_GROUPS = [
  { id: "kids", label: "Kids (5-12)", desc: "Gentle language and playful, wonder-filled prose" },
  { id: "teen", label: "Teens (13-18)", desc: "Sophisticated vocabulary and dynamic action" },
  { id: "adult", label: "Adults (18+)", desc: "Intricate narrative themes and mature world-building" },
];

export default function StoryForm({
  initialTopic = "",
  initialGenre = "Fantasy",
  initialStyle = "Pixar",
  isGenerating,
  onGenerate,
}: StoryFormProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [genre, setGenre] = useState(initialGenre);
  const [writingStyle, setWritingStyle] = useState(initialStyle);
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [ageGroup, setAgeGroup] = useState<"kids" | "teen" | "adult">("teen");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialGenre) setGenre(initialGenre);
    if (initialStyle) setWritingStyle(initialStyle);
  }, [initialTopic, initialGenre, initialStyle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!topic.trim()) {
      setValidationError("Please describe your story topic or core idea.");
      return;
    }

    if (topic.trim().length < 10) {
      setValidationError("Please provide a slightly longer topic (at least 10 characters) for high quality details.");
      return;
    }

    onGenerate({
      topic: topic.trim(),
      genre,
      length,
      ageGroup,
      writingStyle,
    });
  };

  const loadRandomIdea = () => {
    const ideas = [
      "A clockmaker finds a secret chamber behind the shop containing a mechanical heart that beats in sync with the universe.",
      "An astronaut lands on a glass planet where every reflection shows a different possible version of their life.",
      "A friendly ghost runs an underground tea house helping people resolve unfinished business with a cup of chamomile.",
      "A cartographer is hired to map a kingdom that physically changes shape whenever someone tells a lie.",
      "A marine biologist discovers an ancient library preserved inside the shell of a colossal sea turtle.",
    ];
    const genres = ["Fantasy", "Science Fiction", "Mystery", "Adventure", "Kids Story"];
    const styles = ["Pixar", "Harry Potter", "Cinematic", "Anime", "Dark Fantasy"];

    const randomIndex = Math.floor(Math.random() * ideas.length);
    setTopic(ideas[randomIndex]);
    setGenre(genres[randomIndex]);
    setWritingStyle(styles[randomIndex]);
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative">
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white flex items-center gap-2">
            <Sparkles className="text-purple-400 w-6 h-6 animate-pulse" />
            Story Creation Crucible
          </h2>
          <p className="text-xs text-slate-400 mt-1">Sculpt the parameters of your generative tale.</p>
        </div>
        <button
          type="button"
          onClick={loadRandomIdea}
          disabled={isGenerating}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-900/30 text-purple-300 border border-purple-800/50 hover:bg-purple-900/50 transition duration-300 cursor-pointer disabled:opacity-50"
        >
          Inspire Me 🎲
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Story Topic */}
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-2 font-display">
            1. Describe the core legend (Story Topic)
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g., A rusty service robot on an abandoned post-apocalyptic Earth dedicates his remaining solar charge to nursing a tiny, glowing golden seedling."
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition duration-300 resize-none font-sans text-sm leading-relaxed shadow-inner"
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-[11px] text-slate-500">
              Tip: Be descriptive about characters, goals, or places for outstanding illustrations.
            </span>
            <span className="text-[11px] text-slate-600 font-mono">{topic.length} characters</span>
          </div>
        </div>

        {/* Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Genre */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2 font-display">
              2. Genre & Setting
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              disabled={isGenerating}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-100 focus:outline-none focus:border-purple-500 transition duration-300 font-sans text-sm"
            >
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-slate-950 text-slate-300">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2 font-display">
              3. Target Readership (Age Group)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AGE_GROUPS.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setAgeGroup(group.id as any)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                    ageGroup === group.id
                      ? "bg-purple-600/20 text-purple-400 border-purple-500/80 shadow-md shadow-purple-950/20"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/50"
                  }`}
                >
                  <span>{group.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Writing Styles Grid */}
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-3 font-display">
            4. Choose the Visual & Narrative Writing Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WRITING_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                disabled={isGenerating}
                onClick={() => setWritingStyle(style.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 ${
                  writingStyle === style.id
                    ? "bg-purple-600/20 text-purple-400 border-purple-500 shadow-md shadow-purple-950/30"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50"
                }`}
              >
                <div>
                  <p className="text-xs font-bold font-display">{style.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {style.desc}
                  </p>
                </div>
                <span className="text-[10px] font-mono mt-2 self-end text-purple-500/60 font-semibold uppercase">
                  Select
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Story Length */}
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-2 font-display">
            5. Journey Depth (Story Length)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {LENGTHS.map((len) => (
              <button
                key={len.id}
                type="button"
                disabled={isGenerating}
                onClick={() => setLength(len.id as any)}
                className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                  length === len.id
                    ? "bg-purple-600/20 text-purple-400 border-purple-500"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <p className="text-xs font-bold">{len.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{len.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Validation error */}
        {validationError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="relative px-8 py-4 rounded-xl font-display font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isGenerating ? "Casting the Story Spell..." : "Generate Epic Story"}</span>
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
