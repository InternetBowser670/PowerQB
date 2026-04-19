import Topbar from "@/components/ui/topbar"

export default function TopbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen">
      <Topbar />
      <div className="flex min-h-[calc(100svh-64px)] flex-col">{children}</div>
    </div>
  )
}
