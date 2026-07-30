"use client";

import { useEffect } from "react";

export function AmbientField() {
  useEffect(() => {
    const root = document.documentElement;
    let animationFrame = 0;

    const updateField = (clientX: number, clientY: number) => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const x = Math.min(Math.max(clientX / window.innerWidth, 0), 1);
        const y = Math.min(Math.max(clientY / window.innerHeight, 0), 1);

        root.style.setProperty("--field-x", `${x * 100}%`);
        root.style.setProperty("--field-y", `${y * 100}%`);
        const dx = x - 0.5;
        const dy = y - 0.5;

        root.style.setProperty("--field-shift-x", `${dx * 24}px`);
        root.style.setProperty("--field-shift-y", `${dy * 24}px`);
        root.style.setProperty("--field-shift-x-neg", `${dx * -18}px`);
        root.style.setProperty("--field-shift-y-neg", `${dy * -18}px`);
        root.style.setProperty("--field-card-x", `${dx * 16}px`);
        root.style.setProperty("--field-card-y", `${dy * 16}px`);
        root.style.setProperty("--field-card-x-neg", `${dx * -12}px`);
        root.style.setProperty("--field-card-y-neg", `${dy * -12}px`);
        root.style.setProperty("--field-active", "1");
      });
    };

    const handlePointer = (event: PointerEvent) => {
      updateField(event.clientX, event.clientY);
    };

    const settleField = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        root.style.setProperty("--field-active", "0.55");
      }
    };

    const resetField = () => {
      root.style.setProperty("--field-active", "0.35");
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerdown", handlePointer, { passive: true });
    window.addEventListener("pointerup", settleField, { passive: true });
    window.addEventListener("blur", resetField);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("pointerup", settleField);
      window.removeEventListener("blur", resetField);
    };
  }, []);

  return (
    <div className="ambient-field" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
