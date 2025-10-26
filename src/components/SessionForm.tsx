import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Session } from "../types";
import { toast } from "sonner";

interface SessionFormProps {
  onAddSession: (session: Omit<Session, "id">) => void;
  editSession?: Session | null;
  onUpdateSession?: (session: Session) => void;
  onCancel?: () => void;
}

export function SessionForm({
  onAddSession,
  editSession,
  onUpdateSession,
  onCancel,
}: SessionFormProps) {
  const [formData, setFormData] = useState<Omit<Session, "id">>({
    title: "",
    date: "",
    time: "",
    description: "",
    meetingLink: "",
    trainer: "",
    topic: "",
    durationMinutes: 60,
  });

  // ✅ Prefill when editing
  useEffect(() => {
    if (editSession) {
      setFormData({
        title: editSession.title || "",
        date: editSession.date ? editSession.date.split("T")[0] : "",
        time: editSession.date
          ? new Date(editSession.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        description: editSession.description || "",
        meetingLink: editSession.meetingLink || "",
        trainer: editSession.trainer || "",
        topic: editSession.topic || "SOC",
        durationMinutes: editSession.durationMinutes ?? 60,
      });
    }
  }, [editSession]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date + time into ISO format
    const dateTime = new Date(`${formData.date}T${formData.time}`);

    const payload = {
      ...formData,
      date: dateTime.toISOString(),
    };

    if (editSession && onUpdateSession) {
      // ✅ Update mode
      onUpdateSession({ ...payload, _id: editSession._id });
      toast.success("Session updated successfully!");
    } else {
      // ✅ Create mode
      onAddSession(payload);
      toast.success("Session added successfully!");
    }

    // Reset
    setFormData({
      title: "",
      date: "",
      time: "",
      description: "",
      meetingLink: "",
      trainer: "",
      topic: "",
      durationMinutes: 60,
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-8 text-gray-900">
        {editSession ? "Edit Session" : "Add New Session"}
      </h2>
      <Card className="p-8 rounded-[20px] shadow-lg max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Session Title</Label>
            <Input
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., SOC Security 101"
              className="rounded-lg"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Topic Category</Label>
            <Select
              value={formData.topic}
              onValueChange={(value) =>
                setFormData({ ...formData, topic: value })
              }
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOC">SOC</SelectItem>
                <SelectItem value="GRC">GRC</SelectItem>
                <SelectItem value="Threat Intel">Threat Intel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Trainer Name</Label>
            <Input
              required
              value={formData.trainer}
              onChange={(e) =>
                setFormData({ ...formData, trainer: e.target.value })
              }
              placeholder="e.g., Sohail Sir"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the session..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Meeting Link</Label>
            <Input
              type="url"
              required
              value={formData.meetingLink}
              onChange={(e) =>
                setFormData({ ...formData, meetingLink: e.target.value })
              }
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#4B9CD3] to-[#3A8BC2] text-white"
            >
              {editSession ? "Update Session" : "Add Session"}
            </Button>
            {editSession && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-lg"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
