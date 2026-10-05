"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

export function CopyEmail() {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setMessage("Email copied!");
    } catch {
      setMessage("Select the email address above to copy it.");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 4000);
  }
  return (
    <div className="copy-email">
      <button className="text-button" type="button" onClick={copy}>
        Copy email address
      </button>
      <output>{message}</output>
    </div>
  );
}
