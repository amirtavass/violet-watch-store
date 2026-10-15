const THEME_KEY = "theme";

function setThemeIcon(isDark: boolean): void {
  const icon = document.querySelector<HTMLElement>(".theme-toggle i");
  if (!icon) return;
  icon.classList.toggle("fa-moon", !isDark);
  icon.classList.toggle("fa-sun", isDark);
}

export function initTheme(): void {
  const saved = localStorage.getItem(THEME_KEY);
  const isDark = saved === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  setThemeIcon(isDark);
}

export function toggleTheme(): void {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  setThemeIcon(isDark);
}
