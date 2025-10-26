import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Pencil, Trash2, Send } from "lucide-react";
import { Session } from "../types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface SessionTableProps {
  sessions: Session[];
  onEdit: (session: Session) => void;
  onDelete: (id: string) => void;
  token: string;
}

export function SessionTable({ sessions, onEdit, onDelete, token }: SessionTableProps) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const handleSendNotification = (session: Session) => {
    toast.success(`Notification sent for "${session.title}"!`);
  };

  // ✅ Fetch session from backend before editing
  const handleEditClick = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch session details");
      const fullSession = await res.json();
      onEdit(fullSession);
      toast.info("Editing session...");
    } catch (err) {
      console.error(err);
      toast.error("Unable to load session for editing");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-8 text-gray-900">All Sessions</h2>
      <Card className="rounded-[20px] shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No sessions found. Add your first session!
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session._id}>
                  <TableCell>{session.title}</TableCell>
                  <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {new Date(session.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{session.trainer}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        session.topic === "SOC"
                          ? "bg-blue-100 text-blue-700"
                          : session.topic === "GRC"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {session.topic}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Send Notification */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSendNotification(session)}
                        className="text-[#4B9CD3] hover:bg-[#4B9CD3]/10"
                      >
                        <Send className="w-4 h-4" />
                      </Button>

                      {/* Edit Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(session._id)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      {/* Delete Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[20px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete
                              "{session.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                onDelete(session._id);
                                toast.success("Session deleted successfully!");
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
