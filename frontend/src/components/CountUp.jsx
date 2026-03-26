import { useEffect, useMemo, useRef, useState } from "react";

export default function CountUp({
  target,
  duration = 900,
  decimals = 0,
  suffix = "",
  prefix = "",
  className = "",
}) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const fromRef = useRef(0);
  const prevTarget = useRef(target);

  const formatValue = useMemo(() => {
    const fmt = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return (v) => fmt.format(v);
  }, [decimals]);

  useEffect(() => {
    const start = performance.now();
    startRef.current = start;
    fromRef.current = value;

    const animate = (now) => {
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / duration);
      // Smooth-ish curve.
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (target - fromRef.current) * eased;
      setValue(next);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };

    if (prevTarget.current !== target) {
      prevTarget.current = target;
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return <span className={className}>{prefix}{formatValue(value)}{suffix}</span>;
}

