import { X } from "phosphor-react";

import * as Dialog from "@radix-ui/react-dialog";

interface ImageModalProps {
  src: string | undefined;
  alt?: string;
  title?: string;
  className?: string;
  draggable?: boolean;
}

export default function ImageModal(props: ImageModalProps) {

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <img
          src={props.src}
          alt={props.alt}
          title={props.title}
          className={`cursor-pointer ${props.className}`}
          draggable={props.draggable} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed" >
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-[80vw]">

            <img
              className="size-full object-cover rounded shadow-image"
              src={props.src}
              alt={props.alt}
              title={props.title}
              draggable={false} />

            <Dialog.Close title="Fechar imagem">
              <X
                className="absolute top-2 right-2 hover:animate-spin-one-time"
                color="#EBA417"
                size={30} />
            </Dialog.Close>

          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}