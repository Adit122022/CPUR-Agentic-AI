import { Share2, Trash2, FileText, Youtube, Twitter, Link as LinkIcon, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface CardProps {
    _id: string;
    title: string;
    link: string;
    type: "twitter" | "video" | "link" | "article";
    onDelete?: (id: string) => void;
}

const getIcon = (type: string) => {
    switch (type) {
        case "twitter":
            return <Twitter className="w-5 h-5 text-sky-500" />;
        case "video":
            return <Youtube className="w-5 h-5 text-rose-500" />;
        case "article":
            return <FileText className="w-5 h-5 text-emerald-600" />;
        default:
            return <LinkIcon className="w-5 h-5 text-indigo-600" />;
    }
};

export const Card = ({ _id, title, link, type, onDelete }: CardProps) => {

    const getYoutubeEmbedUrl = (url: string) => {
        try {
            const videoId = url.split("v=")[1]?.split("&")[0];
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
            const shortId = url.split("youtu.be/")[1]?.split("?")[0];
            if (shortId) return `https://www.youtube.com/embed/${shortId}`
            return null;
        } catch (e) {
            return null
        }
    };

    const isTwitter = type === "twitter";
    const tweetId = isTwitter ? link.split("status/")[1]?.split("?")[0] : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100 border border-gray-100 p-6 flex flex-col gap-4 h-full transition-all duration-300"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors">
                        {getIcon(type)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{type === 'video' ? 'Video' : type}</span>
                </div>
                <div className="flex items-center gap-1">
                    <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    {onDelete && (
                        <button 
                            onClick={() => onDelete(_id)} 
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight text-gray-900 line-clamp-2 mb-3">
                    {title}
                </h3>

                <div className="w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100/50">
                    {type === 'video' && getYoutubeEmbedUrl(link) ? (
                        <iframe
                            className="w-full aspect-video"
                            src={getYoutubeEmbedUrl(link) || ""}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    ) : isTwitter && tweetId ? (
                        <div className="p-4 bg-sky-50/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Twitter className="w-4 h-4 text-sky-500" />
                                <span className="text-xs font-bold text-sky-600">Post from X</span>
                            </div>
                            <a href={link} target="_blank" className="text-sm text-gray-600 hover:text-indigo-600 line-clamp-3 leading-relaxed break-words font-medium">{link}</a>
                        </div>
                    ) : (
                        <div className="p-4 bg-indigo-50/30">
                            <div className="flex items-center gap-2 mb-2">
                                <LinkIcon className="w-4 h-4 text-indigo-500" />
                                <span className="text-xs font-bold text-indigo-600">Web Link</span>
                            </div>
                            <a href={link} target="_blank" className="text-sm text-gray-600 hover:text-indigo-600 line-clamp-3 leading-relaxed break-words font-medium">{link}</a>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider">#recollected</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-wider">#brain</span>
            </div>
        </motion.div>
    );
};
