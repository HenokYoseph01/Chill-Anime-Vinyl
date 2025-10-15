import { Sun, Moon, Laptop } from "lucide-react";
import { setTheme } from "../theme";

export default function ThemeToggle() {
  return (
    <div className="flex gap-2 items-center mt-2">
      <button
        onClick={() => setTheme("light")}
        className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700 transition hover:cursor-pointer"
        title="Light Mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700 transition hover:cursor-pointer"
        title="Dark Mode"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className="p-2 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700 transition hover:cursor-pointer"
        title="System Theme"
      >
        <Laptop size={16} />
      </button>
    </div>
  );
}
