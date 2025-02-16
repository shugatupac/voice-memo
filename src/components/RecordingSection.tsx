import React, { useState } from "react";
import { audioRecorder } from "@/lib/audioRecorder";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Mic, Square } from "lucide-react";
import WaveformVisualizer from "./WaveformVisualizer";
import { motion } from "framer-motion";

interface RecordingSectionProps {
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  isProcessing?: boolean;
}

const RecordingSection = ({
  onRecordingStart = () => {},
  onRecordingStop = () => {},
  isProcessing = false,
}: RecordingSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(Array(50).fill(0.5));
  const [updateInterval, setUpdateInterval] = useState<number | null>(null);

  const handleRecordToggle = async () => {
    if (isRecording) {
      setIsRecording(false);
      if (updateInterval) clearInterval(updateInterval);
      onRecordingStop();
    } else {
      try {
        const { audioData } = await audioRecorder.startRecording();
        setAudioData(audioData);
        setIsRecording(true);
        onRecordingStart();

        const interval = window.setInterval(() => {
          const newAudioData = audioRecorder.getAudioData();
          setAudioData(newAudioData);
        }, 100);

        setUpdateInterval(interval);
      } catch (error) {
        console.error("Failed to start recording:", error);
      }
    }
  };

  return (
    <Card className="w-full h-full bg-background/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-accent">
      <div className="flex flex-col items-center space-y-8">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          {isRecording ? "Recording..." : "Ready to Record"}
        </div>

        <div className="w-full max-w-md">
          <WaveformVisualizer isRecording={isRecording} audioData={audioData} />
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className={`relative rounded-full w-20 h-20 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"}`}
            onClick={handleRecordToggle}
            disabled={isProcessing}
          >
            {isRecording ? (
              <Square className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </Button>
        </motion.div>

        <div className="text-sm text-muted-foreground font-medium">
          {isRecording ? "Click to stop recording" : "Click to start recording"}
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          {isProcessing ? "Processing recording..." : "All systems ready"}
        </div>
      </div>
    </Card>
  );
};

export default RecordingSection;
