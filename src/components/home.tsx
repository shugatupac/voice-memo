import React, { useState } from "react";
import { audioRecorder } from "@/lib/audioRecorder";
import { transcribeAudio, summarizeText } from "@/lib/anthropic";
import RecordingSection from "./RecordingSection";
import TranscriptionPanel from "./TranscriptionPanel";
import RecordingsSidebar from "./RecordingsSidebar";
import ProcessingOverlay from "./ProcessingOverlay";

interface HomeProps {
  initialRecording?: {
    transcription?: string;
    summary?: string[];
    keyPoints?: string[];
    timestamps?: Array<{ time: string; text: string }>;
  };
}

const Home = ({
  initialRecording = {
    transcription: "",
    summary: [],
    keyPoints: [],
    timestamps: [],
  },
}: HomeProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleRecordingStart = () => {
    setIsRecording(true);
  };

  const [transcriptionData, setTranscriptionData] = useState(initialRecording);

  const handleRecordingStop = async () => {
    setIsRecording(false);
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Get the recorded audio blob
      const audioBlob = await audioRecorder.stopRecording();
      setProcessingProgress(20);

      if (!audioBlob || audioBlob.size === 0) {
        throw new Error("No audio recorded");
      }

      // Transcribe the audio
      console.log("Starting transcription...");
      const transcription = await transcribeAudio(audioBlob);
      console.log("Transcription received:", transcription);

      // Update UI with transcription immediately
      setTranscriptionData((prev) => ({
        ...prev,
        transcription,
      }));
      setProcessingProgress(60);

      // Generate summary and analysis
      console.log("Starting analysis...");
      const analysis = await summarizeText(transcription);
      console.log("Analysis received:", analysis);
      setProcessingProgress(90);

      // Update the transcription data
      setTranscriptionData({
        transcription,
        summary: analysis.summary,
        keyPoints: analysis.keyPoints,
        timestamps: analysis.timestamps,
      });

      setProcessingProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingProgress(0);
      }, 500);
    } catch (error) {
      console.error("Processing error:", error);
      setIsProcessing(false);
      setProcessingProgress(0);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 relative">
        <div className="lg:w-1/3">
          <RecordingSection
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
            isProcessing={isProcessing}
          />
        </div>

        <div className="lg:w-2/3">
          <TranscriptionPanel
            transcription={transcriptionData.transcription}
            summary={transcriptionData.summary}
            keyPoints={transcriptionData.keyPoints}
            timestamps={transcriptionData.timestamps}
            isProcessing={isProcessing}
          />
        </div>

        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15V19H3V15" />
              <path d="M12 3V15" />
              <path d="m9 6 3-3 3 3" />
            </svg>
          </button>
        </div>

        <div
          className={`fixed inset-y-0 right-0 transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 lg:z-0`}
        >
          <RecordingsSidebar />
        </div>
      </div>

      <ProcessingOverlay
        isVisible={isProcessing}
        progress={processingProgress}
        message="Processing your recording..."
      />
    </div>
  );
};

export default Home;
