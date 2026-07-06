"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/helpers";
import {
  WORLD_CLOCK_CITIES,
  formatCityTime,
} from "@/data/worldClockCities";

const ROTATE_MS = 3000;

export default function WorldClockWidget({ active = false, compact = false }) {
  const lineRef = useRef(null);
  const [cityIndex, setCityIndex] = useState(0);
  // Start empty so SSR and initial client HTML match; useEffect fills in the real time
  const [timeLabel, setTimeLabel] = useState("");

  const city = WORLD_CLOCK_CITIES[cityIndex];

  // Populate time on client only — avoids server/client mismatch
  useEffect(() => {
    setTimeLabel(formatCityTime(city.timeZone));
  }, [city.timeZone]);

  useEffect(() => {
    if (!active) return undefined;

    const tick = () => {
      setTimeLabel(formatCityTime(city.timeZone));
    };

    tick();
    const minuteTimer = window.setInterval(tick, 30_000);

    return () => window.clearInterval(minuteTimer);
  }, [active, city.timeZone]);

  useEffect(() => {
    if (!active || !lineRef.current) return undefined;

    const line = lineRef.current;
    gsap.set(line, { autoAlpha: 1, y: 0, filter: "blur(0px)" });

    const rotate = () => {
      gsap.to(line, {
        autoAlpha: 0,
        y: -10,
        filter: "blur(6px)",
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setCityIndex((prev) => {
            const next = (prev + 1) % WORLD_CLOCK_CITIES.length;
            setTimeLabel(formatCityTime(WORLD_CLOCK_CITIES[next].timeZone));
            return next;
          });
          gsap.fromTo(
            line,
            { autoAlpha: 0, y: 10, filter: "blur(6px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.45,
              ease: "power3.out",
            },
          );
        },
      });
    };

    const rotateTimer = window.setInterval(rotate, ROTATE_MS);

    return () => {
      window.clearInterval(rotateTimer);
      gsap.killTweensOf(line);
    };
  }, [active]);

  return (
    <div className={`world-clock${compact ? " world-clock--compact" : ""}`} aria-live="polite">
      <div className="world-clock-line" ref={lineRef}>
        <span className="world-clock-city">
          <span className="world-clock-flag" aria-hidden="true">
            {city.flag}
          </span>
          <span className="world-clock-name">{city.name}</span>
        </span>
        <span className="world-clock-time">{timeLabel}</span>
      </div>
    </div>
  );
}
