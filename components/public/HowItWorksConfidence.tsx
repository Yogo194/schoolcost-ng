const LEVELS = [
  {
    label: "High",
    description:
      "An official source, recently reviewed, with a clear academic session and a complete fee breakdown.",
    filled: 3,
    color: "bg-[#166d3e]",
    faded: "bg-[#166d3e]/40",
  },
  {
    label: "Medium",
    description:
      "Reliable student evidence, or several submissions that agree, but some items may still be incomplete.",
    filled: 2,
    color: "bg-[#f4982f]",
    faded: "bg-[#f4982f]/40",
  },
  {
    label: "Low",
    description:
      "A single unverified submission, no official source, or an unclear academic session.",
    filled: 2,
    color: "bg-[#fe5f2b]",
    faded: "bg-[#fe5f2b]/40",
  },
] as const;

export function HowItWorksConfidence() {
  return (
    <section className="bg-white px-4 py-16 sm:px-10 sm:py-[100px] lg:px-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-[1.75rem] font-medium leading-[1.2] tracking-[-0.04em] text-brand-ink/80 sm:text-[38px]">
            Confidence is a separate signal
          </h2>
          <p className="max-w-[900px] text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
            Source tells you who a figure came from. Confidence tells you how
            complete and current it is. The two work together.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LEVELS.map((level) => (
            <div
              key={level.label}
              className="flex flex-col gap-3 rounded-xl bg-[#f2f5f7] p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-medium tracking-[-0.02em] text-[#002c15] sm:text-xl">
                  {level.label}
                </h3>
                <span className="flex items-center gap-[3px]" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`h-[7px] w-[26px] rounded-full ${
                        i < level.filled ? level.color : level.faded
                      }`}
                    />
                  ))}
                </span>
              </div>
              <p className="text-base leading-6 tracking-[-0.02em] text-[#454745]">
                {level.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
