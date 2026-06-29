import React from "react";
import { Sparkles, BookOpen, ChevronRight, Wand2, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onStartCreating: () => void;
  onSelectPreset: (presetTopic: string, presetGenre: string, presetStyle: string) => void;
}

export default function LandingPage({ onStartCreating, onSelectPreset }: LandingPageProps) {
  const presets = [
    {
      title: "The Whispering Willow",
      topic: "A young druid finds a glowing tree that speaks only in riddles about the future.",
      genre: "Fantasy",
      style: "Pixar",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "The Last Robot on Earth",
      topic: "A rusty maintenance unit spends his days watering a single yellow dandelion after humanity left.",
      genre: "Science Fiction",
      style: "Cinematic",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Midnight at the Clockwork Cafe",
      topic: "A cozy secret cafe run by clockwork puppets that opens only during a lunar eclipse.",
      genre: "Mystery",
      style: "Harry Potter",
      image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex flex-col justify-between overflow-hidden bg-bg-dark text-white rounded-2xl border border-slate-800 p-8 md:p-12">
      {/* Decorative Gradient Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl animate-pulse" />

      {/* Floating Sparkles Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full ${
              i % 2 === 0 ? "animate-float-slow" : "animate-float-medium"
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Header Badge */}
      <div className="relative z-10 flex justify-center mb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur text-purple-400 text-xs font-semibold tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
          <span>INTRODUCING STORYSCAPE AI v2.5</span>
        </motion.div>
      </div>

      {/* Hero Body */}
      <div className="relative z-10 max-w-4xl mx-auto text-center my-auto flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-none text-white drop-shadow-xl"
        >
          Turn Your Imagination Into <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-sky-400">
            Living Stories
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed"
        >
          Compose breathtaking stories complete with cinematic illustrations, character directories, and custom audio narration in seconds.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={onStartCreating}
            className="group relative px-8 py-4 rounded-xl font-display font-semibold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Start Creating <Wand2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>
      </div>

      {/* Inspiration Presets Section */}
      <div className="relative z-10 mt-12 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
          <h3 className="font-display font-bold text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" /> Need Inspiration? Select a Premade Quest
          </h3>
          <span className="text-xs text-slate-500">Fast Generation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {presets.map((preset, index) => (
            <motion.div
              key={preset.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
              onClick={() => onSelectPreset(preset.topic, preset.genre, preset.style)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-900/90 flex flex-col justify-between h-44 hover:shadow-xl hover:shadow-purple-950/10"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-800/30">
                    {preset.genre}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <h4 className="font-display font-bold text-base text-white group-hover:text-purple-300 transition-colors leading-snug">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {preset.topic}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Style: {preset.style}</span>
                <span className="text-purple-400 group-hover:underline">Draft now</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
