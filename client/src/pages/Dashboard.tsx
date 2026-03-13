import { useEffect, useState } from "react";
import { Plus, Share2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { endpoints } from "../api/api";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { Layout } from "../components/Layout";
import { Reorder } from "framer-motion";
import { useAuthenticatedApi } from "../hooks/useApi";

export const Dashboard = () => {
    const [contents, setContents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const location = useLocation();
    const api = useAuthenticatedApi();

    // Determine current processing type from URL
    const searchParams = new URLSearchParams(location.search);
    const typeFilter = searchParams.get("type");

    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await api("get", endpoints.content.get);
            setContents(response.data.content);
        } catch (error) {
            console.error("Failed to fetch content", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this content?")) return;
        try {
            await api("delete", endpoints.content.delete, { contentId: id });
            setContents(prev => prev.filter(c => c._id !== id));
        } catch (error) {
            console.error("Failed to delete content", error);
            alert("Failed to delete content");
        }
    }

    const handleShare = async () => {
        try {
            const response = await api("post", endpoints.share.share, { share: true });
            const shareUrl = `${window.location.origin}/share/${response.data.hash || ""}`;
            alert(`Brain shared! Link copied to clipboard:\n${shareUrl}`);
        } catch (error) {
            console.error("Failed to share brain", error);
        }
    }

    useEffect(() => {
        fetchContent();
    }, []);

    const filteredContents = typeFilter
        ? contents.filter(c => c.type === typeFilter)
        : contents;

    return (
        <Layout>
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">My Recollections</h1>
                    <div className="flex gap-4">
                        <Button variant="secondary" size="md" startIcon={<Share2 className="w-5 h-5" />} onClick={handleShare}>
                            Share Brain
                        </Button>
                        <Button variant="primary" size="md" startIcon={<Plus className="w-5 h-5" />} onClick={() => setModalOpen(true)}>
                            Add Content
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredContents.length === 0 ? (
                    <div className="text-center p-20 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                        No content found. Click "Add Content" to start capturing your memories!
                    </div>
                ) : (
                    <Reorder.Group
                        axis="y"
                        values={filteredContents}
                        onReorder={setContents}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredContents.map((content) => (
                            <Reorder.Item key={content._id} value={content}>
                                <div className="h-full transform transition-all hover:scale-[1.02]">
                                    <Card
                                        {...content}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}

                <CreateContentModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSuccess={fetchContent}
                />
            </div>
        </Layout>
    );
};
