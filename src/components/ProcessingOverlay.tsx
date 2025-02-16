import React from "react";
import { motion } from "framer-motion";
import { Progress } from "./ui/progress";
import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  isVisible?: boolean;
  progress?: number;
  message?: string;
}

const ProcessingOverlay = ({
  isVisible = true,
  progress = 0,
  message = "Processing your recording...",
}: ProcessingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full mx-4"
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>

          <h3 className="text-xl font-semibold text-foreground">{message}</h3>

          <div className="w-full space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {Math.round(progress)}% Complete
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProcessingOverlay;
