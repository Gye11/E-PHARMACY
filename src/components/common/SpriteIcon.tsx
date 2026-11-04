interface SpriteIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function SpriteIcon({ name, size = 24, className }: SpriteIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      <use href={`/icons/sprite.svg#icon-${name}`} />
    </svg>
  );
}
