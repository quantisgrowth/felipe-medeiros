type SitePhotoKind = "hero" | "about";

const LEGACY_PHOTOS: Record<
  SitePhotoKind,
  { marker: string; large: string; small: string; largeWidth: number; smallWidth: number }
> = {
  hero: {
    marker: "cd013afe-66b5-4f90-8b56-6303c31ddc47.jpg",
    large: "/images/felipe-hero-large.webp",
    small: "/images/felipe-hero-small.webp",
    largeWidth: 960,
    smallWidth: 480,
  },
  about: {
    marker: "78c9bf26-1f87-4767-a4e0-c778868aaf55.jpg",
    large: "/images/felipe-sobre-large.webp",
    small: "/images/felipe-sobre-small.webp",
    largeWidth: 480,
    smallWidth: 256,
  },
};

function getPhotoSources(url: string, kind: SitePhotoKind) {
  const legacy = LEGACY_PHOTOS[kind];
  if (url.includes(legacy.marker)) return legacy;

  if (/-large\.webp(?:\?.*)?$/.test(url)) {
    return {
      large: url,
      small: url.replace(/-large\.webp(?=\?|$)/, "-small.webp"),
      largeWidth: kind === "hero" ? 960 : 480,
      smallWidth: kind === "hero" ? 480 : 256,
    };
  }

  return { large: url };
}

export function SitePhoto({
  url,
  kind,
  alt,
  className,
}: {
  url: string;
  kind: SitePhotoKind;
  alt: string;
  className: string;
}) {
  const sources = getPhotoSources(url, kind);
  const isHero = kind === "hero";

  return (
    <picture>
      {sources.small && sources.largeWidth && sources.smallWidth && (
        <source
          type="image/webp"
          srcSet={`${sources.small} ${sources.smallWidth}w, ${sources.large} ${sources.largeWidth}w`}
          sizes={isHero ? "(max-width: 767px) calc(100vw - 2rem), 44vw" : "12rem"}
        />
      )}
      <img
        src={sources.large}
        alt={alt}
        width={isHero ? 960 : 480}
        height={isHero ? 1200 : 480}
        loading={isHero ? "eager" : "lazy"}
        fetchPriority={isHero ? "low" : "auto"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
