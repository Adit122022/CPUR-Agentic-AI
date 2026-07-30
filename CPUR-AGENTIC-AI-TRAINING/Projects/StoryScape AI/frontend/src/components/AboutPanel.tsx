import React from "react";
import { Info, Sparkles, BookOpen, Volume2, ShieldCheck, Cpu } from "lucide-react";

export default function AboutPanel() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-300">
      {/* Intro banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-tr from-slate-900 to-purple-950/20 p-8 md:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <h2 className="font-display font-extrabold text-3xl text-white mb-4">
          Behind the Magic of <span className="text-purple-400">StoryScape AI</span>
        </h2>
        <p className="text-sm font-light leading-relaxed max-w-2xl text-slate-300">
          StoryScape AI is a premium, full-stack creative engine that utilizes industry-leading generative Artificial Intelligence.
          By combining large language understanding with visual rendering algorithms, it turns simple, raw thoughts into fully-realized living manuscripts.
        </p>
      </div>

      {/* Grid of technical features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core AI Storywriter */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 text-purple-400 flex items-center justify-center border border-purple-800/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-white">Advanced Narrative Modeling</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Powered by **Gemini 3.5 Flash** models, the engine writes substantial prose chapters, designs deep cast directories, and crafts high-fidelity image prompts for every scene.
          </p>
        </div>

        {/* Cinematic Illustration pipeline */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-900/30 text-fuchsia-400 flex items-center justify-center border border-fuchsia-800/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-white">Cinematic Illustration Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our visual synthesis engine renders full aspect-ratio cards matching the narrative context. It integrates complex styles like Pixar 3D, Anime Ghibli, and gothic Dark Fantasy.
          </p>
        </div>

        {/* Ambient Orchestrations */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-900/30 text-sky-400 flex items-center justify-center border border-sky-800/20">
            <Volume2 className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-white">Ambient Web Audio Synthesis</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The application dynamically synthesizes live sound drone chords using the browser's native **Web Audio API**. Oscillators and low-pass sweep filters react to the story's genre to provide reading soundtracks.
          </p>
        </div>

        {/* Security & Integrity */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/30 text-emerald-400 flex items-center justify-center border border-emerald-800/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-white">Secure Full-Stack Server</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            A secure Express.js proxy guards secrets like the Gemini API key. All generations are handled in standard, sandboxed Node.js environments.
          </p>
        </div>
      </div>
    </div>
  );
}
