export function Stats() {
  const stats = [
    { value: "85%", label: "Reduction in wait time complaints" },
    { value: "3x", label: "Faster customer throughput" },
    { value: "92%", label: "Customer satisfaction rate" },
    { value: "500+", label: "Businesses using QueueFlow" },
  ]

  return (
    <section className="border-b border-border bg-muted/30 py-16">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-4xl font-bold text-foreground sm:text-5xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
