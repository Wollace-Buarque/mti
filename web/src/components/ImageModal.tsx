import { X } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { ComponentProps } from "react";

interface ImageModalProps extends ComponentProps<"img"> {}

export function ImageModal({ className, ...rest }: ImageModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <img {...rest} className={`cursor-pointer ${className}`} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60">
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] -translate-x-1/2 -translate-y-1/2 sm:w-[80vw]">
            <img
              {...rest}
              className="size-full rounded object-cover shadow-image"
              draggable={false}
            />

            <Dialog.Close title="Fechar imagem">
              <X
                className="absolute right-2 top-2 hover:animate-spin-one-time"
                color="#EBA417"
                size={30}
              />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
