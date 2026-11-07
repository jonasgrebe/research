import { useEffect, useState, type RefObject } from "react";

export function useActiveSection(root: RefObject<HTMLElement | null>, sections: readonly (readonly [string, string])[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const targets = sections.map(([, id]) => page.querySelector<HTMLElement>(`#${id}`)).filter((target) => target !== null).reverse();
    const nav = page.querySelector<HTMLElement>("header nav");
    let previous: string | null = null;
    let frame: number | null = null;

    function update() {
      frame = null;
      const readingLine = Math.max(112, window.innerHeight * 0.25);
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const target = atBottom ? targets[0] : targets.find(element => element.getBoundingClientRect().top <= readingLine);
      const id = target?.id ?? "";
      if (id === previous) return;
      previous = id;
      setActive(id);

      const link = id && nav?.querySelector<HTMLElement>(`a[href="#${id}"]`);
      if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
      const item = link.getBoundingClientRect();
      const strip = nav.getBoundingClientRect();
      if (item.left < strip.left) nav.scrollLeft += item.left - strip.left;
      else if (item.right > strip.right) nav.scrollLeft += item.right - strip.right;
    }

    function schedule() {
      if (frame === null) frame = window.requestAnimationFrame(update);
    }
    const resize = new ResizeObserver(schedule);
    resize.observe(page);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [root, sections]);
  return active;
}
