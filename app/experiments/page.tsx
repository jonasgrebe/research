import type { Metadata } from "next";
import {researchSite} from "@/app/paper-metadata";
import { ProjectOverview } from "@/app/project-overview";

export const metadata: Metadata = {
  alternates: {canonical: researchSite},
  robots: {index: false, follow: true},
};

export default function Page() {
  return <ProjectOverview/>;
}
