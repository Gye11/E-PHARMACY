interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/** Responsive image with 2x srcSet for retina displays. */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
}: OptimizedImageProps) {
  const srcSet = `${src} 1x, ${src.replace(/w=\d+/, `w=${width * 2}`)} 2x`;

  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
    />
  );
}
