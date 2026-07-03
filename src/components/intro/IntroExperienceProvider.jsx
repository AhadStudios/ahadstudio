"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const IntroExperienceContext = createContext({
  introComplete: false,
  completeIntro: () => {},
});

export function IntroExperienceProvider({ children }) {
  const [introComplete, setIntroComplete] = useState(false);

  const completeIntro = useCallback(() => {
    setIntroComplete((prev) => {
      if (prev) return prev;

      document.documentElement.classList.remove("is-intro-active");
      console.log("[intro] introComplete state → true");

      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          import("@/lib/gsap")
            .then(({ ScrollTrigger }) => {
              if (typeof ScrollTrigger?.refresh === "function") {
                ScrollTrigger.refresh();
              }
            })
            .catch((error) => {
              console.warn("[intro] ScrollTrigger refresh after intro failed", error);
            });
        }, 120);
      }

      return true;
    });
  }, []);

  useEffect(() => {
    if (introComplete) return undefined;

    const failsafe = window.setTimeout(() => {
      console.warn("[intro] failsafe — releasing intro lock after 15s");
      document.documentElement.classList.remove("is-intro-active");
      setIntroComplete(true);
    }, 15000);

    return () => window.clearTimeout(failsafe);
  }, [introComplete]);

  const value = useMemo(
    () => ({
      introComplete,
      completeIntro,
    }),
    [completeIntro, introComplete],
  );

  return (
    <IntroExperienceContext.Provider value={value}>
      {children}
    </IntroExperienceContext.Provider>
  );
}

export function useIntroExperience() {
  return useContext(IntroExperienceContext);
}
