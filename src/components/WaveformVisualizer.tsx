import React from "react";
import { motion } from "framer-motion";

interface WaveformVisualizerProps {
  isRecording?: boolean;
  audioData?: number[];
}

const WaveformVisualizer = ({
  isRecording = false,
  audioData = Array(50).fill(0.5),
}: WaveformVisualizerProps) => {
  const containerVariants = {
    recording: {
      scale: 1.02,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
    idle: {
      scale: 1,
    },
  };

  return (
    <motion.div
      className="w-full aspect-[2/1] bg-background/50 rounded-xl shadow-inner border border-accent/50 p-6 flex items-center justify-center overflow-hidden"
      variants={containerVariants}
      animate={isRecording ? "recording" : "idle"}
    >
      <div className="w-full h-full flex items-center justify-center gap-[2px]">
        {audioData.map((value, index) => (
          <motion.div
            key={index}
            className="h-full w-1 rounded-full bg-gradient-to-t from-primary/50 to-purple-600/50"
            initial={{ scaleY: 0.1 }}
            animate={{
              scaleY: isRecording ? value : 0.1,
              opacity: isRecording ? 1 : 0.5,
            }}
            transition={{
              duration: 0.2,
              delay: index * 0.01,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default WaveformVisualizer;
