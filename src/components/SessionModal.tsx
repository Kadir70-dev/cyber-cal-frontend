import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, Bell } from "lucide-react";
import { Session } from "../types";
import { toast } from "sonner";

interface SessionModalProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionModal({ session, open, onOpenChange }: SessionModalProps) {
  if (!session) return null;

  const getTopicColor = (topic: string) => {
    switch (topic.toLowerCase()) {
      case "soc":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "grc":
        return "bg-green-100 text-green-700 border-green-300";
      case "threat intel":
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleAddReminder = () => {
    toast.success("Reminder added successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[20px]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl">{session.title}</DialogTitle>
            <Badge
              variant="outline"
              className={`${getTopicColor(session.topic)} rounded-full`}
            >
              {session.topic}
            </Badge>
          </div>
          <DialogDescription className="text-left pt-4 space-y-4">
            <div>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {session.date}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Time:</strong> {session.time}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Trainer:</strong> {session.trainer}
              </p>
            </div>
            <div>
              <p className="text-gray-700">{session.description}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button
            className="flex-1 bg-[#4B9CD3] hover:bg-[#3A8BC2] text-white"
            onClick={() => window.open(session.meetingLink, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Join Meeting
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-[#4B9CD3] text-[#4B9CD3] hover:bg-[#4B9CD3] hover:text-white"
            onClick={handleAddReminder}
          >
            <Bell className="w-4 h-4 mr-2" />
            Add Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
