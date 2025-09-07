import { Badge, Image } from "@heroui/react";

type SkillLogoProps = {
  label: string;
  src: string;
  alt?: string;
  badge?: string; // e.g., "core", "new"
  size?: number; // square size in px
};

export const SkillLogo = ({ label, src, alt, badge, size = 72 }: SkillLogoProps) => {
  const square = (
    <div
      className="inline-flex items-center justify-center rounded-2xl border-2 border-accent/70 bg-content2"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt ?? label} className="object-contain" width={size - 16} height={size - 16} />
    </div>
  );

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <Badge isInvisible={!badge} content={badge} color="success" placement="top-right" shape="rectangle">
        {square}
      </Badge>
      <span className="text-sm opacity-90">{label}</span>
    </div>
  );
};
