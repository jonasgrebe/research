"use client";

import { useEffect, useSyncExternalStore } from "react";

type ThemePreference = "light" | "dark";

const nextTheme: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "light",
};

function applyTheme(preference: ThemePreference) {
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.theme = preference;
}

function getThemePreference(): ThemePreference {
  const storedPreference = localStorage.getItem("research-theme");
  if (storedPreference === "light" || storedPreference === "dark") {
    return storedPreference;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeToThemePreference(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("research-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("research-theme-change", callback);
  };
}

function getServerThemePreference(): ThemePreference {
  return "light";
}

export function ThemeToggle() {
  const preference = useSyncExternalStore(
    subscribeToThemePreference,
    getThemePreference,
    getServerThemePreference,
  );

  useEffect(() => {
    applyTheme(preference);
  }, [preference]);

  const cycleTheme = () => {
    const next = nextTheme[preference];
    localStorage.setItem("research-theme", next);
    window.dispatchEvent(new Event("research-theme-change"));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycleTheme}
      aria-label={`Theme: ${preference}. Activate to use ${nextTheme[preference]} theme.`}
      title={`Theme: ${preference}`}
    >
      <span className="theme-indicator" aria-hidden="true">
        <i />
      </span>
      <span>{preference}</span>
    </button>
  );
}
