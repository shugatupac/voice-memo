import React, { useState } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Clock, Edit3, List, MessageSquare } from "lucide-react";

interface TranscriptionPanelProps {
  transcription?: string;
  summary?: string[];
  keyPoints?: string[];
  timestamps?: Array<{ time: string; text: string }>;
  isProcessing?: boolean;
}

const TranscriptionPanel = ({
  transcription = "This is a sample transcription text. It would normally contain the full transcribed content of the recording.",
  summary = [
    "First main point from the conversation",
    "Second important topic discussed",
    "Final key takeaway from the recording",
  ],
  keyPoints = ["Key insight 1", "Important fact 2", "Critical point 3"],
  timestamps = [
    { time: "0:00", text: "Introduction" },
    { time: "1:30", text: "Main discussion" },
    { time: "3:45", text: "Conclusion" },
  ],
  isProcessing = false,
}: TranscriptionPanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(transcription);

  return (
    <Card className="w-full h-full bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl border border-accent overflow-hidden">
      <div className="p-6 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Transcription
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
            className="hover:bg-accent/50"
          >
            <Edit3 className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="transcription" className="flex-1">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
            <TabsTrigger
              value="transcription"
              className="data-[state=active]:bg-primary/20"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Full Text</span>
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="data-[state=active]:bg-primary/20"
            >
              <List className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
            <TabsTrigger
              value="keyPoints"
              className="data-[state=active]:bg-primary/20"
            >
              <List className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Key Points</span>
            </TabsTrigger>
            <TabsTrigger
              value="timestamps"
              className="data-[state=active]:bg-primary/20"
            >
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Timestamps</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 flex-1 bg-background/50 rounded-lg p-4">
            <TabsContent value="transcription" className="h-full">
              <ScrollArea className="h-[calc(100vh-300px)] lg:h-[600px] w-full">
                {isEditing ? (
                  <Textarea
                    value={editableText}
                    onChange={(e) => setEditableText(e.target.value)}
                    className="min-h-[300px] bg-background/50"
                  />
                ) : (
                  <div className="whitespace-pre-wrap">{editableText}</div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="summary" className="h-full">
              <ScrollArea className="h-[calc(100vh-300px)] lg:h-[600px] w-full">
                <ul className="space-y-4">
                  {summary.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/20"
                    >
                      <span className="font-bold text-primary">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="keyPoints" className="h-full">
              <ScrollArea className="h-[calc(100vh-300px)] lg:h-[600px] w-full">
                <ul className="space-y-4">
                  {keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/20"
                    >
                      <span className="font-bold text-primary">
                        {index + 1}.
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="timestamps" className="h-full">
              <ScrollArea className="h-[calc(100vh-300px)] lg:h-[600px] w-full">
                <div className="space-y-2">
                  {timestamps.map((stamp, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/20 transition-colors"
                    >
                      <span className="font-mono text-sm text-primary min-w-[60px]">
                        {stamp.time}
                      </span>
                      <span>{stamp.text}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Card>
  );
};

export default TranscriptionPanel;
