import { useNavigate } from "react-router-dom";
import { Lock, LayoutDashboard, Plus, List, LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function AdminSidebar({
  currentView,
  onViewChange,
  onLogout,
}: AdminSidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      id: "add",
      label: "Add Session",
      icon: Plus,
      path: "/admin/add",
    },
    {
      id: "all",
      label: "All Sessions",
      icon: List,
      path: "/admin/sessions",
    },
  ];

  const handleNavigation = (item: typeof menuItems[number]) => {
    onViewChange(item.id);
    navigate(item.path); // ✅ change the actual URL
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Lock className="w-6 h-6 text-[#4B9CD3]" />
          <span className="text-[#4B9CD3] font-medium">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              currentView === item.id
                ? "bg-[#4B9CD3] text-white hover:bg-[#3A8BC2]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleNavigation(item)}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
