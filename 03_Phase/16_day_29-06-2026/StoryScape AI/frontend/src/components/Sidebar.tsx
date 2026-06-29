import React from "react";
import { Sparkles, Library, Bookmark, Settings, Info, Home, BookOpen } from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "create", label: "Create Story", icon: Sparkles },
    { id: "library", label: "Library", icon: Library },
    { id: "saved", label: "Saved Stories", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col fixed left-0 top-0 z-40 text-slate-300">
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-white leading-tight">
            StoryScape <span className="text-purple-400">AI</span>
          </h1>
          <p className="text-xs text-slate-500">Living Storybook</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 group ${
                isActive
                  ? "bg-purple-600/10 text-purple-400 border-l-4 border-purple-500 pl-3"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-purple-400" : "text-slate-400 group-hover:text-purple-400"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info / Workspace Details */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-white">
            U
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-300 truncate">Storyteller</p>
            <p className="text-[10px] text-slate-500 truncate">Standard Session</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
