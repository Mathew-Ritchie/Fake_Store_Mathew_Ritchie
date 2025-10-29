import { useEffect } from "react";

export default function useWakeServer() {
  useEffect(() => {
    const wakeUp = async () => {
      try {
        await fetch(import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, ""), {
          method: "GET",
          mode: "no-cors",
        });
        console.log("🌞 Backend wake-up ping sent");
      } catch (err) {
        console.error("Wake-up ping failed:", err);
      }
    };

    wakeUp();
  }, []);
}
