import Image from "next/image";
import type { PublicAlbum } from "../../shared/public-content";
import styles from "./MirandaGallery.module.css";

type GalleryImage = PublicAlbum["images"][number];

export function MirandaGallery({ images }: { images: GalleryImage[] }) {
  const gateImages = images.slice(0, 12);

  return (
    <div className={styles.sequence} aria-label="Sequência fotográfica do ensaio">
      {gateImages.map((image, index) => (
        <figure className={styles.item} key={image.id}>
          <Image
            src={image.url}
            alt={image.altText ?? ""}
            width={image.width ?? 1600}
            height={image.height ?? 1200}
            unoptimized
            sizes="(max-width: 599px) 100vw, (max-width: 899px) 80vw, 68vw"
            loading={index === 0 ? "eager" : "lazy"}
          />
          <figcaption>
            {(index + 1).toString().padStart(2, "0")}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
