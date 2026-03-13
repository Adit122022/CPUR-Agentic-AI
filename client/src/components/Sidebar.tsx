import { Brain, Twitter, Youtube, FileText, Link as LinkIcon, Hash, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();
    const { user } = useUser();
    
    const links = [
        { name: "All Content", icon: <Hash className="w-5 h-5" />, path: "/dashboard" },
        { name: "Tweets", icon: <Twitter className="w-5 h-5" />, path: "/dashboard?type=twitter" },
        { name: "Videos", icon: <Youtube className="w-5 h-5" />, path: "/dashboard?type=video" },
        { name: "Documents", icon: <FileText className="w-5 h-5" />, path: "/dashboard?type=article" },
        { name: "Links", icon: <LinkIcon className="w-5 h-5" />, path: "/dashboard?type=link" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 
                transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:h-screen shadow-xl md:shadow-none
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                    Omoide
                                </span>
                            </div>
                            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-indigo-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Profile Section with Clerk UserButton */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors group">
                            <UserButton 
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-10 h-10 ring-2 ring-indigo-100 group-hover:ring-indigo-200 transition-all",
                                    }
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">
                                    {user?.fullName || user?.username || "Recollector"}
                                </p>
                                <p className="text-xs text-gray-500 truncate font-medium">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                        {links.map((link) => {
                            // Logic to determine if link is active
                            const isActive = location.pathname === "/dashboard" && (
                                link.name === "All Content" ? !location.search : location.search.includes(link.path.split("=")[1])
                            );
                            
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => window.innerWidth < 768 && onClose()}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${isActive
                                        ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                                        }`}
                                >
                                    <span className={`${isActive ? "text-indigo-600" : "text-gray-400"}`}>
                                        {link.icon}
                                    </span>
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Info */}
                    <div className="p-6 border-t border-gray-50">
                       <p className="text-[10px] text-center font-bold uppercase tracking-widest text-gray-400">
                            Version 2.0 • Recollections
                       </p>
                    </div>
                </div>
            </div>
        </>
    );
};
