"use client";

import { useEffect, useState } from "react";
import type { Location } from "../lib/data";

type Status = { open: boolean; label: string } | null;

function computeStatus(loc: Location): Status {
  // Get current time in America/New_York regardless of the visitor's timezone.
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const weekdayName = map.weekday; // e.g. "Mon"
  const hour = Number(map.hour);
  const minute = Number(map.minute);
  const current = hour + minute / 60;

  const weekendDays = ["Fri", "Sat"];
  const isWeekend = weekendDays.includes(weekdayName);
  const { open, close } = isWeekend ? loc.hours.weekend : loc.hours.weekday;

  const fmt = (t: number) => {
    const h24 = Math.floor(t);
    const m = Math.round((t - h24) * 60);
    const ampm = h24 >= 12 ? "pm" : "am";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}${m ? ":" + String(m).padStart(2, "0") : ""}${ampm}`;
  };

  if (current >= open && current < close) {
    const closingSoon = close - current <= 1;
    return {
      open: true,
      label: closingSoon ? `Open · closes ${fmt(close)}` : "Open now",
    };
  }
  return { open: false, label: `Closed · opens ${fmt(open)}` };
}

export default function OpenStatus({ loc }: { loc: Location }) {
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    setStatus(computeStatus(loc));
    const id = setInterval(() => setStatus(computeStatus(loc)), 60_000);
    return () => clearInterval(id);
  }, [loc]);

  // Render nothing until mounted to avoid hydration mismatch.
  if (!status) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        status.open
          ? "bg-pizza-green/12 text-pizza-green-dark"
          : "bg-charcoal/8 text-charcoal/60"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          status.open ? "bg-pizza-green animate-pulse" : "bg-charcoal/40"
        }`}
      />
      {status.label}
    </span>
  );
}
