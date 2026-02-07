import { onMounted, onBeforeUnmount, h } from "vue";

const GIS_SRC = "https://accounts.google.com/gsi/client";

let scriptPromise = null;

function loadGoogleScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google GIS script")), {
        once: true
      });
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load Google GIS script"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export default {
  name: "GoogleOneTap",
  props: {
    clientId: { type: String, required: true },
    authUrl: { type: String, required: true },

    // optional
    headers: { type: Object, default: () => ({ "Content-Type": "application/json" }) },
    autoSelect: { type: Boolean, default: true },
    cancelOnTapOutside: { type: Boolean, default: false },
    credentials: { type: String, default: "include" }, // "include" if using cookies/sessions

    // callbacks
    onSignedIn: { type: Function, default: null },
    onError: { type: Function, default: null },
    onMoment: { type: Function, default: null }
  },

  setup(props) {
    let removed = false;

    const safeError = (e) => {
      const err = e instanceof Error ? e : new Error(String(e));
      props.onError?.(err);
      // also log for dev
      console.error(err);
    };

    onMounted(async () => {
      try {
        if (!props.clientId || !props.authUrl) {
          throw new Error("GoogleOneTap: clientId and authUrl are required");
        }

        await loadGoogleScript();
        if (removed) return;

        const g = window.google?.accounts?.id;
        if (!g) throw new Error("GoogleOneTap: window.google.accounts.id not available");

        g.initialize({
          client_id: props.clientId,
          callback: async (response) => {
            try {
              const idToken = response?.credential;
              if (!idToken) throw new Error("GoogleOneTap: missing credential");

              const res = await fetch(props.authUrl, {
                method: "POST",
                headers: props.headers,
                body: JSON.stringify({ credential: idToken }),
                credentials: props.credentials
              });

              const data = await res.json();
              props.onSignedIn?.(data);
            } catch (e) {
              safeError(e);
            }
          },
          auto_select: props.autoSelect,
          cancel_on_tap_outside: props.cancelOnTapOutside
        });

        g.prompt((notification) => {
          props.onMoment?.(notification);
        });
      } catch (e) {
        safeError(e);
      }
    });

    onBeforeUnmount(() => {
      removed = true;
      // Optional: window.google?.accounts?.id?.cancel();
    });

    // Renders nothing (Google renders the UI)
    return () => h("span", { style: "display:none" });
  }
};
