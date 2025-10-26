import { Lock } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  onAdminClick: () => void;
}

export function Navbar({ onAdminClick }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-[#4B9CD3]" />
            <span className="text-[#4B9CD3]">Cybersecurity Calendar</span>
          </div>
          
          {/* <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-[#4B9CD3] transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-[#4B9CD3] transition-colors">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-[#4B9CD3] transition-colors">
              Contact
            </a>
            <Button
              variant="outline"
              onClick={onAdminClick}
              className="border-[#4B9CD3] text-[#4B9CD3] hover:bg-[#4B9CD3] hover:text-white transition-colors"
            >
              Admin Login
            </Button> */}
          {/* </div> */}
        </div>
      </div>
    </nav>
  );
}
