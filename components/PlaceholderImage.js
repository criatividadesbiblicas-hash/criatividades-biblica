import { Camera } from "@phosphor-icons/react/dist/ssr";

export default function PlaceholderImage({ label, aspect = "aspect-[4/3]", className = "" }) {
  return (
    <div
      className={`${aspect} ${className} flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-sand bg-sand-light p-6 text-center`}
    >
      <Camera size={28} weight="light" className="text-sand" />
      <p className="max-w-[22ch] text-sm font-semibold text-cacau/60">{label}</p>
    </div>
  );
}
