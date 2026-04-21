import { Card } from "@workspace/ui/components/card";

export default function Page() {
  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <Card className="max-w-2/3">
          <h1>Singleplayer coming soon!</h1>
          <p>
            I expect to complete this within a month.
          </p>
        </Card>
      </div>
    </>
  )
}
