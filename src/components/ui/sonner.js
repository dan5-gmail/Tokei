import { Toaster as Sonner } from "@/components/ui/sonner";

const Toaster = ({
  ...props
}) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-background text-foreground border-border shadow-lg",

          description:
            "text-muted-foreground",

          actionButton:
            "bg-primary text-primary-foreground",

          cancelButton:
            "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };