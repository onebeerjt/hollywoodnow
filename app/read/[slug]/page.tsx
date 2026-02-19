import DeepDiveReader from "@/components/reel/deep-dive-reader";
import { seedContent } from "@/lib/reel/seed";
import { slugify } from "@/lib/reel/utils";

export default function ReadPage({ params }: { params: { slug: string } }) {
  const matched = seedContent.deepDiveTopics.find((topic) => slugify(topic) === params.slug);
  const topic = matched ?? params.slug.replace(/-/g, " ");

  return <DeepDiveReader topic={topic} />;
}
