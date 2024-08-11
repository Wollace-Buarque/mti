import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

import Button from "../Button";
import getCroppedImg from "./crop-image";
import { Scissors } from "@phosphor-icons/react";

interface CropImageProps {
  image: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onCropComplete: (image: any) => any;
}

export function CropImageModal(props: CropImageProps) {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = async (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onCropFinish = async () => {
    props.setOpen(false);

    const croppedImage = await getCroppedImg(props.image, croppedAreaPixels);

    props.onCropComplete(croppedImage);
  };

  return (
    <Dialog.Root open={props.open} onOpenChange={props.setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed">
          <Dialog.Content
            className="bg-[#181818] fixed py-8 px-4 text-white top-1/2 left-1/2 -translate-x-1/2 
    -translate-y-1/2 rounded-lg w-[95%] sm:w-[650px] shadow-lg shadow-black/25"
          >
            <Dialog.Title className="text-3xl text-center font-inter font-black mb-6 flex items-center justify-center gap-2">
              Recortar imagem <Scissors weight="bold"/>
            </Dialog.Title>

            <Dialog.Description
              className="relative w-full h-96 flex justify-center items-center"
            >
              <Cropper
                image={props.image}
                cropShape="round"
                cropSize={{ width: 160, height: 160 }}
                showGrid={false}
                aspect={16 / 9}
                zoom={zoom}
                zoomSpeed={0.2}
                crop={crop}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                restrictPosition
              />
              <div
                className="w-full h-96 bg-center bg-no-repeat bg-cover blur-2xl -z-10"
                style={{ backgroundImage: `url(${props.image})` }}
              />
            </Dialog.Description>

            <Button onClick={onCropFinish} title="Recortar" />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
