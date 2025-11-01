import NumberFlow from "@number-flow/react"
export default function AnimatedNumberRandom({
  value,
}: {
  value: number
}) {
  return (
    <>
      <span className="flex items-center justify-center gap-2">
        <NumberFlow
          value={value}
          className="text-sm text-chart-3 font-semibold"
          suffix="%"
        />
      </span>
    </>
  )
}
