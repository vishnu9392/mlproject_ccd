export default function FloatingInput({
  label,
  icon,
  name,
  value,
  onChange,
  inputMode = "decimal",
  min,
  max,
  step = "1",
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400/90 dark:text-slate-500">
        {icon}
      </div>
      <input
        name={name}
        inputMode={inputMode}
        placeholder=" "
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-10 pb-2.5 pt-6 text-sm leading-5 text-slate-100 placeholder:text-transparent outline-none
                   transition-all duration-300
                   focus:border-brandPrimary/60 focus:ring-2 focus:ring-brandPrimary/25 focus:shadow-[0_0_0_6px_rgba(83,155,119,0.14)] focus:bg-white/10
                   dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/10"
      />
      <label
        className="pointer-events-none absolute left-10 top-2 inline-flex origin-left items-center rounded-md px-1.5
                   bg-white/35 text-xs font-medium text-brandPrimary
                   backdrop-blur-md
                   transition-all duration-300
                   peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-slate-400
                   peer-focus:top-2 peer-focus:translate-y-0 peer-focus:scale-90 peer-focus:bg-white/35 peer-focus:px-1.5 peer-focus:font-medium peer-focus:text-brandPrimary
                   peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:bg-white/35 peer-not-placeholder-shown:px-1.5 peer-not-placeholder-shown:font-medium peer-not-placeholder-shown:text-brandPrimary
                   dark:bg-slate-950/45 dark:peer-focus:bg-slate-950/45 dark:peer-not-placeholder-shown:bg-slate-950/45"
      >
        {label}
      </label>
    </div>
  );
}

