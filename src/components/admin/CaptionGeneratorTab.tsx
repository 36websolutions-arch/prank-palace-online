import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, Copy, RefreshCw, Clock, Trash2, Upload, FileText, Video, Images, X } from "lucide-react";

interface GeneratedCaption {
  title: string;
  body: string;
  hashtags: string;
  full: string;
}

interface CaptionHistoryEntry {
  caption: GeneratedCaption;
  videoDescription: string;
  timestamp: number;
}

const HISTORY_KEY = "cp-caption-history";
const MAX_HISTORY = 5;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_DURATION = 120; // 2 minutes
const MAX_CAROUSEL_FILES = 10; // Instagram carousel limit
const CAROUSEL_FRAMES_PER_VIDEO = 5; // Fewer frames per video in carousel mode

function loadHistory(): CaptionHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: CaptionHistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

interface CarouselPreview {
  file: File;
  previewUrl: string;
  type: "image" | "video";
}

type InputMode = "text" | "video" | "carousel";
type ProcessingStage =
  | "idle"
  | "extracting"
  | "uploading"
  | "transcribing"
  | "processing"
  | "generating";

const STAGE_LABELS: Record<ProcessingStage, string> = {
  idle: "",
  extracting: "Extracting frames from video...",
  uploading: "Uploading video to the archives...",
  transcribing: "Transcribing audio & analyzing visuals...",
  processing: "Analyzing carousel slides...",
  generating: "Consulting the Oracle...",
};

/** Extract evenly-spaced JPEG frames from a video file via Canvas */
async function extractFrames(file: File, frameCount = 8): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      const seekPoints = frameCount === 1
        ? [duration * 0.5]
        : Array.from({ length: frameCount }, (_, i) =>
            (i / (frameCount - 1)) * 0.95 * duration
          );
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const frames: string[] = [];

      for (const time of seekPoints) {
        try {
          const frame = await seekAndCapture(video, time, canvas, ctx);
          frames.push(frame);
        } catch (err) {
          console.error(`Failed to capture frame at ${time}s:`, err);
        }
      }

      URL.revokeObjectURL(url);
      if (frames.length === 0) {
        reject(new Error("Could not extract any frames from video"));
      } else {
        resolve(frames);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video file"));
    };
  });
}

function seekAndCapture(
  video: HTMLVideoElement,
  time: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): Promise<string> {
  return new Promise((resolve, reject) => {
    video.currentTime = time;
    video.onseeked = () => {
      try {
        // Scale to max 512px wide (keeps payload under Supabase 2MB limit)
        const scale = Math.min(1, 512 / video.videoWidth);
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        // Strip "data:image/jpeg;base64," prefix
        const base64 = dataUrl.split(",")[1];
        resolve(base64);
      } catch (err) {
        reject(err);
      }
    };
    video.onerror = () => reject(new Error("Seek failed"));
  });
}

/** Upload video to Supabase Storage, return the storage path (not full URL) */
async function uploadVideoToStorage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "mp4";
  const storagePath = `video-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("caption-videos")
    .upload(storagePath, file, { contentType: file.type });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return storagePath;
}

/** Read an image file as resized base64 JPEG (max 512px wide) */
async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 512 / img.naturalWidth);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
      URL.revokeObjectURL(url);
      resolve(dataUrl.split(",")[1]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/** Validate video file: size and duration */
function validateVideoFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`File too large (${(file.size / 1024 / 1024).toFixed(0)}MB). Max is 100MB.`));
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (video.duration > MAX_DURATION) {
        reject(new Error(`Video too long (${Math.ceil(video.duration)}s). Max is 2 minutes.`));
      } else {
        resolve();
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Cannot read video file. Is it a valid mp4/webm/mov?"));
    };
  });
}

export function CaptionGeneratorTab() {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [videoDescription, setVideoDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generating, setGenerating] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [generatedCaption, setGeneratedCaption] = useState<GeneratedCaption | null>(null);
  const [captionHistory, setCaptionHistory] = useState<CaptionHistoryEntry[]>([]);

  // Video mode state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carousel mode state
  const [carouselPreviews, setCarouselPreviews] = useState<CarouselPreview[]>([]);
  const carouselInputRef = useRef<HTMLInputElement>(null);
  const carouselUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setCaptionHistory(loadHistory());
  }, []);

  // Cleanup preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  // Cleanup carousel preview URLs on unmount only
  useEffect(() => {
    return () => {
      carouselUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await validateVideoFile(file);
      setVideoFile(file);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(URL.createObjectURL(file));
    } catch (err: any) {
      toast.error(err.message);
      e.target.value = "";
    }
  };

  const clearVideoFile = () => {
    setVideoFile(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCarouselSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = MAX_CAROUSEL_FILES - carouselPreviews.length;
    if (remaining <= 0) {
      toast.error(`Max ${MAX_CAROUSEL_FILES} files per carousel`);
      e.target.value = "";
      return;
    }

    const toAdd = files.slice(0, remaining);
    if (files.length > remaining) {
      toast.info(`Only added ${remaining} of ${files.length} files (max ${MAX_CAROUSEL_FILES})`);
    }

    // Validate files
    for (const file of toAdd) {
      if (file.type.startsWith("video/")) {
        try {
          await validateVideoFile(file);
        } catch (err: any) {
          toast.error(`${file.name}: ${err.message}`);
          e.target.value = "";
          return;
        }
      } else if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: Image too large (${(file.size / 1024 / 1024).toFixed(0)}MB). Max is 100MB.`);
        e.target.value = "";
        return;
      }
    }

    const newPreviews: CarouselPreview[] = toAdd.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      carouselUrlsRef.current.add(previewUrl);
      return {
        file,
        previewUrl,
        type: file.type.startsWith("video/") ? "video" : "image",
      };
    });

    setCarouselPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeCarouselItem = (index: number) => {
    setCarouselPreviews((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.previewUrl);
      carouselUrlsRef.current.delete(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearCarousel = () => {
    carouselPreviews.forEach((p) => {
      URL.revokeObjectURL(p.previewUrl);
      carouselUrlsRef.current.delete(p.previewUrl);
    });
    setCarouselPreviews([]);
    if (carouselInputRef.current) carouselInputRef.current.value = "";
  };

  const generateCaption = async () => {
    if (inputMode === "text" && !videoDescription.trim()) {
      toast.error("Describe the video first, Senator");
      return;
    }
    if (inputMode === "video" && !videoFile) {
      toast.error("Select a video file first");
      return;
    }
    if (inputMode === "carousel" && carouselPreviews.length === 0) {
      toast.error("Add at least one image or video to the carousel");
      return;
    }

    setGenerating(true);
    setStage("idle");

    try {
      let requestBody: Record<string, any>;

      if (inputMode === "carousel") {
        const hasVideos = carouselPreviews.some((p) => p.type === "video");
        setStage(hasVideos ? "extracting" : "processing");

        const slides: { type: string; frames: string[]; videoStoragePath?: string }[] = [];

        for (let i = 0; i < carouselPreviews.length; i++) {
          const item = carouselPreviews[i];

          if (item.type === "image") {
            const base64 = await imageToBase64(item.file);
            slides.push({ type: "image", frames: [base64] });
          } else {
            // Video: extract fewer frames + upload for transcription
            setStage("extracting");
            const frames = await extractFrames(item.file, CAROUSEL_FRAMES_PER_VIDEO);
            setStage("uploading");
            const videoStoragePath = await uploadVideoToStorage(item.file);
            slides.push({ type: "video", frames, videoStoragePath });
          }
        }

        setStage(hasVideos ? "transcribing" : "generating");
        requestBody = {
          mode: "carousel",
          slides,
          topic,
          additionalContext,
        };
      } else if (inputMode === "video" && videoFile) {
        // Phase 1: Extract frames
        setStage("extracting");
        const frames = await extractFrames(videoFile);

        // Phase 2: Upload video to storage
        setStage("uploading");
        const videoStoragePath = await uploadVideoToStorage(videoFile);

        // Phase 3: Send to edge function (it handles transcription + vision)
        setStage("transcribing");
        requestBody = {
          mode: "video",
          frames,
          videoStoragePath,
          topic,
          additionalContext,
        };
      } else {
        setStage("generating");
        requestBody = {
          videoDescription,
          topic,
          additionalContext,
        };
      }

      setStage("generating");
      const response = await supabase.functions.invoke("generate-caption", {
        body: requestBody,
      });

      if (response.error) {
        // Try to get the actual error from the function response body
        const detail = response.data?.error || response.error.message;
        throw new Error(detail);
      }

      const { caption } = response.data;
      setGeneratedCaption(caption);

      // Save to history
      const historyLabel = inputMode === "carousel"
        ? `[Carousel] ${carouselPreviews.length} slides`
        : inputMode === "video"
        ? `[Video] ${videoFile?.name || "upload"}`
        : videoDescription.substring(0, 80);

      const entry: CaptionHistoryEntry = {
        caption,
        videoDescription: historyLabel,
        timestamp: Date.now(),
      };
      const updated = [entry, ...captionHistory].slice(0, MAX_HISTORY);
      setCaptionHistory(updated);
      saveHistory(updated);

      toast.success("Caption forged from the annals of Rome");
    } catch (error: any) {
      console.error("Caption generation error:", error);
      toast.error(`Generation failed: ${error.message}`);
    } finally {
      setGenerating(false);
      setStage("idle");
    }
  };

  const copyCaption = () => {
    if (!generatedCaption) return;
    navigator.clipboard.writeText(generatedCaption.full);
    toast.success("Caption copied to clipboard");
  };

  const loadFromHistory = (entry: CaptionHistoryEntry) => {
    setGeneratedCaption(entry.caption);
  };

  const clearHistory = () => {
    setCaptionHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    toast.success("History cleared");
  };

  const canGenerate =
    inputMode === "text"
      ? videoDescription.trim().length > 0
      : inputMode === "video"
      ? !!videoFile
      : carouselPreviews.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl mb-1">Instagram Caption Generator</h2>
        <p className="text-muted-foreground text-sm italic">Describe your video, upload it, or build a carousel</p>
      </div>

      {/* Input Form */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg w-fit">
            <button
              onClick={() => setInputMode("text")}
              disabled={generating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                inputMode === "text"
                  ? "bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Text
            </button>
            <button
              onClick={() => setInputMode("video")}
              disabled={generating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                inputMode === "video"
                  ? "bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              Video Upload
            </button>
            <button
              onClick={() => setInputMode("carousel")}
              disabled={generating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                inputMode === "carousel"
                  ? "bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
              }`}
            >
              <Images className="h-3.5 w-3.5" />
              Carousel
            </button>
          </div>

          {/* Text Mode Input */}
          {inputMode === "text" && (
            <div className="space-y-2">
              <Label htmlFor="video-desc">Video Description *</Label>
              <Textarea
                id="video-desc"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="What does the video show? Describe the visual content, the scenario, who's in it, and what happens..."
                rows={5}
                disabled={generating}
              />
            </div>
          )}

          {/* Video Mode Input */}
          {inputMode === "video" && (
            <div className="space-y-3">
              <Label>Video File *</Label>
              <div className="space-y-3">
                {!videoFile ? (
                  <label
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      generating
                        ? "border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-900 cursor-not-allowed"
                        : "border-stone-300 dark:border-stone-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                    }`}
                  >
                    <Upload className="h-8 w-8 text-stone-400 mb-2" />
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      Click to upload video
                    </p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                      MP4, WebM, or MOV — max 100MB, 2 min
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleFileSelect}
                      disabled={generating}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-2">
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      {videoPreviewUrl && (
                        <video
                          src={videoPreviewUrl}
                          controls
                          className="w-full max-h-64 object-contain"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-stone-500 dark:text-stone-400 truncate">
                        {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)}MB)
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearVideoFile}
                        disabled={generating}
                        className="text-stone-500 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Carousel Mode Input */}
          {inputMode === "carousel" && (
            <div className="space-y-3">
              <Label>Carousel Slides * (max {MAX_CAROUSEL_FILES})</Label>

              {/* Preview Grid */}
              {carouselPreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {carouselPreviews.map((item, index) => (
                    <div
                      key={`${item.file.name}-${index}`}
                      className="relative group aspect-square rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.previewUrl}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={item.previewUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                            VIDEO
                          </div>
                        </div>
                      )}
                      {/* Slide number badge */}
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      {/* Remove button */}
                      {!generating && (
                        <button
                          onClick={() => removeCarouselItem(index)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add files button / drop zone */}
              {carouselPreviews.length < MAX_CAROUSEL_FILES && (
                <label
                  className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    generating
                      ? "border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-900 cursor-not-allowed"
                      : "border-stone-300 dark:border-stone-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                  }`}
                >
                  <Upload className="h-6 w-6 text-stone-400 mb-1" />
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {carouselPreviews.length === 0
                      ? "Click to add images & videos"
                      : `Add more (${carouselPreviews.length}/${MAX_CAROUSEL_FILES})`}
                  </p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                    Images + videos — max 100MB per video, 2 min
                  </p>
                  <input
                    ref={carouselInputRef}
                    type="file"
                    accept="image/*,video/mp4,video/webm,video/quicktime"
                    multiple
                    onChange={handleCarouselSelect}
                    disabled={generating}
                    className="hidden"
                  />
                </label>
              )}

              {/* Clear all button */}
              {carouselPreviews.length > 0 && !generating && (
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCarousel}
                    className="text-stone-500 hover:text-destructive gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="caption-topic">Topic / News Event (optional)</Label>
            <Input
              id="caption-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Return to office mandates, AI replacing jobs, CEO compensation..."
              disabled={generating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption-context">Additional Context (optional)</Label>
            <Textarea
              id="caption-context"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Specific angle, reference to a news event, tone preference..."
              rows={3}
              disabled={generating}
            />
          </div>

          {/* Processing stage indicator */}
          {generating && stage !== "idle" && (
            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              {STAGE_LABELS[stage]}
            </div>
          )}

          <Button
            onClick={generateCaption}
            disabled={generating || !canGenerate}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? STAGE_LABELS[stage] || "Consulting the Oracle..." : "Generate Caption"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Caption Output */}
      {generatedCaption && (
        <Card className="border-purple-200 dark:border-purple-900">
          <CardHeader className="pb-3">
            <CardTitle className="font-display flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Generated Caption
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-4 space-y-3">
              <p className="font-display text-lg text-stone-900 dark:text-stone-100">
                {generatedCaption.title}
              </p>
              <div className="font-mono text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed">
                {generatedCaption.body}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                {generatedCaption.hashtags}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {generatedCaption.full.length} characters
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={generateCaption}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  disabled={generating}
                >
                  <RefreshCw className={`h-3 w-3 ${generating ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
                <Button
                  onClick={copyCaption}
                  size="sm"
                  className="gap-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Copy className="h-3 w-3" />
                  Copy Full Caption
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Caption History */}
      {captionHistory.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Recent Captions
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive gap-1"
              onClick={clearHistory}
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {captionHistory.map((entry) => (
              <Card
                key={entry.timestamp}
                className="cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                onClick={() => loadFromHistory(entry)}
              >
                <CardContent className="p-3">
                  <p className="font-display text-sm truncate mb-1">
                    {entry.caption.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {entry.videoDescription}...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
