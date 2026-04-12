import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle, Clock, XCircle, Send, AlertTriangle, ThumbsUp, ThumbsDown,
  RefreshCw, Sparkles, Calendar, User, BarChart3, MessageSquare, History, Users, Upload,
} from "lucide-react";
import {
  getQueue, approveQueueItem, rejectQueueItem, postTweet, generateTweet,
  getStats, getPersonas, updatePersona, getHistory, getSchedules,
  type QueueItem, type StatsRow, type Persona, type AuditLogEntry, type Schedule,
} from "@/lib/xforge-client";

// ── Stats Row (always visible) ──

function StatsBar() {
  const [stats, setStats] = useState<StatsRow[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [queueCount, setQueueCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStats().catch(() => []),
      getSchedules().catch(() => ({ data: [] })),
      getQueue("pending", 1, 1).catch(() => ({ total: 0 })),
    ]).then(([s, sc, q]) => {
      // Stats may come as array or {data: {...}} depending on xforge state
      const statsArr = Array.isArray(s) ? s : (s && typeof s === "object" && "data" in (s as Record<string, unknown>)) ? Object.values((s as { data: Record<string, unknown> }).data) : [];
      setStats(statsArr as StatsRow[]);
      setSchedules(sc.data || []);
      setQueueCount(q.total || 0);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-stone-100 dark:bg-stone-800 rounded-xl animate-pulse" />)}</div>;

  const postedToday = stats.find(s => s.action_type === "send_tweet")?.successes ?? 0;
  const activePersonas = schedules.filter(s => s.enabled).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Queued Items" value={queueCount} color="text-yellow-600" icon={Clock} />
      <StatCard label="Posted Today" value={postedToday} color="text-green-600" icon={Send} />
      <StatCard label="Schedules" value={schedules.length} color="text-blue-600" icon={Calendar} />
      <StatCard label="Active Personas" value={activePersonas} color="text-purple-600" icon={Users} />
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: typeof Clock }) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-4 w-4 ${color}`} />
        <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ── Queue Sub-tab ──

const QUEUE_STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: Clock },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: CheckCircle },
  posted: { label: "Posted", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: Send },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle },
  failed: { label: "Failed", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", icon: AlertTriangle },
} as const;

type QueueFilter = "all" | "pending" | "approved" | "rejected" | "posted" | "failed";

function QueueSubTab() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<QueueFilter>("all");
  const [acting, setActing] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getQueue(filter === "all" ? undefined : filter, 1, 50);
      setItems(res.data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load queue", variant: "destructive" });
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActing(id);
    try {
      if (action === "approve") await approveQueueItem(id);
      else await rejectQueueItem(id);
      toast({ title: action === "approve" ? "Approved" : "Rejected", description: `Item ${action}d successfully` });
      fetchItems();
    } catch {
      toast({ title: "Error", description: `Failed to ${action} item`, variant: "destructive" });
    }
    setActing(null);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "pending", "approved", "posted", "rejected", "failed"] as const).map(f => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={fetchItems} className="ml-auto gap-1">
          <RefreshCw className="h-3 w-3" /> Refresh
        </Button>
      </div>

      {loading ? <ChronicleLoader /> : items.length === 0 ? (
        <EmptyState icon="🐦" title="Queue is empty" description="No items match this filter." />
      ) : (
        <div className="space-y-3">
          {items.map(item => {
            const config = QUEUE_STATUS_CONFIG[item.status] || QUEUE_STATUS_CONFIG.pending;
            const StatusIcon = config.icon;
            return (
              <div key={item.id} className="border border-stone-200 dark:border-stone-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{item.persona_name || "unknown"}</Badge>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                      <StatusIcon className="h-3 w-3" />{config.label}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">{new Date(item.created_at).toLocaleString()}</span>
                </div>

                {item.target_tweet_text && (
                  <div className="bg-stone-50 dark:bg-stone-800 rounded-md p-3 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-stone-500">Target Tweet</span>
                      {item.target_author && <span className="text-xs text-stone-400">@{item.target_author}</span>}
                    </div>
                    <p className="text-sm text-stone-700 dark:text-stone-300">{item.target_tweet_text}</p>
                  </div>
                )}

                <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-md p-3 mb-2">
                  <span className="text-xs font-semibold text-sky-700 dark:text-sky-400 block mb-1">Generated Reply</span>
                  <p className="text-sm text-stone-800 dark:text-stone-200">{item.generated_text}</p>
                </div>

                {item.error_message && (
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-md p-2 mb-2">
                    <p className="text-xs text-red-600 dark:text-red-400">{item.error_message}</p>
                  </div>
                )}

                {item.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1" onClick={() => handleAction(item.id, "approve")} disabled={acting === item.id}>
                      <ThumbsUp className="h-3 w-3" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleAction(item.id, "reject")} disabled={acting === item.id}>
                      <ThumbsDown className="h-3 w-3" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Compose Sub-tab ──

function ComposeSubTab() {
  const [text, setText] = useState("");
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState("");
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaId, setMediaId] = useState<string | null>(null);

  useEffect(() => {
    getPersonas().then(res => {
      const list = res.data || [];
      setPersonas(list);
      if (list.length > 0) setSelectedPersona(list[0].id);
    }).catch(() => {});
  }, []);

  const handleGenerate = async () => {
    if (!selectedPersona) return;
    setGenerating(true);
    try {
      const res = await generateTweet(selectedPersona, topic || undefined);
      setText(res.text || "");
      toast({ title: "Generated", description: "AI tweet generated — edit and post when ready" });
    } catch {
      toast({ title: "Error", description: "Failed to generate tweet", variant: "destructive" });
    }
    setGenerating(false);
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaId(null);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaId(null);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(null);
  };

  const handlePost = async () => {
    setShowConfirm(false);
    setPosting(true);
    try {
      let ids: string[] | undefined;

      // Upload media first if attached
      if (mediaFile && !mediaId) {
        setUploading(true);
        try {
          const { uploadTweetMedia } = await import("@/lib/xforge-client");
          const result = await uploadTweetMedia(mediaFile);
          ids = [result.mediaId];
          setMediaId(result.mediaId);
        } catch (err: any) {
          toast({ title: "Media Upload Failed", description: err.message, variant: "destructive" });
          setPosting(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      } else if (mediaId) {
        ids = [mediaId];
      }

      await postTweet(text, ids);
      toast({ title: "Posted!", description: "Tweet posted to @CorporatePranks" });
      setText("");
      clearMedia();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to post tweet", variant: "destructive" });
    }
    setPosting(false);
  };

  const charCount = text.length;
  const MAX_CHARS = 25000; // Twitter Premium long-form limit
  const overLimit = charCount > MAX_CHARS;

  return (
    <div className="space-y-6">
      {/* AI Generate */}
      <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" /> Generate with AI
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-stone-500 block mb-1">Persona</label>
            <select
              className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-2 text-sm"
              value={selectedPersona}
              onChange={e => setSelectedPersona(e.target.value)}
            >
              {personas.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1">Topic (optional)</label>
            <input
              type="text"
              className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-2 text-sm"
              placeholder="e.g. Q1 earnings..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleGenerate} disabled={generating || !selectedPersona} className="gap-1">
              <Sparkles className="h-4 w-4" /> {generating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Tweet Text</label>
          <span className={`text-xs font-mono ${overLimit ? "text-red-500 font-bold" : "text-stone-400"}`}>
            {charCount.toLocaleString()}/{MAX_CHARS > 1000 ? `${Math.floor(MAX_CHARS / 1000)}K` : MAX_CHARS}
          </span>
        </div>
        <textarea
          className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-2 text-sm min-h-[120px] resize-y"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a tweet or generate one with AI above..."
        />
      </div>

      {/* Media attachment */}
      <div>
        {mediaPreview ? (
          <div className="relative inline-block">
            {mediaFile?.type.startsWith("video/") ? (
              <video src={mediaPreview} className="max-h-40 rounded-lg border border-stone-300 dark:border-stone-700" controls />
            ) : (
              <img src={mediaPreview} alt="attachment" className="max-h-40 rounded-lg border border-stone-300 dark:border-stone-700" />
            )}
            <button
              onClick={clearMedia}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
            >
              X
            </button>
            {mediaId && <span className="text-xs text-green-500 block mt-1">Uploaded</span>}
          </div>
        ) : (
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 cursor-pointer hover:border-sky-500 transition-colors text-sm text-stone-500">
            <Upload className="h-4 w-4" />
            Attach image or video
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleMediaSelect}
            />
          </label>
        )}
      </div>

      {/* Post button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setShowConfirm(true)}
          disabled={!text.trim() || overLimit || posting || uploading}
          className="bg-sky-500 hover:bg-sky-600 text-white gap-1"
        >
          <Send className="h-4 w-4" /> {posting ? (uploading ? "Uploading media..." : "Posting...") : "Post Now"}
        </Button>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-stone-900 rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] flex flex-col">
            <h3 className="font-semibold text-lg mb-2 flex-shrink-0">Post to @CorporatePranks?</h3>
            <div className="bg-stone-50 dark:bg-stone-800 rounded-md p-3 mb-4 overflow-y-auto flex-1 min-h-0">
              <p className="text-sm whitespace-pre-wrap">{text.slice(0, 500)}{text.length > 500 ? `\n\n... (${text.length.toLocaleString()} chars total)` : ""}</p>
            </div>
            <div className="flex gap-2 justify-end flex-shrink-0">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button onClick={handlePost} className="bg-sky-500 hover:bg-sky-600 text-white">Confirm Post</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── History Sub-tab ──

function HistorySubTab() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const limit = 25;

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHistory({ page, limit, type: typeFilter || undefined, from: dateFrom || undefined, to: dateTo || undefined });
      setEntries(res.data || []);
      setTotal(res.total || 0);
    } catch {
      toast({ title: "Error", description: "Failed to load history", variant: "destructive" });
    }
    setLoading(false);
  }, [page, typeFilter, dateFrom, dateTo]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        <div>
          <label className="text-xs text-stone-500 block mb-1">Type</label>
          <select
            className="rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-1.5 text-sm"
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          >
            <option value="">All types</option>
            <option value="send_tweet">Tweets</option>
            <option value="send_reply">Replies</option>
            <option value="search_tweets">Searches</option>
            <option value="generate_reply">AI Generations</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-stone-500 block mb-1">From</label>
          <input type="date" className="rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-1.5 text-sm" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} />
        </div>
        <div>
          <label className="text-xs text-stone-500 block mb-1">To</label>
          <input type="date" className="rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-1.5 text-sm" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} />
        </div>
        <Button variant="ghost" size="sm" onClick={fetchHistory} className="gap-1">
          <RefreshCw className="h-3 w-3" /> Refresh
        </Button>
      </div>

      {loading ? <ChronicleLoader /> : entries.length === 0 ? (
        <EmptyState icon="📜" title="No history" description="No audit log entries found for these filters." />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700 text-left">
                  <th className="py-2 px-3 text-stone-500 font-medium">Time</th>
                  <th className="py-2 px-3 text-stone-500 font-medium">Type</th>
                  <th className="py-2 px-3 text-stone-500 font-medium">Details</th>
                  <th className="py-2 px-3 text-stone-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.id} className="border-b border-stone-100 dark:border-stone-800">
                    <td className="py-2 px-3 text-xs text-stone-500 whitespace-nowrap">{new Date(entry.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-3">
                      <Badge variant="outline" className="text-xs">{entry.actionType}</Badge>
                    </td>
                    <td className="py-2 px-3 text-stone-700 dark:text-stone-300 max-w-md truncate">{entry.username || JSON.stringify(entry.metadata)}</td>
                    <td className="py-2 px-3">
                      {entry.result === "success" ? (
                        <span className="text-green-600 text-xs font-medium">Success</span>
                      ) : (
                        <span className="text-red-600 text-xs font-medium">{entry.result}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-stone-400">{total} entries total</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <span className="text-sm text-stone-500 py-1">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Personas Sub-tab ──

function PersonasSubTab() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Persona | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTone, setEditTone] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPersonas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPersonas();
      setPersonas(res.data || []);
    } catch {
      toast({ title: "Error", description: "Failed to load personas", variant: "destructive" });
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPersonas(); }, [fetchPersonas]);

  const openEdit = (p: Persona) => {
    setEditing(p);
    setEditName(p.name);
    setEditDescription(p.description);
    setEditTone(p.tone);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updatePersona(editing.id, {
        name: editName,
        description: editDescription,
        personality: editTone,
      });
      toast({ title: "Saved", description: `Persona "${editName}" updated` });
      setEditing(null);
      fetchPersonas();
    } catch {
      toast({ title: "Error", description: "Failed to update persona", variant: "destructive" });
    }
    setSaving(false);
  };

  if (loading) return <ChronicleLoader />;

  return (
    <div>
      {personas.length === 0 ? (
        <EmptyState icon="🎭" title="No personas" description="No personas configured on xforge." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personas.map(p => (
            <div key={p.id} className="border border-stone-200 dark:border-stone-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-500" /> {p.name}
                </h3>
                <Button variant="outline" size="sm" onClick={() => openEdit(p)}>Edit</Button>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">{p.description || "No description"}</p>
              {p.tone && (
                <p className="text-xs text-stone-400 italic">Tone: {p.tone.length > 100 ? p.tone.slice(0, 100) + "..." : p.tone}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-stone-900 rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl">
            <h3 className="font-semibold text-lg mb-4">Edit Persona: {editing.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-stone-500 block mb-1">Display Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-2 text-sm"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Description</label>
                <textarea
                  className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-2 text-sm min-h-[80px]"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Tone / Personality</label>
                <textarea
                  className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-2 text-sm min-h-[80px]"
                  value={editTone}
                  onChange={e => setEditTone(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-tab navigation ──

type SubTab = "queue" | "compose" | "history" | "personas";

const SUB_TABS: { value: SubTab; label: string; icon: typeof MessageSquare }[] = [
  { value: "queue", label: "Queue", icon: MessageSquare },
  { value: "compose", label: "Compose", icon: Send },
  { value: "history", label: "History", icon: History },
  { value: "personas", label: "Personas", icon: Users },
];

// ── Main TwitterTab ──

export function TwitterTab() {
  const [subTab, setSubTab] = useState<SubTab>("queue");

  return (
    <div className="space-y-6">
      <StatsBar />

      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-sky-500" /> Twitter Management
          </h2>
          <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
            {SUB_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSubTab(tab.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    subTab === tab.value
                      ? "bg-white dark:bg-stone-900 text-sky-600 shadow-sm"
                      : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {subTab === "queue" && <QueueSubTab />}
        {subTab === "compose" && <ComposeSubTab />}
        {subTab === "history" && <HistorySubTab />}
        {subTab === "personas" && <PersonasSubTab />}
      </div>
    </div>
  );
}
