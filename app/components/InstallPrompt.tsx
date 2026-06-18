"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import icon from "../../public/icon-192.png";

const DISMISS_KEY = "pe_install_dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    setIsIOS(ios);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // iOS gives no event — show our manual instructions after a beat.
    let t: ReturnType<typeof setTimeout> | undefined;
    if (ios) t = setTimeout(() => setVisible(true), 2500);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      if (t) clearTimeout(t);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-24 z-[55] mx-auto max-w-sm rounded-2xl border border-charcoal/10 bg-white p-4 shadow-lift md:bottom-6 md:left-auto md:right-6 md:mx-0">
      <div className="flex items-start gap-3">
        <Image src={icon} alt="" className="h-12 w-12 shrink-0 rounded-xl" sizes="48px" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-extrabold text-charcoal">
            Get the Pizza Express app
          </p>
          {isIOS ? (
            <p className="mt-0.5 text-xs leading-snug text-charcoal/65">
              Tap{" "}
              <span className="inline-flex items-center font-semibold text-pizza-red">
                Share
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-0.5">
                  <path d="M12 16V4M8 8l4-4 4 4" />
                  <path d="M20 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5" />
                </svg>
              </span>{" "}
              then <span className="font-semibold">Add to Home Screen</span>.
            </p>
          ) : (
            <p className="mt-0.5 text-xs leading-snug text-charcoal/65">
              Install it to your home screen for one-tap ordering.
            </p>
          )}
          {!isIOS && deferred && (
            <button
              onClick={install}
              className="mt-2 rounded-full bg-pizza-red px-4 py-1.5 text-xs font-bold text-white hover:bg-pizza-red-dark"
            >
              Install app
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-charcoal/40 hover:bg-cream-deep"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
