import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Lock } from "lucide-react";
import { toast } from "sonner";

// Add this declaration so TypeScript knows about import.meta.env
interface ImportMetaEnv {
  VITE_API_BASE_URL?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

interface AdminLoginProps {
  onLogin: (token: string) => void;
  onCancel: () => void;
}

export function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Invalid credentials");
      } else {
        toast.success(`Welcome ${data.admin.name}!`);
        localStorage.setItem("adminToken", data.token);
        onLogin(data.token);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4B9CD3]/10 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 rounded-[20px] shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4B9CD3]/10 rounded-full mb-4">
            <Lock className="w-8 h-8 text-[#4B9CD3]" />
          </div>
          <h2 className="text-2xl text-gray-900">Admin Login</h2>
          <p className="text-gray-600 mt-2">Sign in to manage sessions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              required
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              placeholder="Enter email"
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              required
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Enter password"
              className="rounded-lg"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#4B9CD3] to-[#3A8BC2] hover:from-[#3A8BC2] hover:to-[#2A7BB2] text-white rounded-lg"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
