import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import StoryForm from "./components/StoryForm";
import StoryReader from "./components/StoryReader";
import StoryLibrary from "./components/StoryLibrary";
import SettingsPanel from "./components/SettingsPanel";
import AboutPanel from "./components/AboutPanel";
import { Story, GenerationParams } from "./types";
import { Sparkles, BookOpen, AlertCircle, Menu, Volume2, Settings, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const LOADING_MESSAGES = [
  "Spawning the narrative core...",
  "Weaving dramatic chapter plot points...",
  "Sculpting primary cast and personalities...",
  "Painting high-contrast fantasy backgrounds...",
  "Engaging cinematic prose generators...",
  "Synthesizing atmospheric image cues...",
  "Calibrating text-to-speech audio narratives...",
  "Fusing living digital storybooks..."
];

export default function App() {
  const [currentTab, setCurrentTab] = useState("home");
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLoadingMessageIndex, setCurrentLoadingMessageIndex] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Form prepopulation state
  const [prepopulatedParams, setPrepopulatedParams] = useState<{
    topic: string;
    genre: string;
    style: string;
  } | null>(null);

  // Load library on start
  const loadLibrary = async () => {
    try {
      const response = await fetch("/api/stories");
      const data = await response.json();
      setStories(data);
    } catch (err) {
      console.error("Failed to load saved stories:", err);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  // Message rotater during loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSelectPreset = (topic: string, genre: string, style: string) => {
    setPrepopulatedParams({ topic, genre, style });
    setCurrentTab("create");
  };

  const handleGenerateStory = async (params: GenerationParams) => {
    setIsGenerating(true);
    setGenerationError(null);
    setCurrentLoadingMessageIndex(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to compile generated script.");
      }

      const generatedData = await response.json();
      
      // Inject UUID & Creation Timestamp
      const finalStory: Story = {
        ...generatedData,
        id: `story_${Date.now()}`,
        genre: params.genre,
        writingStyle: params.writingStyle,
        ageGroup: params.ageGroup,
        length: params.length,
        createdAt: new Date().toISOString(),
      };

      // Auto-save story to local cloud database
      await handleSaveStory(finalStory);
      
      // Open story reader directly
      setActiveStory(finalStory);
    } catch (err: any) {
      console.error("Story creation failed:", err);
      setGenerationError(err.message || "An unexpected network or model error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveStory = async (storyToSave: Story) => {
    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storyToSave),
      });

      const data = await response.json();
      if (data.success) {
        // Reload library state
        await loadLibrary();
      }
    } catch (err) {
      console.error("Error committing story save:", err);
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        // If active story being read is deleted, close reader
        if (activeStory?.id === id) {
          setActiveStory(null);
        }
        await loadLibrary();
      }
    } catch (err) {
      console.error("Error deleting story:", err);
    }
  };

  const isSavedInLibrary = (id: string) => {
    return stories.some((s) => s.id === id);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex font-sans">
      
      {/* Permanent Left Sidebar (Hidden if active reading fullscreen mode) */}
      {!activeStory && (
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen p-4 md:p-8 ${!activeStory ? "pl-4 md:pl-72" : "pl-4 md:pl-4"}`}>
        <AnimatePresence mode="wait">
          
          {/* Active Story Reader Modal overlay mode */}
          {activeStory ? (
            <motion.div
              key="reader"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.4 }}
            >
              <StoryReader
                story={activeStory}
                onBack={() => {
                  setActiveStory(null);
                  setCurrentTab("library");
                }}
                onSaveStory={handleSaveStory}
                isSavedInLibrary={isSavedInLibrary(activeStory.id)}
              />
            </motion.div>
          ) : isGenerating ? (
            /* Immersive full page cinematic loading state */
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-xl mx-auto p-6"
            >
              <div className="relative mb-10">
                <div className="w-24 h-24 rounded-3xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center animate-pulse">
                  <Wand2 className="w-10 h-10 text-purple-400 animate-bounce" style={{ animationDuration: "2s" }} />
                </div>
                {/* Visual orbital ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-purple-500/40 animate-spin" style={{ animationDuration: "12s" }} />
              </div>

              <h2 className="font-display font-extrabold text-2xl text-white mb-2">
                Sculpting Your Legend
              </h2>
              
              {/* Cycling status updates */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentLoadingMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-purple-300 font-mono font-medium tracking-wide h-6"
                >
                  {LOADING_MESSAGES[currentLoadingMessageIndex]}
                </motion.p>
              </AnimatePresence>

              <p className="text-xs text-slate-500 mt-6 max-w-md leading-relaxed">
                Gemini is crafting substantial rich chapters, painting unique atmospheric custom prompts, and assembling the dramatis personae. This may take up to 20-30 seconds.
              </p>
            </motion.div>
          ) : (
            /* Standard Tabs */
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Top Welcome Title block */}
              {currentTab !== "home" && (
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-purple-400 tracking-widest uppercase">
                      StoryScape Workspace
                    </span>
                    <h2 className="font-display font-extrabold text-2xl text-white capitalize">
                      {currentTab === "create" ? "Story Generator Form" : `${currentTab} Shelf`}
                    </h2>
                  </div>
                </div>
              )}

              {/* Show generation errors if any */}
              {generationError && (
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/80 text-red-300 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-4xl mx-auto">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-white">Story Generation Failed</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {generationError}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setGenerationError(null)}
                    className="text-xs font-bold text-red-400 hover:underline flex-shrink-0 self-end md:self-center"
                  >
                    Dismiss Error
                  </button>
                </div>
              )}

              {/* Tab Router Routing */}
              {currentTab === "home" && (
                <LandingPage
                  onStartCreating={() => setCurrentTab("create")}
                  onSelectPreset={handleSelectPreset}
                />
              )}

              {currentTab === "create" && (
                <StoryForm
                  initialTopic={prepopulatedParams?.topic || ""}
                  initialGenre={prepopulatedParams?.genre || "Fantasy"}
                  initialStyle={prepopulatedParams?.style || "Pixar"}
                  isGenerating={isGenerating}
                  onGenerate={(params) => {
                    // Reset prepopulated values so they don't overwrite user edits later
                    setPrepopulatedParams(null);
                    handleGenerateStory(params);
                  }}
                />
              )}

              {currentTab === "library" && (
                <StoryLibrary
                  stories={stories}
                  onOpenStory={setActiveStory}
                  onDeleteStory={handleDeleteStory}
                />
              )}

              {currentTab === "saved" && (
                <StoryLibrary
                  stories={stories}
                  onOpenStory={setActiveStory}
                  onDeleteStory={handleDeleteStory}
                  showBookmarkedOnly={true}
                />
              )}

              {currentTab === "settings" && <SettingsPanel />}

              {currentTab === "about" && <AboutPanel />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
