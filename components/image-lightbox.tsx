"use client"

import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ImageLightboxProps {
  images: Array<{
    src: string
    alt?: string
    title?: string
  }>
  open: boolean
  index: number
  onClose: () => void
}

export function ImageLightbox({ images, open, index, onClose }: ImageLightboxProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async (imageUrl: string, imageName?: string) => {
    try {
      setDownloading(true)

      // Fetch the image
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      // Create a temporary URL for the blob
      const blobUrl = URL.createObjectURL(blob)

      // Create a temporary anchor element and trigger download
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = imageName || `image-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl)

      toast.success("Image downloaded successfully")
    } catch (error) {
      console.error("Error downloading image:", error)
      toast.error("Failed to download image")
    } finally {
      setDownloading(false)
    }
  }

  // Transform images to lightbox format
  const slides = images.map((img) => ({
    src: img.src,
    alt: img.alt || "",
    title: img.title || "",
  }))

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      controller={{ closeOnBackdropClick: true }}
      carousel={{
        finite: false,
        preload: 2,
      }}
      render={{
        buttonPrev: slides.length <= 1 ? () => null : undefined,
        buttonNext: slides.length <= 1 ? () => null : undefined,
      }}
      on={{
        view: ({ index: currentIndex }) => {
          // Optional: Track which image is being viewed
          console.log("Viewing image:", currentIndex)
        },
      }}
      toolbar={{
        buttons: [
          <Button
            key="download"
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => {
              const currentImage = images[index]
              if (currentImage) {
                handleDownload(
                  currentImage.src,
                  currentImage.title || currentImage.alt
                )
              }
            }}
            disabled={downloading}
          >
            <Download className="w-5 h-5" />
          </Button>,
          "close",
        ],
      }}
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
      }}
      animation={{
        fade: 250,
        swipe: 250,
      }}
    />
  )
}
