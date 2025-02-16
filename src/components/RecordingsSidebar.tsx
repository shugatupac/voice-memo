import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, PlayCircle, Trash2 } from "lucide-react";

interface Recording {
  id: string;
  title: string;
  duration: string;
  timestamp: string;
  selected?: boolean;
}

interface RecordingsSidebarProps {
  recordings?: Recording[];
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const RecordingsSidebar = ({
  recordings = [
    {
      id: "1",
      title: "Meeting Notes",
      duration: "5:30",
      timestamp: "2 hours ago",
      selected: true,
    },
    {
      id: "2",
      title: "Project Brainstorm",
      duration: "10:15",
      timestamp: "4 hours ago",
    },
    {
      id: "3",
      title: "Quick Reminder",
      duration: "1:45",
      timestamp: "Yesterday",
    },
  ],
  onSelect = () => {},
  onDelete = () => {},
}: RecordingsSidebarProps) => {
  return (
    <div className="w-full lg:w-[300px] h-full bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl border border-accent overflow-hidden">
      <div className="p-4 border-b border-accent/50">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          Recent Recordings
        </h2>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100%-4rem)]">
        <div className="p-4 space-y-3">
          {recordings.map((recording) => (
            <Card
              key={recording.id}
              className={`group p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${recording.selected ? "border-primary bg-accent/20" : "border-accent/50 hover:border-primary/50"}`}
              onClick={() => onSelect(recording.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                    {recording.title}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-2 space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {recording.duration}
                    </span>
                    <span>{recording.timestamp}</span>
                  </div>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-accent/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Play functionality would go here
                    }}
                  >
                    <PlayCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(recording.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecordingsSidebar;
