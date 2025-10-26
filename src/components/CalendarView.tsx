import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Session } from "../types";
import { format } from "date-fns";

interface CalendarViewProps {
  sessions: Session[];
  onSessionClick: (session: Session) => void;
}

export function CalendarView({ sessions, onSessionClick }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(
      (session) =>
        format(new Date(session.date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
  };

  const selectedDateSessions = selectedDate
    ? getSessionsForDate(selectedDate)
    : [];

  const hasSessionsOnDate = (date: Date) => {
    return sessions.some(
      (session) =>
        format(new Date(session.date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
  };

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

  const formatSessionTime = (session: Session) => {
    const startTime = new Date(session.date);
    const endTime = new Date(startTime.getTime() + (session.durationMinutes || 60) * 60000);
    return `${format(startTime, "hh:mm a")} - ${format(endTime, "hh:mm a")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-[1fr,400px] gap-8">
        {/* Calendar Section */}
        <Card className="p-6 rounded-[20px] shadow-lg">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
            modifiers={{
              hasSession: (date) => hasSessionsOnDate(date),
            }}
            modifiersStyles={{
              hasSession: {
                backgroundColor: "#4B9CD3",
                color: "white",
                fontWeight: "bold",
                borderRadius: "50%",
              },
            }}
          />
        </Card>

        {/* Sessions on Selected Date */}
        <div className="space-y-4">
          <h3 className="text-xl text-gray-900 font-semibold">
            {selectedDate
              ? `Sessions on ${format(selectedDate, "MMMM d, yyyy")}`
              : "Select a date"}
          </h3>

          {selectedDateSessions.length === 0 ? (
            <Card className="p-6 rounded-[20px] shadow text-center text-gray-500">
              No sessions scheduled for this date
            </Card>
          ) : (
            selectedDateSessions.map((session) => (
              <Card
                key={session._id}
                className="p-6 rounded-[20px] shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSessionClick(session)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-gray-900 font-medium flex-1">
                      {session.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`${getTopicColor(session.topic)} rounded-full`}
                    >
                      {session.topic}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatSessionTime(session)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Trainer: {session.trainer || "TBD"}
                  </p>
                  {session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
