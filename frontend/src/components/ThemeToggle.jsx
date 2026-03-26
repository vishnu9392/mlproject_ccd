import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ccdp_theme");
    const initial =
      saved === "dark"
        ? true
        : saved === "light"
          ? false
          : window.matchMedia &&
              window.matchMedia("(prefers-color-scheme: dark)").matches;

    setDark(Boolean(initial));
    document.documentElement.classList.toggle("dark", Boolean(initial));
  }, []);

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("ccdp_theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <button
      onClick={toggle}
      className="glass ripple-btn h-11 w-11 rounded-xl flex items-center justify-center transition-transform hover:scale-[1.03] active:scale-[0.98]"
      aria-label="Toggle dark mode"
      type="button"
    >
      {dark ? (
        <FiSun className="text-brandSecondary" size={18} />
      ) : (
        <FiMoon className="text-brandPrimary" size={18} />
      )}
    </button>
  );
}

