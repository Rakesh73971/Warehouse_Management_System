export function toast(message, type = "info", opts = {}) {
  window.dispatchEvent(
    new CustomEvent("app:toast", {
      detail: {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        message: String(message || ""),
        type,
        duration: typeof opts.duration === "number" ? opts.duration : 2600,
      },
    })
  );
}

