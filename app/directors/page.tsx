import DirectorArchive from "@/components/reel/director-archive";
import { seedContent } from "@/lib/reel/seed";

export default function DirectorsPage() {
  return <DirectorArchive directors={seedContent.directors} />;
}
