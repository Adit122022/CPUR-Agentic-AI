import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Download,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sparkles,
  BookOpen,
  ArrowDownToLine,
  HelpCircle,
  Clock,
  Heart,
  RotateCcw
} from "lucide-react";
import { Story, Chapter } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
  onSaveStory: (story: Story) => void;
  isSavedInLibrary: boolean;
}

export default function StoryReader({ story, onBack, onSaveStory, isSavedInLibrary }: StoryReaderProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAmbientSynthActive, setIsAmbientSynthActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [ttsEngine, setTtsEngine] = useState<"browser" | "gemini">("browser");
  const [geminiAudioUrl, setGeminiAudioUrl] = useState<string | null>(null);
  const [isGeminiTtsLoading, setIsGeminiTtsLoading] = useState(false);

  // Creative Suggestions State
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [activeSuggestionTab, setActiveSuggestionTab] = useState<"twist" | "ending" | "character">("twist");

  // Web Speech Synth ref
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // Audio tags for Gemini TTS
  const geminiAudioRef = useRef<HTMLAudioElement | null>(null);
  // Web Audio Synth ref
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);

  const currentChapter: Chapter = story.chapters[currentChapterIndex] || story.chapters[0];

  // Simulated sound generator based on genre using Web Audio API
  const startAmbientSynth = () => {
    try {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Create low cozy chords or drones
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";

      if (story.genre.toLowerCase().includes("sci") || story.genre.toLowerCase().includes("space")) {
        // Space sci-fi style drone
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(165, ctx.currentTime); // E3
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        // LFO for filter sweep
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(200, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        synthNodesRef.current.push(lfo);
      } else if (story.genre.toLowerCase().includes("horror") || story.genre.toLowerCase().includes("thriller")) {
        // Eerie horror style drone
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(82.41, ctx.currentTime); // E2
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(116.54, ctx.currentTime); // A#2 (Tritone for suspense!)
        filter.frequency.setValueAtTime(250, ctx.currentTime);
      } else {
        // Celestial Fantasy cozy drone
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(196.00, ctx.currentTime); // G3
        filter.frequency.setValueAtTime(600, ctx.currentTime);
      }

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      synthNodesRef.current.push(osc1, osc2, gainNode, filter);
      setIsAmbientSynthActive(true);
    } catch (e) {
      console.error("Web Audio API not fully supported or blocked:", e);
    }
  };

  const stopAmbientSynth = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    synthNodesRef.current = [];
    setIsAmbientSynthActive(false);
  };

  // Text typewriter animation
  useEffect(() => {
    if (!currentChapter) return;
    setTypedText("");
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + currentChapter.text.charAt(index));
      index++;
      if (index >= currentChapter.text.length) {
        clearInterval(interval);
      }
    }, 12); // fast typewriter

    // Reset audio state between chapters
    stopTextToSpeech();
    setGeminiAudioUrl(null);

    return () => {
      clearInterval(interval);
    };
  }, [currentChapterIndex]);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      stopAmbientSynth();
      stopTextToSpeech();
    };
  }, []);

  // Web Speech synthesis voice options
  const startBrowserTts = () => {
    if (!currentChapter) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentChapter.text);
    utteranceRef.current = utterance;

    // Pick a storyteller voice
    const voices = window.speechSynthesis.getVoices();
    const storytellingVoice = voices.find(
      (v) =>
        v.name.includes("Google US English") ||
        v.name.includes("Natural") ||
        v.lang.startsWith("en")
    );
    if (storytellingVoice) utterance.voice = storytellingVoice;

    // Set voice characteristics
    utterance.rate = 0.95; // cinematic pacing
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Real server-side Gemini TTS
  const startGeminiTts = async () => {
    if (!currentChapter) return;
    setIsGeminiTtsLoading(true);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: currentChapter.text,
          voice: story.ageGroup === "kids" ? "Puck" : "Kore", // Puck is friendly, Kore is premium adult
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const base64Audio = data.audio;
      // Convert base64 to Blob URL
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);

      setGeminiAudioUrl(audioUrl);
      setIsPlayingAudio(true);

      // Play audio
      setTimeout(() => {
        if (geminiAudioRef.current) {
          geminiAudioRef.current.play().catch((err) => {
            console.error("Playback error:", err);
            setIsPlayingAudio(false);
          });
        }
      }, 100);
    } catch (err) {
      console.error("Gemini TTS Error, falling back to local speech engine:", err);
      // Fallback
      startBrowserTts();
    } finally {
      setIsGeminiTtsLoading(false);
    }
  };

  const handleTtsPlayback = () => {
    if (isPlayingAudio) {
      stopTextToSpeech();
    } else {
      if (ttsEngine === "browser") {
        startBrowserTts();
      } else {
        if (geminiAudioUrl) {
          geminiAudioRef.current?.play().then(() => setIsPlayingAudio(true));
        } else {
          startGeminiTts();
        }
      }
    }
  };

  const stopTextToSpeech = () => {
    window.speechSynthesis.cancel();
    if (geminiAudioRef.current) {
      geminiAudioRef.current.pause();
    }
    setIsPlayingAudio(false);
  };

  // Creative Suggestions fetch
  const handleFetchSuggestions = async () => {
    setIsLoadingSuggestions(true);
    setSuggestions(null);

    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: story.title,
          summary: story.summary,
          chapters: story.chapters,
          genre: story.genre,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setSuggestions(data);
    } catch (err) {
      console.error("Suggestions API failed:", err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Download Story as clean document
  const downloadStoryAsDoc = () => {
    const markdownContent = `# ${story.title}
*A Storyscape AI masterpiece in the style of ${story.writingStyle}*
**Genre:** ${story.genre} | **Target Audience:** ${story.ageGroup}

## Summary
${story.summary}

## Characters
${story.characters
  .map(
    (c) => `- **${c.name}**: ${c.description} (Personality: ${c.personality})`
  )
  .join("\n")}

---

${story.chapters
  .map(
    (ch) => `### Chapter ${ch.chapterNumber}: ${ch.title}
${ch.text}

*Illustration Prompt:* ${ch.imagePrompt}
`
  )
  .join("\n\n")}
`;

    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${story.title.replace(/\s+/g, "_")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progressPercent = Math.round(((currentChapterIndex + 1) / story.chapters.length) * 100);

  return (
    <div className={`relative min-h-screen ${isFullscreen ? "fixed inset-0 z-50 bg-bg-dark rounded-none" : "bg-bg-dark"}`}>
      {/* Audio Tags */}
      {geminiAudioUrl && (
        <audio
          ref={geminiAudioRef}
          src={geminiAudioUrl}
          onEnded={() => setIsPlayingAudio(false)}
          className="hidden"
        />
      )}

      {/* Top Floating Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 mb-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition duration-300 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">
              Reading Mode • {story.genre} • {story.writingStyle}
            </span>
            <h1 className="font-display font-extrabold text-lg text-white leading-tight">
              {story.title}
            </h1>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Saved library badge */}
          <button
            onClick={() => onSaveStory(story)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
              isSavedInLibrary
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSavedInLibrary ? "fill-emerald-400" : ""}`} />
            <span>{isSavedInLibrary ? "Saved to Library" : "Save Story"}</span>
          </button>

          {/* Download */}
          <button
            onClick={downloadStoryAsDoc}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition duration-300 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export MD</span>
          </button>

          {/* Ambient Synth Sound toggle */}
          <button
            onClick={isAmbientSynthActive ? stopAmbientSynth : startAmbientSynth}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
              isAmbientSynthActive
                ? "bg-purple-600/25 text-purple-400 border-purple-500/80"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {isAmbientSynthActive ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Ambient Drone</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition duration-300 cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Reading Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Book / Chapter content (Left, 7 cols) */}
        <div className={`lg:col-span-8 flex flex-col gap-6 ${isReadingMode ? "lg:col-span-12 max-w-4xl mx-auto" : ""}`}>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Book Body */}
            <div className="p-6 md:p-10">
              {/* Cover view option on chapter 1 */}
              <div className="flex justify-between items-center text-slate-500 text-xs font-mono mb-6">
                <span>CHAPTER {currentChapter.chapterNumber} OF {story.chapters.length}</span>
                <span>{progressPercent}% READ</span>
              </div>

              {/* Title */}
              <h2 className="font-display font-extrabold text-2xl md:text-3.5xl text-white mb-6 leading-tight">
                {currentChapter.title}
              </h2>

              {/* Chapter Illustration */}
              {currentChapter.imageUrl && (
                <div className="w-full h-80 md:h-[450px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/50 relative group mb-8 shadow-xl">
                  <img
                    src={currentChapter.imageUrl}
                    alt={currentChapter.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                    <p className="text-[11px] text-purple-400 font-mono font-bold tracking-wider uppercase mb-1">
                      Scene Art Prompt ({story.writingStyle})
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2 italic leading-relaxed">
                      "{currentChapter.imagePrompt}"
                    </p>
                  </div>
                </div>
              )}

              {/* Story Narrative Text */}
              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg text-slate-200 leading-relaxed font-light whitespace-pre-wrap selection:bg-purple-600/30">
                  {typedText}
                  {typedText.length < currentChapter.text.length && (
                    <span className="inline-block w-1.5 h-5 bg-purple-400 animate-pulse ml-0.5" />
                  )}
                </p>
              </div>

              {/* Voice controls inside Book */}
              <div className="mt-10 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500">Narration Voice:</span>
                  <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                    <button
                      onClick={() => {
                        stopTextToSpeech();
                        setTtsEngine("browser");
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition duration-300 ${
                        ttsEngine === "browser" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Cozy (Speech)
                    </button>
                    <button
                      onClick={() => {
                        stopTextToSpeech();
                        setTtsEngine("gemini");
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition duration-300 ${
                        ttsEngine === "gemini" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      AI Actor (Gemini)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTtsPlayback}
                    disabled={isGeminiTtsLoading}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white text-xs font-semibold flex items-center gap-2 shadow transition duration-300 cursor-pointer"
                  >
                    {isGeminiTtsLoading ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlayingAudio ? (
                      <Pause className="w-3.5 h-3.5 fill-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white" />
                    )}
                    <span>
                      {isGeminiTtsLoading
                        ? "Gemini Vocalizing..."
                        : isPlayingAudio
                        ? "Pause Voice"
                        : "Play Chapter Voice"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Book Pagination Footer */}
            <div className="bg-slate-950/80 p-5 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => {
                  if (currentChapterIndex > 0) setCurrentChapterIndex(currentChapterIndex - 1);
                }}
                disabled={currentChapterIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <span className="text-xs text-slate-400 font-mono">
                PAGE {currentChapterIndex + 1} / {story.chapters.length}
              </span>

              <button
                onClick={() => {
                  if (currentChapterIndex < story.chapters.length - 1) {
                    setCurrentChapterIndex(currentChapterIndex + 1);
                  } else {
                    // Reached the end! Offer suggestion or showcase
                    setIsReadingMode(false);
                    // Open modal or suggestions automatically
                  }
                }}
                disabled={currentChapterIndex === story.chapters.length - 1}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Directory, Cast of Characters & AI Editor Suggestions (Right sidebar, 4 cols) */}
        {!isReadingMode && (
          <div className="lg:col-span-4 space-y-6">
            {/* Cast of Characters */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500/20" /> Dramatis Personae (Cast)
              </h3>
              <div className="space-y-4">
                {story.characters.map((char) => (
                  <div key={char.name} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/60">
                    <p className="text-xs font-bold text-white">{char.name}</p>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{char.description}</p>
                    <p className="text-[10px] text-purple-400 font-semibold mt-1.5">Personality: {char.personality}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI suggestions container */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative">
              <div className="absolute top-3 right-3">
                <span className="text-[9px] bg-purple-900/40 text-purple-300 font-mono font-bold px-2 py-0.5 rounded border border-purple-800/40">
                  EDIT ROOM
                </span>
              </div>

              <h3 className="font-display font-bold text-sm text-slate-200 mb-2 flex items-center gap-2 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-purple-400" /> Director suggestions
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Ask the AI Story Editor to pitch shocking twists, alternate endings, or character tweaks.
              </p>

              {!suggestions ? (
                <button
                  onClick={handleFetchSuggestions}
                  disabled={isLoadingSuggestions}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition duration-300 shadow-md shadow-purple-950/25 cursor-pointer disabled:opacity-50"
                >
                  {isLoadingSuggestions ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                      <span>Reading Script...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Brainstorm Plot Ideas</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Tabs */}
                  <div className="flex border-b border-slate-800 p-0.5 rounded-lg bg-slate-950">
                    {["twist", "ending", "character"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveSuggestionTab(tab as any)}
                        className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded-md transition ${
                          activeSuggestionTab === tab
                            ? "bg-purple-600 text-white"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {tab}s
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSuggestionTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2 max-h-56 overflow-y-auto pr-1"
                    >
                      {activeSuggestionTab === "twist" &&
                        suggestions.plotTwists?.map((twist: string, index: number) => (
                          <div key={index} className="p-3 rounded-lg bg-slate-950 text-[11px] leading-relaxed text-slate-300 border border-slate-800">
                            <span className="text-purple-400 font-bold block mb-1">Twist idea {index + 1}:</span>
                            {twist}
                          </div>
                        ))}
                      {activeSuggestionTab === "ending" &&
                        suggestions.alternateEndings?.map((ending: string, index: number) => (
                          <div key={index} className="p-3 rounded-lg bg-slate-950 text-[11px] leading-relaxed text-slate-300 border border-slate-800">
                            <span className="text-fuchsia-400 font-bold block mb-1">Alternate finale {index + 1}:</span>
                            {ending}
                          </div>
                        ))}
                      {activeSuggestionTab === "character" &&
                        suggestions.characterImprovements?.map((imp: string, index: number) => (
                          <div key={index} className="p-3 rounded-lg bg-slate-950 text-[11px] leading-relaxed text-slate-300 border border-slate-800">
                            <span className="text-sky-400 font-bold block mb-1">Dev idea {index + 1}:</span>
                            {imp}
                          </div>
                        ))}
                    </motion.div>
                  </AnimatePresence>

                  <button
                    onClick={handleFetchSuggestions}
                    className="w-full py-1.5 text-[10px] font-bold text-purple-400 text-center hover:underline bg-transparent"
                  >
                    Regenerate Suggestions 🔄
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
