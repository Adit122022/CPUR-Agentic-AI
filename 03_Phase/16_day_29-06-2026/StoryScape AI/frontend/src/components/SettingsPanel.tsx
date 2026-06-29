import React, { useState, useEffect } from "react";
import { Settings, ShieldCheck, ShieldAlert, Volume2, Music, Check, Play } from "lucide-react";

export default function SettingsPanel() {
  const [geminiConfigured, setGeminiConfigured] = useState<boolean | null>(null);
  const [testVoiceText, setTestVoiceText] = useState("Greetings, Storyteller! The cosmic scripts are fully prepared.");
  const [isTestPlaying, setIsTestPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState("1.0");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setGeminiConfigured(data.geminiConfigured);
      })
      .catch((err) => {
        console.error("Health check failed:", err);
        setGeminiConfigured(false);
      });
  }, []);

  const handleTestSpeech = () => {
    if (isTestPlaying) {
      window.speechSynthesis.cancel();
      setIsTestPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(testVoiceText);
    utterance.rate = parseFloat(speechRate);
    utterance.onend = () => setIsTestPlaying(false);
    utterance.onerror = () => setIsTestPlaying(false);

    setIsTestPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8 text-slate-300">
      <div>
        <h2 className="font-display font-extrabold text-2xl text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400" />
          Platform Preferences & Diagnostic Panel
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure speech, verify service runtimes, and calibrate the storyteller engines.</p>
      </div>

      {/* Diagnostics */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-display flex items-center gap-2">
          Platform Diagnostics
        </h3>
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${geminiConfigured ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {geminiConfigured ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold text-white">Gemini API Key Connectivity</p>
              <p className="text-[10px] text-slate-500">
                {geminiConfigured
                  ? "Connected successfully. Gemini server routes are responsive."
                  : "Not configured. Set GEMINI_API_KEY inside the Secrets menu."}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
            geminiConfigured ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"
          }`}>
            {geminiConfigured ? "ACTIVE" : "MISSING"}
          </span>
        </div>
      </div>

      {/* Voice calibrator */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-display flex items-center gap-2">
          Vocal Calibration (Text-to-Speech)
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">Speech Pacing Rate: {speechRate}x</label>
            <input
              type="range"
              min="0.7"
              max="1.4"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(e.target.value)}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">Test Voice Output Preview</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testVoiceText}
                onChange={(e) => setTestVoiceText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleTestSpeech}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isTestPlaying ? "Stop" : "Test Speak"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Music credits */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-purple-900/20 text-purple-400">
          <Music className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cinematic Ambience Synthesizer</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            The platform's soundtrack is synthesized live inside your browser using **Web Audio API Oscillators**.
            No data or large audio streams are downloaded, enabling an offline-capable, high-fidelity acoustic atmosphere.
          </p>
        </div>
      </div>
    </div>
  );
}
