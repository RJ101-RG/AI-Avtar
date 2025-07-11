
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Download, RefreshCw, Volume2 } from "lucide-react";

interface AvatarPreviewProps {
  originalVideo: File | null;
  processedData: {
    audioUrl?: string;
    extractedText?: string;
    selectedVoice?: string;
  };
}

export const AvatarPreview = ({ originalVideo, processedData }: AvatarPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayback = () => {
    if (processedData?.audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadVideo = () => {
    if (processedData?.audioUrl && originalVideo) {
      const link = document.createElement('a');
      link.href = processedData.audioUrl;
      link.download = `${originalVideo.name.split('.')[0]}_ai_avatar.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("No processed video available for download");
    }
  };

  return (
    <div className="space-y-6">
      <audio ref={audioRef} src={processedData?.audioUrl} />

      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">AI Avatar Preview</h2>
        <p className="text-slate-600">
          Your training video with AI avatar and neutral accent voice
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Video */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Original Video</span>
              <Badge variant="secondary">Source</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Play className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-600 font-medium">
                  {originalVideo?.name || "Original Training Video"}
                </p>
                <p className="text-sm text-slate-500">
                  {originalVideo ? `${(originalVideo.size / (1024 * 1024)).toFixed(1)} MB` : "Video file"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Avatar Video */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AI Avatar Version</span>
              <Badge variant="default">Enhanced</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4 cursor-pointer"
              onClick={togglePlayback}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 hover:bg-blue-600 transition-colors">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white" />
                  )}
                </div>
                <p className="text-slate-800 font-medium">AI Avatar Training</p>
                <p className="text-sm text-slate-600">
                  {processedData?.audioUrl ? 'Click to play preview' : 'Processing...'}
                </p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayback}
                  className="flex-shrink-0"
                  disabled={!processedData?.audioUrl}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-slate-600 flex-shrink-0">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-600">AI Voice Active</span>
                </div>
                <Button
                  size="sm"
                  onClick={downloadVideo}
                  disabled={!processedData?.audioUrl}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">✓</div>
              <h4 className="font-medium text-slate-800">Speech Extracted</h4>
              <p className="text-sm text-slate-600">
                {processedData?.extractedText?.length || 0} characters
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">✓</div>
              <h4 className="font-medium text-slate-800">Voice Generated</h4>
              <p className="text-sm text-slate-600">
                {processedData?.selectedVoice ? 'AI voice active' : 'Processing...'}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">✓</div>
              <h4 className="font-medium text-slate-800">Avatar Synced</h4>
              <p className="text-sm text-slate-600">Lip-sync completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Process Another Video
        </Button>
        <Button onClick={downloadVideo}>
          <
