import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { endpoints } from "../api/api";
import { useAuthenticatedApi } from "../hooks/useApi";

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void; // Callback to refresh content
}

export const CreateContentModal = ({ open, onClose, onSuccess }: CreateContentModalProps) => {
    if (!open) return null;

    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [type, setType] = useState("link"); // Default type
    const [loading, setLoading] = useState(false);
    const api = useAuthenticatedApi();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api("post", endpoints.content.add, {
                title,
                link,
                type
            });
            onSuccess();
            onClose();
            // Reset form
            setTitle("");
            setLink("");
            setType("link");
        } catch (error) {
            console.error("Failed to add content", error);
            alert("Failed to add content. Please check input.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-6 relative animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-50 rounded-full"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900">Add Content</h2>
                    <p className="text-sm text-gray-500 font-medium">Capture a new memory to your brain</p>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                        <Input
                            placeholder="Give it a name..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-2xl border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Link URL</label>
                        <Input
                            placeholder="https://..."
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="rounded-2xl border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['article', 'video', 'twitter', 'link'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${type === t
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                                            : "bg-white border-gray-100 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50/50"
                                        }`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <Button onClick={handleSubmit} loading={loading} variant="primary" size="md" className="w-full py-4 rounded-2xl shadow-xl shadow-indigo-100 font-bold text-lg">
                        Add to Recollections
                    </Button>
                </div>
            </div>
        </div>
    );
};
