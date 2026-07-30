"use client";

import { useEffect, useSyncExternalStore } from "react";

type ThemePreference = "system" | "light" | "dark";

const nextTheme: Record<ThemePreference, ThemePreference> = {
  system: "light",
  light: "dark",
  dark: "system",
};

function resolveTheme(preference: ThemePreference) {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(preference: ThemePreference) {
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.theme = resolveTheme(preference);
}

function getThemePreference(): ThemePreference {
  return (
    (localStorage.getItem("research-theme") as ThemePreference | null) ??
    "system"
  );
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
  return "system";
}

export function ThemeToggle() {
  const preference = useSyncExternalStore(
    subscribeToThemePreference,
    getThemePreference,
    getServerThemePreference,
  );

  useEffect(() => {
    applyTheme(preference);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      if (preference === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
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
