import { Scissors, X } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

import { Button } from "../Button";
import getCroppedImg from "./crop-image";

interface CropImageProps {
  image: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onCropComplete: (image: any) => any;
  handleCancel: () => void;
}

export function CropImageModal({
  image,
  open,
  setOpen,
  onCropComplete,
  handleCancel,
}: CropImageProps) {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  async function handleOnCropComplete(_: Area, croppedAreaPixels: Area) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  async function handleOnCropFinish() {
    setOpen(false);

    const croppedImage = await getCroppedImg(image, croppedAreaPixels);

    onCropComplete(croppedImage);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60">
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#181818] px-4 py-8 text-white shadow-lg shadow-black/25 sm:w-[650px]">
            <Dialog.Title className="mb-6 flex items-center justify-center gap-2 text-center font-inter text-3xl font-black">
              Recortar imagem <Scissors weight="bold" />
            </Dialog.Title>

            <Dialog.Description className="relative flex h-96 w-full items-center justify-center">
              <Cropper
                image={image}
                cropShape="round"
                cropSize={{ width: 160, height: 160 }}
                showGrid={false}
                aspect={16 / 9}
                zoom={zoom}
                zoomSpeed={0.2}
                crop={crop}
                onCropChange={setCrop}
                onCropComplete={handleOnCropComplete}
                onZoomChange={setZoom}
                restrictPosition
              />
              <div
                className="-z-10 h-96 w-full bg-cover bg-center bg-no-repeat blur-2xl"
                style={{ backgroundImage: `url(${image})` }}
              />
            </Dialog.Description>

            <Button onClick={handleOnCropFinish} title="Recortar" />

            <Dialog.Close title="Cancelar" onClick={handleCancel}>
              <span className="sr-only">Cancelar</span>
              <X
                className="absolute right-4 top-4 hover:animate-spin-one-time"
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
