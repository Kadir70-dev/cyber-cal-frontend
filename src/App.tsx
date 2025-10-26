import { JSX, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { CalendarView } from "./components/CalendarView";
import { SessionModal } from "./components/SessionModal";
import { Footer } from "./components/Footer";
import { AdminLogin } from "./components/AdminLogin";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminDashboard } from "./components/AdminDashboard";
import { SessionForm } from "./components/SessionForm";
import { SessionTable } from "./components/SessionTable";
import { Session } from "./types";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// 🔒 Protected Route
function ProtectedRoute({ children, token }: { children: JSX.Element; token: string }) {
  if (!token) {
    toast.error("Please login first");
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 🏠 Home Page
function HomePage({ sessions }: { sessions: Session[] }) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onAdminClick={function (): void {
        throw new Error("Function not implemented.");
      } } />
      <Hero />
      <CalendarView
        sessions={sessions}
        onSessionClick={(session) => {
          setSelectedSession(session);
          setModalOpen(true);
        }}
      />
      <SessionModal
        session={selectedSession}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
      <Footer />
    </div>
  );
}

// 🔑 Login Page
function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const navigate = useNavigate();
  return (
    <AdminLogin
      onLogin={(token) => {
        onLogin(token);
        navigate("/admin");
      }}
      onCancel={() => navigate("/")}
    />
  );
}

// 🧭 Admin Layout
function AdminLayout({
  children,
  onLogout,
  currentView,
  onViewChange,
}: {
  children: JSX.Element;
  onLogout: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        currentView={currentView}
        onViewChange={onViewChange}
        onLogout={onLogout}
      />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

/* 🧱 Separate component where hooks like useNavigate() are valid */
function AppRoutes({
  token,
  setToken,
  sessions,
  setSessions,
  editingSession,
  setEditingSession,
}: any) {
  const [adminView, setAdminView] = useState("dashboard");
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;



  // Fetch sessions
  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sessions`);
      const data = await res.json();
      if (Array.isArray(data)) setSessions(data);
      else throw new Error("Invalid response format");
    } catch {
      toast.error("Failed to load sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // 🔧 CRUD Handlers
  const handleEdit = async (session: Session) => {
    try {
      const res = await fetch(`${API_BASE}/api/sessions/${session.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch session");
      const data = await res.json();
      setEditingSession(data);
      navigate("/admin/add");
      toast.info("Editing session...");
    } catch {
      toast.error("Unable to load session");
    }
  };

  const handleAddSession = async (newSession: Omit<Session, "id">) => {
    const res = await fetch(`${API_BASE}/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newSession),
    });
    if (res.ok) {
      toast.success("Session created");
      fetchSessions();
      navigate("/admin/sessions");
    } else toast.error("Error creating session");
  };

  const handleUpdateSession = async (updated: Session) => {
    const res = await fetch(`${API_BASE}/api/sessions/${updated.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      toast.success("Session updated");
      fetchSessions();
      navigate("/admin/sessions");
    } else toast.error("Update failed");
  };

  const handleDeleteSession = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/sessions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast.info("Session deleted");
      fetchSessions();
    } else toast.error("Delete failed");
  };

  const handleLogin = (jwt: string) => {
    localStorage.setItem("adminToken", jwt);
    setToken(jwt);
    toast.success("Login successful");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    toast.info("Logged out");
  };

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage sessions={sessions} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      {/* Protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute token={token}>
            <AdminLayout
              onLogout={handleLogout}
              currentView="dashboard"
              onViewChange={setAdminView}
            >
              <AdminDashboard token={token} onSessionsUpdate={setSessions} />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add"
        element={
          <ProtectedRoute token={token}>
            <AdminLayout
              onLogout={handleLogout}
              currentView="add"
              onViewChange={setAdminView}
            >
              <SessionForm
                onAddSession={handleAddSession}
                onUpdateSession={handleUpdateSession}
                editSession={editingSession}
              />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/sessions"
        element={
          <ProtectedRoute token={token}>
            <AdminLayout
              onLogout={handleLogout}
              currentView="all"
              onViewChange={setAdminView}
            >
              <SessionTable
                sessions={sessions}
                token={token}
                onEdit={handleEdit}
                onDelete={handleDeleteSession}
              />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// 🏁 Main App Entry
export default function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  return (
    <Router>
      <Toaster position="top-right" />
      <AppRoutes
        token={token}
        setToken={setToken}
        sessions={sessions}
        setSessions={setSessions}
        editingSession={editingSession}
        setEditingSession={setEditingSession}
      />
    </Router>
  );
}
