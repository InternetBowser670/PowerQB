import Link from "next/link";

import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export const metadata = {
  title: "Dashboard",
};

export default function Page() {
  return (
    <div className="flex grow items-center justify-center">
      <Card className="max-w-2/3">
        <h1>Select a gamemode</h1>
        <div className="flex w-full justify-around">
          <Button asChild>
            <Link href="/singleplayer">Singleplayer</Link>
          </Button>
          <Button asChild className="pointer-events-none grayscale">
            <Link href="/multiplayer">Multiplayer (coming soon)</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
