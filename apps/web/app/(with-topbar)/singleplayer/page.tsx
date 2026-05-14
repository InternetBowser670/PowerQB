import Singleplayer from "@/components/ui/pages/singleplayer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Singleplayer",
  description: "Practice quiz bowl like never before.",
};

export default function SingleplayerPage() {
  return <Singleplayer />;
}
