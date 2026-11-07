import {researchSite} from "./paper-metadata";
import { ProjectOverview } from "./project-overview";

export const metadata = {alternates: {canonical: researchSite}};

export default function Home() {
  return <ProjectOverview />;
}
