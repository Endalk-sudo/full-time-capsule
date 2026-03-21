import React from "react";
import { Clock, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="flex h-14 max-w-full items-center justify-between p-4 text-black shadow-sm">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6" />
        <h1 className="text-xl font-bold">Time Capsule</h1>
      </div>
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <p className="text-black">HEY 👋 {user?.name || "Guest"}</p>
          <button className="cursor-pointer" onClick={logout}>
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="transform rounded-md bg-black px-4 py-1.5 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-0"
        >
          Login
        </Link>
      )}
    </header>
  );
};

export default Navbar;
