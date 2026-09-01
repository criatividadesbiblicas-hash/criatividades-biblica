import Image from "next/image";

const AVATAR_COLORS = ["bg-coral", "bg-mustard", "bg-olive", "bg-dusk"];

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function TestimonialCard({ name, role, quote, photo, index = 0 }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <figure className="flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-[0_2px_16px_-4px_rgba(46,31,23,0.12)]">
      <blockquote className="text-[15px] leading-relaxed text-cacau/85">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color} text-sm font-bold text-white`}
          >
            {initials(name)}
          </span>
        )}
        <span>
          <span className="block text-sm font-bold text-cacau">{name}</span>
          <span className="block text-xs text-cacau/60">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
