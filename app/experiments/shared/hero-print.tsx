import type { ReactNode } from "react";
import "./hero-print.css";

/** Frames the large editorial illustrations without the index card or its metadata. */
export function HeroPrint({ children, viewBox }: {children: ReactNode; viewBox: string}) {
  return <svg className="rx-sculpture hero-print" viewBox={viewBox} aria-hidden="true">{children}</svg>;
}
