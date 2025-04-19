import React, { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logoutUser } from "../store/thunks/authThunks";

const UserProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isDarkMode ? "bg-gray-700" : "bg-blue-100"
        } text-blue-600 hover:opacity-90 transition-opacity`}
      >
        <User size={20} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 z-10 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="px-4 py-3 border-b border-gray-200">
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} capitalize`}>
              {user.role}
            </p>
            <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {user.name}
            </p>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {user.email}
            </p>
            {user.role === "employer" && user.company && (
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {user.company}
              </p>
            )}
          </div>
          <div className="px-2 py-2">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;