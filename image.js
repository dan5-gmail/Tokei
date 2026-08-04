import * as React from "react";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "https://placehold.co/600x400?text=Image+Not+Found";

const Image = React.forwardRef(
  (
    {
      src,
      alt = "",
      className,
      style,
      fittingType = "cover", // "cover" または "contain"
      loading = "lazy",
      onError,
      ...props
    },
    ref
  ) => {
    const [imageSrc, setImageSrc] = React.useState(src);

    React.useEffect(() => {
      setImageSrc(src);
    }, [src]);

    return (
      <img
        ref={ref}
        src={imageSrc || FALLBACK_IMAGE}
        alt={alt}
        loading={loading}
        className={cn(
          "block w-full h-full",
          fittingType === "contain"
            ? "object-contain"
            : "object-cover",
          className
        )}
        style={style}
        onError={(e) => {
          if (imageSrc !== FALLBACK_IMAGE) {
            setImageSrc(FALLBACK_IMAGE);
          }
          onError?.(e);
        }}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

export { Image };