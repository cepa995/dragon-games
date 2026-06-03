import { Stagger, StaggerItem } from '@/components/motion/reveal';
import { SmartImage } from '@/components/ui/smart-image';

// Real club photography drops into public/images/about/ (overwrite these
// placeholders); SmartImage degrades to a branded gradient until then.
const PHOTOS = [
  { src: '/images/about/club-1.jpg', cls: 'col-span-2 aspect-[16/9]' },
  { src: '/images/about/club-2.jpg', cls: 'aspect-[4/5] sm:aspect-square' },
  { src: '/images/about/club-3.jpg', cls: 'aspect-[4/5] sm:aspect-square' },
];

/** Editorial photo collage of the club interior / events (SRS FR-2.3). */
export function AboutGallery({ alt }: { alt: string }) {
  return (
    <Stagger className="grid grid-cols-2 gap-4">
      {PHOTOS.map((p) => (
        <StaggerItem key={p.src} className={p.cls}>
          <div className="group rounded-hero border-border bg-muted relative h-full overflow-hidden border">
            <SmartImage
              src={p.src}
              alt={alt}
              sizes="(max-width: 768px) 100vw, 40vw"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
