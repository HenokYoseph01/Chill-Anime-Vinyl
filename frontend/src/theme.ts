export function applyTheme() {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isDark = stored === "dark" || (!stored && prefersDark);

  document.documentElement.classList.toggle("dark", isDark);
}

export function setTheme(mode: "light" | "dark" | "system") {
  if (mode === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", mode);
  }

  applyTheme();
}
