import { useEffect, useState } from "react";

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [paletteKey, setPaletteKey] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setLoaded(true);
        setOpen((v) => {
          if (!v) setPaletteKey((k) => k + 1);
          return !v;
        });
      }
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const openPalette = () => {
    setLoaded(true);
    setPaletteKey((k) => k + 1);
    setOpen(true);
  };

  return {
    open,
    setOpen,
    shortcutsOpen,
    setShortcutsOpen,
    loaded,
    paletteKey,
    openPalette,
  };
}
