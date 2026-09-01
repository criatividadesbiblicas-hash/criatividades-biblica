"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";

export default function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-sand/50 py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base font-semibold text-cacau md:text-lg">
          {question}
        </span>
        <Plus
          size={20}
          weight="bold"
          className={`shrink-0 text-coral-deep transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] pt-3 opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[65ch] text-sm leading-relaxed text-cacau/75">{answer}</p>
        </div>
      </div>
    </div>
  );
}
