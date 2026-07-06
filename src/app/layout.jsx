import { Cormorant_Garamond, Manrope, Pinyon_Script } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ShowcaseScrollProvider } from "@/context/ShowcaseScrollContext";
import { ShowcaseNavMenuProvider } from "@/context/ShowcaseNavMenuContext";
import NavMenuProvider from "@/components/NavMenuProvider";
import { IntroExperienceProvider } from "@/components/intro/IntroExperienceProvider";
import CinematicIntro from "@/components/intro/CinematicIntro";
import SiteChrome from "@/components/intro/SiteChrome";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: ["400", "500", "600"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "Agency — Building Digital Universes",
  description:
    "We craft web platforms, mobile apps and AI experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} ${pinyonScript.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <SmoothScroll>
          <ShowcaseScrollProvider>
            <ShowcaseNavMenuProvider>
              <NavMenuProvider>
                <IntroExperienceProvider>
                  <CinematicIntro />
                  <SiteChrome />
                  <main className="site-main" suppressHydrationWarning>{children}</main>
                </IntroExperienceProvider>
              </NavMenuProvider>
            </ShowcaseNavMenuProvider>
          </ShowcaseScrollProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
