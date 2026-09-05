"use client";

import { useState } from "react";
import { Play } from "@phosphor-icons/react";

export default function VideoFacade({ videoId, title }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-[1.75rem] bg-cacau shadow-[0_24px_60px_-24px_rgba(46,31,23,0.45)]">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Assistir: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-[1.75rem] bg-cacau shadow-[0_24px_60px_-24px_rgba(46,31,23,0.45)] transition-transform hover:-translate-y-1 active:scale-[0.99]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        onError={(e) => {
          if (!e.currentTarget.src.includes("hqdefault")) {
            e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          }
        }}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-coral-deep text-white shadow-[0_12px_32px_-8px_rgba(214,67,46,0.7)] transition-transform group-hover:scale-110">
          <Play size={34} weight="fill" className="ml-1" />
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cacau/80 to-transparent px-6 pb-5 pt-12 text-left text-sm font-bold text-white">
        {title}
      </span>
    </button>
  );
}
