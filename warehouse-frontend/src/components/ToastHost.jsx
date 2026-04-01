import { useEffect, useState } from "react";

export default function ToastHost() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      const t = e?.detail;
      if (!t?.message) return;

      setItems((prev) => [...prev, t]);

      const ms = Math.max(800, Number(t.duration || 0));
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== t.id));
      }, ms);
    };

    window.addEventListener("app:toast", onToast);
    return () => window.removeEventListener("app:toast", onToast);
  }, []);

  if (!items.length) return null;

  return (
    <div className="toast-host" aria-live="polite" aria-relevant="additions">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.type || "info"}`} role="status">
          {t.message}
        </div>
      ))}
    </div>
  );
}

