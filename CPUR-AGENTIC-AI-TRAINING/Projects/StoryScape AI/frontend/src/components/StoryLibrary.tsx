import React, { useState } from "react";
import { Search, Filter, BookOpen, Trash2, Calendar, Sparkles } from "lucide-react";
import { Story } from "../types";

interface StoryLibraryProps {
  stories: Story[];
  onOpenStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
  showBookmarkedOnly?: boolean;
}

export default function StoryLibrary({
  stories,
  onOpenStory,
  onDeleteStory,
  showBookmarkedOnly = false,
}: StoryLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");

  const genresInLibrary = ["All", ...Array.from(new Set(stories.map((s) => s.genre)))];

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || story.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6">
      {/* Header filter tools */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories in library..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 text-sm transition"
          />
        </div>

        {/* Genre filtering */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0 hidden md:block" />
          {genresInLibrary.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedGenre === genre
                  ? "bg-purple-600 text-white shadow"
                  : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800/60 rounded-2xl max-w-xl mx-auto flex flex-col items-center p-6">
          <div className="w-16 h-16 bg-purple-900/20 text-purple-400 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">No tales found</h3>
          <p className="text-xs text-slate-400 mt-2 text-center leading-relaxed">
            {searchQuery || selectedGenre !== "All"
              ? "No stories matched your active search filters. Try resetting the queries."
              : "Your storybook shelf is currently empty. Head over to Create Story to start drafting."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => {
            const coverImage = story.chapters[0]?.imageUrl || "https://picsum.photos/seed/storybook/400/300";
            const dateStr = new Date(story.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={story.id}
                className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 hover:border-purple-500/50 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-purple-950/10 flex flex-col justify-between transition-all duration-300 h-[380px]"
              >
                {/* Cover thumbnail */}
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={coverImage}
                    alt={story.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap z-10">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-800/40 text-purple-300 backdrop-blur">
                      {story.genre}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-950/80 text-slate-300 border border-slate-800 backdrop-blur">
                      {story.writingStyle}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1 leading-snug">
                      {story.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                      {story.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-4 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{dateStr}</span>
                    </div>
                    <span className="font-mono text-[10px] text-purple-400">
                      {story.chapters.length} Chapters
                    </span>
                  </div>
                </div>

                {/* Actions bottom rail */}
                <div className="bg-slate-950/80 p-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onOpenStory(story)}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Book</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to permanently erase this masterpiece?")) {
                        onDeleteStory(story.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-transparent hover:bg-red-950/20 text-slate-500 hover:text-red-400 transition cursor-pointer"
                    title="Delete Story"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
