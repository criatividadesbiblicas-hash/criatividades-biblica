"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "https://www.criatividadesbiblicas.com.br/plano-anual", label: "Plano Anual" },
  { href: "https://www.criatividadesbiblicas.com.br/materiais", label: "Outros materiais" },
];

const DEFAULT_CTA = { label: "Quero meu ano pronto", href: "https://www.criatividadesbiblicas.com.br/plano-anual" };

export default function Nav({ cta = DEFAULT_CTA }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-sand/40 bg-ivory/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center" aria-label="Criatividades Bíblicas, início">
          <Image
            src="/marca/logo-horizontal.png"
            alt="Criatividades Bíblicas"
            width={600}
            height={315}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-cacau/80 transition-colors hover:text-coral-deep"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={cta.href}
            className="rounded-full bg-coral-deep px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {cta.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-cacau md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-sand/40 bg-ivory px-4 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-semibold text-cacau/80 hover:bg-sand-light"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-coral-deep px-5 py-3 text-center text-base font-bold text-white"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
