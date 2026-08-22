import Image from "next/image";
import type { EditorialConfig, HomeSectionConfig } from "../../../shared/config";
import type { CarouselImage } from "../../lib/portfolio";
import { EditorialText } from "../../components/EditorialText";
import { PhotoCarousel } from "../../components/PhotoCarousel";
import { homeSectionAttributes } from "./section-attributes";

export function HomePhotoReelSection({
  copy,
  images,
  section,
}: {
  copy: EditorialConfig["home"]["carousel"];
  images: CarouselImage[];
  section: HomeSectionConfig;
}) {
  if (section.type !== "photo-reel") return null;
  const selectedImages = section.photoIds.length
    ? section.photoIds.flatMap((id) => {
        const image = images.find((candidate) => candidate.id === id);
        return image ? [image] : [];
      })
    : images.slice(0, 6);
  return (
    <section
      className="carousel-section"
      aria-labelledby="carousel-title"
      {...homeSectionAttributes(section)}
    >
      <div className="carousel-heading reveal">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="carousel-title">
            <EditorialText text={copy.title} />
          </h2>
        </div>
        <p>{copy.body}</p>
      </div>
      {section.variant === "patch" ? (
        <div className="photo-patch" aria-label="Colagem de fotografias escolhidas">
          {selectedImages.slice(0, 6).map((image, index) => (
            <figure className={`photo-patch-item photo-patch-item-${index + 1}`} key={image.id}>
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 72vw, 32vw" />
              <figcaption>{image.category}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className={section.variant === "filmstrip" ? "photo-filmstrip" : undefined}>
          <PhotoCarousel images={images} hint={copy.hint} />
        </div>
      )}
    </section>
  );
}
