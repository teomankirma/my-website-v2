import { Badge, Image } from "@heroui/react";
import type { CSSProperties } from "react";

type SkillLogoProps = {
  label: string;
  src: string;
  // Custom background color for the badge, e.g. "#61DBFB". If omitted, use default.
  badgeColor?: string;
  imgClassName?: string;
};

export const SkillLogo = ({
  label,
  src,
  badgeColor,
  imgClassName,
}: SkillLogoProps) => {
  const hasCustom = typeof badgeColor === "string" && badgeColor.length > 0;

  const badgeClassName = `text-white px-2 py-1 ${
    hasCustom ? "bg-[var(--badge-bg)]" : "bg-success"
  }`;

  const styleVars:
    | (CSSProperties & { [key: string]: string | undefined })
    | undefined = hasCustom ? { "--badge-bg": badgeColor } : undefined;
  const square = (
    <div
      className="inline-flex items-center justify-center rounded-2xl border-2 border-accent/70 bg-content2"
      style={{ width: 72, height: 72 }}
    >
      <Image
        src={src}
        alt={label}
        className={`object-contain${imgClassName ? ` ${imgClassName}` : ""}`}
        width={56}
        height={56}
      />
    </div>
  );

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <Badge
        content={label}
        placement="top-right"
        shape="rectangle"
        classNames={{ badge: badgeClassName }}
        style={styleVars}
      >
        {square}
      </Badge>
    </div>
  );
};
