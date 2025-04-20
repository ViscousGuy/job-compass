import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { toggleDarkMode } from "../store/slices/themeSlice";
import UserProfileMenu from "./UserProfileMenu";

function Navbar() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav
      className={`${isDarkMode ? "dark bg-gray-800" : "bg-white"} shadow-md`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Job Compass
          </Link>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link
                  to="/jobs"
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } hover:text-blue-600`}
                >
                  Jobs
                </Link>
                <Link
                  to={`/${user.role}/dashboard`}
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } hover:text-blue-600`}
                >
                  Dashboard
                </Link>
                <UserProfileMenu />
              </>
            )}

            {!user && (
              <Link
                to="/login"
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } hover:text-blue-600`}
              >
                Login
              </Link>
            )}

            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`p-2 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
