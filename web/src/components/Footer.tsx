import { Phone } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="flex h-16 items-center justify-center border-t border-line">
      <address>
        <a
          className="group flex items-center gap-2 not-italic text-gray-300 transition-colors hover:text-gray-200"
          href="tel:+558190000-0000"
          title="Clique para fazer uma ligação"
        >
          <Phone
            className="opacity-0 transition-opacity group-hover:opacity-100"
            color="#EBA417"
          />
          Suporte: (81) 90000-0000
        </a>
      </address>
    </footer>
  );
}
