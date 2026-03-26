import { forwardRef, useMemo, useState } from "react";

function uid() {
  return Math.random().toString(16).slice(2);
}

const RippleButton = forwardRef(function RippleButton(
  { children, className = "", onClick, type = "button", disabled },
  ref,
) {
  const [ripples, setRipples] = useState([]);

  const wrappedOnClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = uid();

    setRipples((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 720);
  };

  const rippleEls = useMemo(
    () =>
      ripples.map((r) => (
        <span
          key={r.id}
          className="ripple"
          style={{ left: r.x, top: r.y }}
        />
      )),
    [ripples],
  );

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={wrappedOnClick}
      ref={ref}
      className={`ripple-btn relative overflow-hidden ${className}`}
    >
      {rippleEls}
      <span className="relative z-10">{children}</span>
    </button>
  );
});

export default RippleButton;

