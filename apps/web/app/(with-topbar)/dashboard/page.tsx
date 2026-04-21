import { Card } from "@workspace/ui/components/card"

export const metadata = {
  title: "Dashboard"
}

export default function Page() {
  return (
    <div className="flex grow items-center justify-center">
      <Card className="max-w-2/3">
        <h1>This is your dashboard!</h1>
        <p>
          Soon you will be able to join rooms and view stats from here. For now,
          hang tight.
        </p>
      </Card>
    </div>
  )
}
