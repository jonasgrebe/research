// Paper method hues, lightened for legibility on the website's dark background.
export const vetoMethods = [
  { key: "veto", name: "VETO", epsilon: 4, color: "#54bc69" },
  { key: "photoguard", name: "PhotoGuard", epsilon: 12, color: "#adb2ad" },
  { key: "editshield", name: "EditShield", epsilon: 8, color: "#e56c74" },
  { key: "decontext", name: "DeContext", epsilon: 32, color: "#5aa9dc" },
] as const;

export const vetoMethodColors: Record<string, string> = {
  ...Object.fromEntries(vetoMethods.map(method => [method.name, method.color])),
  Unprotected: "#d8e2db",
};
