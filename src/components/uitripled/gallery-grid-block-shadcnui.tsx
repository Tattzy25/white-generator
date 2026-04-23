"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid, X, ZoomIn } from "lucide-react";
import { KeyboardEvent, useState } from "react";

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500",
    title: "Abstract Architecture",
    category: "Architecture",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=500",
    title: "Modern Design",
    category: "Design",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500",
    title: "Urban Landscape",
    category: "Nature",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500",
    title: "Digital Art",
    category: "Art",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=500",
    title: "Creative Space",
    category: "Architecture",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500",
    title: "Minimalist View",
    category: "Design",
  },
];

export function GalleryGridBlock() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = [
    "All",
    ...new Set(galleryImages.map((img) => img.category)),
  ];

  const filteredImages =
    filter === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  const handleNext = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex(
        (img) => img.id === selectedImage
      );
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex].id);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex(
        (img) => img.id === selectedImage
      );
      const prevIndex =
        (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex].id);
    }
  };

  const selectedImageData = galleryImages.find(
    (img) => img.id === selectedImage
  );

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    imageId: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedImage(imageId);
    }
  };

  return (
    <section className="w-full bg-background px-4 pb-16 pt-0">
      <div className="mx-auto max-w-7xl">
        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Gallery items"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                role="listitem"
              >
                <Card
                  className="group relative cursor-pointer overflow-hidden border-none transition-all hover:shadow-2xl rounded-[40px] aspect-square"
                  onClick={() => setSelectedImage(image.id)}
                  onKeyDown={(event) => handleCardKeyDown(event, image.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${image.title}`}
                >
                  <div className="absolute inset-0 w-full h-full m-0 p-0">
                    <motion.img
                      src={image.url}
                      alt={image.title}
                      className="absolute inset-0 w-full h-full object-cover m-0 p-0"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm m-0 p-0"
                      aria-hidden="true"
                    >
                      <ZoomIn className="mb-2 h-8 w-8 text-[var(--muted-foreground)]" />
                      <h3 className="mb-1 text-center text-lg font-semibold text-[var(--muted-foreground)]">
                        {image.title}
                      </h3>
                      <Badge variant="secondary">{image.category}</Badge>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && selectedImageData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              style={{ perspective: "2000px" }}
              onClick={() => setSelectedImage(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-dialog-title"
              aria-describedby="gallery-dialog-description"
            >
              {/* Navigation Buttons */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-[var(--muted-foreground)] hover:bg-white/10 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="View previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-[var(--muted-foreground)] hover:bg-white/10 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="View next image"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Close Button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-8 top-8 z-50 text-[var(--muted-foreground)] hover:bg-white/10 hover:text-white"
                onClick={() => setSelectedImage(null)}
                aria-label="Close gallery dialog"
              >
                <X className="h-8 w-8" />
              </Button>

              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateY: 0 }}
                animate={{ scale: 1, opacity: 1, rotateY: 180 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: 0 }}
                transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl aspect-square md:aspect-video"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front of card (Image) */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={selectedImageData.url}
                    alt={selectedImageData.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Image Info Overlay on Front before it flips completely */}
                  <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-3xl font-bold text-white mb-2">{selectedImageData.title}</h3>
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">{selectedImageData.category}</Badge>
                  </div>
                </div>

                {/* Back of card (White Empty Canvas) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-8"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="w-full h-full border-4 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
                     {/* Decorative corner markers */}
                     <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gray-300"></div>
                     <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gray-300"></div>
                     <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-gray-300"></div>
                     <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gray-300"></div>
                     
                     <h3 className="text-4xl font-black uppercase tracking-[0.2em] text-gray-200 mb-6 text-center">
                       {selectedImageData.title}
                     </h3>
                     <div className="w-16 h-1 bg-gray-200 mb-10 rounded-full"></div>
                     
                     <div className="bg-gray-50 px-8 py-4 rounded-full border border-gray-100 shadow-sm animate-pulse">
                       <p className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400 text-center flex items-center gap-3">
                         <Grid className="w-4 h-4" />
                         Empty Canvas Ready
                       </p>
                     </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
