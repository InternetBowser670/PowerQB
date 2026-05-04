import { ComposedChart, Area, Scatter, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
} from "@workspace/ui/components/chart"
import { type ChartConfig } from "@workspace/ui/components/chart"
import { useMemo, useState, useEffect, useRef } from "react"
import { animate, useInView } from "framer-motion"

const chartConfig = {
  retention: {
    label: "retention",
    color: "#2563eb",
  },
  var: {
    label: "var",
    color: "#60a5fa",
  },
} satisfies ChartConfig

// Ebbinghaus function + variation

function e(t: number, S: number) {
  return Math.E ** (-t / S)
}

function eV(t: number, S: number, vars: number[]) {
  if (t < 0 || t > 5) return e(t, S) + 0.001
  return Math.abs(e(t, S) + vars[t]!)
}

export default function EbbinghausChart() {
  const [S, setS] = useState(1.5)
  const containerRef = useRef(null)

  const containerInView = useInView(containerRef, { once: true, amount: 0.5 })

  const vars = useMemo(() => {
    const result = []
    for (let i = 0; i <= 5; i++) {
      // eslint-disable-next-line react-hooks/purity
      result.push(Math.random() * 0.2 - 0.1)
    }
    return result
  }, [])

  useEffect(() => {
    if (!containerInView) return

    const controls = animate(1.5, 5, {
      duration: 2,
      ease: "easeInOut",
      delay: 0.5,
      onUpdate: (latest) => setS(latest),
    })
    return () => controls.stop()
  }, [containerInView])

  const chartData = [
    { time: "0", retention: e(0, S), var: eV(0, S, vars) },
    { time: "1", retention: e(1, S), var: eV(1, S, vars) },
    { time: "2", retention: e(2, S), var: eV(2, S, vars) },
    { time: "3", retention: e(3, S), var: eV(3, S, vars) },
    { time: "4", retention: e(4, S), var: eV(4, S, vars) },
    { time: "5", retention: e(5, S), var: eV(5, S, vars) },
    { time: "6", retention: e(6, S), var: eV(6, S, vars) },
  ]

  return (
    <ChartContainer ref={containerRef} className="h-full" config={chartConfig}>
      <ComposedChart
        margin={{
          left: 12,
          right: 12,
        }}
        data={chartData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickLine={true}
          tickMargin={10}
          axisLine={false}
        />
        <Area
          dataKey="retention"
          type="linear"
          fill="url(#fillRetention)"
          fillOpacity={0.4}
          stroke="var(--color-retention)"
          stackId="a"
          isAnimationActive={false}
        />
        <Scatter
          dataKey="var"
          fill="var(--color-var)"
          isAnimationActive={false}
        />
        <defs>
          <linearGradient id="fillRetention" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-retention)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-retention)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
      </ComposedChart>
    </ChartContainer>
  )
}
