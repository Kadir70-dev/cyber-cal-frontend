import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Session } from "../types";

interface AdminDashboardProps {
  token: string;
  onSessionsUpdate: (sessions: Session[]) => void;
}

export function AdminDashboard({ token, onSessionsUpdate }: AdminDashboardProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch sessions from backend
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/sessions`
      );
      const data = await res.json();
      setSessions(data);
      onSessionsUpdate(data); // update calendar view
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Calculate stats
  const today = new Date();
  const upcomingSessions = sessions.filter(
    (s) => new Date(s.date) >= today
  ).length;
  const completedSessions = sessions.filter(
    (s) => new Date(s.date) < today
  ).length;

  const stats = [
    {
      title: "Total Sessions",
      value: sessions.length,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Upcoming Sessions",
      value: upcomingSessions,
      icon: Clock,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Completed Sessions",
      value: completedSessions,
      icon: CheckCircle,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-2 text-gray-900">Welcome, Sohail Sir 👋</h2>
      <p className="text-gray-600 mb-8">Here's an overview of your sessions</p>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="p-6 rounded-[20px] shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Sessions Table */}
      <Card className="p-6 rounded-[20px] shadow-lg">
        <h3 className="text-xl font-semibold mb-4">All Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Topic</th>
                <th className="p-3">Date</th>
                <th className="p-3">Trainer</th>
                {/* <th className="p-3">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{s.title}</td>
                  <td className="p-3">{s.topic}</td>
                  <td className="p-3">{new Date(s.date).toLocaleString()}</td>
                  <td className="p-3">{s.trainer}</td>
                  {/* 
                  <td className="p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await fetch(
                          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/sessions/${s._id}`,
                          {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        toast.info("Session deleted");
                        fetchSessions();
                      }}
                    >
                      Delete
                    </Button>
                  </td> 
                  */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
