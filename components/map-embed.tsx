import { siteConfig } from "@/lib/site-config";

export function MapEmbed({ title }: { title: string }) {
  return (
    <iframe
      src={siteConfig.mapEmbedUrl}
      title={title}
      loading="lazy"
      className="h-72 w-full sm:h-80"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
