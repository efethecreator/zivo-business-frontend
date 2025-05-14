"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Cropper from "react-easy-crop"
import { useState, useCallback } from "react"
import getCroppedImg from "@/lib/cropImage"

interface CropImageDialogProps {
  imageFile: File
  onClose: () => void
  onCropComplete: (croppedBlob: Blob) => void
}

export default function CropImageDialog({ imageFile, onClose, onCropComplete }: CropImageDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropCompleteInternal = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleConfirm = async () => {
    const croppedBlob = await getCroppedImg(URL.createObjectURL(imageFile), croppedAreaPixels)
    onCropComplete(croppedBlob)
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] w-full rounded-lg p-0 overflow-hidden bg-white">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-lg font-medium">Görseli Kırp</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-neutral-200">
          <Cropper
            image={URL.createObjectURL(imageFile)}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
            cropShape="rect"
            showGrid={false}
          />
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t bg-white">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button onClick={handleConfirm}>Kırp ve Kaydet</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
