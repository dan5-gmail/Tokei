import * as React from "react";

export function useSize(ref) {
  const [size, setSize] = React.useState(null);

  React.useLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();

      setSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}