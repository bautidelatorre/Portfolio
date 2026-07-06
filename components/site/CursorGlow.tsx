"use client";

import { useEffect, useRef } from "react";

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function CursorGlow({ color }: { color: string }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onMouseMove(e: MouseEvent) {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible.current && dotRef.current) {
        current.current = { ...target.current };
        dotRef.current.style.opacity = "1";
        visible.current = true;
      }
    }

    function onMouseLeave() {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      visible.current = false;
    }

    let raf: number;
    function tick() {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const safeColor = HEX_COLOR_RE.test(color) ? color : "#ff6044";

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 h-[380px] w-[380px] rounded-full opacity-0 blur-[90px] transition-opacity duration-500"
      style={{
        background: `radial-gradient(circle, ${safeColor}55 0%, ${safeColor}00 70%)`,
      }}
    />
  );
}
