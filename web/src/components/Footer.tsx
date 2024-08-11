import { Phone } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="h-16 border-t border-line flex items-center justify-center">
      <address>
        <a
          className="flex items-center gap-2 not-italic text-gray-300 hover:text-gray-200 transition-colors group"
          href="tel:+558190000-0000"
          title="Clique para fazer uma ligação"
        >
          <Phone
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            color="#EBA417"
          />
          Suporte: (81) 90000-0000
        </a>
      </address>
    </footer>
  );
}
