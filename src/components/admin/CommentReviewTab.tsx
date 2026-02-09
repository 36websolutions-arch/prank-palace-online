import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Clock, XCircle, Send, AlertTriangle, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";

type CommentStatus = "pending" | "approved" | "rejected" | "posted" | "failed";

interface PendingComment {
  id: string;
  platform: string;
  post_id: string;
  post_url: string | null;
  post_text: string | null;
  post_author: string | null;
  post_likes: number;
  comment_text: string;
  search_query: string | null;
  status: CommentStatus;
  reviewed_at: string | null;
  posted_at: string | null;
  error_message: string | null;
  created_at: string;
}

type FilterValue = "all" | CommentStatus;

const STATUS_CONFIG: Record<CommentStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: Clock },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: CheckCircle },
  posted: { label: "Posted", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: Send },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle },
  failed: { label: "Failed", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", icon: AlertTriangle },
};

export function CommentReviewTab() {
  const [comments, setComments] = useState<PendingComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>("all");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("pending_comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments((data as PendingComment[]) || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("pending_comments")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: `Failed to ${status} comment`, variant: "destructive" });
    } else {
      toast({ title: status === "approved" ? "Approved" : "Rejected", description: `Comment ${status} successfully` });
      fetchComments();
    }
  };

  const filteredComments = filter === "all" ? comments : comments.filter(c => c.status === filter);

  const today = new Date().toISOString().slice(0, 10);
  const pendingCount = comments.filter(c => c.status === "pending").length;
  const approvedToday = comments.filter(c => c.status === "approved" && c.reviewed_at?.startsWith(today)).length;
  const postedToday = comments.filter(c => c.status === "posted" && c.posted_at?.startsWith(today)).length;
  const rejectedToday = comments.filter(c => c.status === "rejected" && c.reviewed_at?.startsWith(today)).length;

  if (loading) return <ChronicleLoader />;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Review" value={pendingCount} color="text-yellow-600" />
        <StatCard label="Approved Today" value={approvedToday} color="text-blue-600" />
        <StatCard label="Posted Today" value={postedToday} color="text-green-600" />
        <StatCard label="Rejected Today" value={rejectedToday} color="text-red-600" />
      </div>

      {/* Main panel */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">Comment Review</h2>
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "approved", "posted", "rejected", "failed"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === "all" ? `All (${comments.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${comments.filter(c => c.status === f).length})`}
              </Button>
            ))}
          </div>
        </div>

        {filteredComments.length === 0 ? (
          <EmptyState icon="💬" title="No comments to review..." description="The Chronicle Scribe has been quiet. Run a cycle to generate comments." />
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => {
              const config = STATUS_CONFIG[comment.status];
              const StatusIcon = config.icon;

              return (
                <div key={comment.id} className="border border-stone-200 dark:border-stone-700 rounded-lg p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">{comment.platform}</Badge>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                      {comment.search_query && (
                        <span className="text-xs text-stone-400">query: "{comment.search_query}"</span>
                      )}
                    </div>
                    <span className="text-xs text-stone-400">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Original post */}
                  {comment.post_text && (
                    <div className="bg-stone-50 dark:bg-stone-800 rounded-md p-3 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-stone-500">Original Post</span>
                        {comment.post_author && (
                          <span className="text-xs text-stone-400">@{comment.post_author}</span>
                        )}
                        {comment.post_likes > 0 && (
                          <span className="text-xs text-stone-400">{comment.post_likes.toLocaleString()} likes</span>
                        )}
                      </div>
                      <p className="text-sm text-stone-700 dark:text-stone-300">{comment.post_text}</p>
                    </div>
                  )}

                  {/* Generated comment */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mb-3">
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block mb-1">Chronicle Reply</span>
                    <p className="text-sm text-stone-800 dark:text-stone-200">{comment.comment_text}</p>
                  </div>

                  {/* Error message */}
                  {comment.error_message && (
                    <div className="bg-red-50 dark:bg-red-950/30 rounded-md p-2 mb-3">
                      <p className="text-xs text-red-600 dark:text-red-400">{comment.error_message}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {comment.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white gap-1"
                          onClick={() => updateStatus(comment.id, "approved")}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() => updateStatus(comment.id, "rejected")}
                        >
                          <ThumbsDown className="h-3 w-3" />
                          Reject
                        </Button>
                      </>
                    )}
                    {comment.post_url && (
                      <a
                        href={comment.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Post
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4">
      <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
