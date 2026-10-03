import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dr. Nurhan İnan | Estetik ve Restoratif Diş Hekimliği",
    short_name: "Dr. Nurhan İnan",
    description:
      "Bursa Nilüfer'de estetik ve restoratif diş hekimliği — uluslararası hasta deneyimi.",
    start_url: "/tr",
    display: "standalone",
    background_color: "#f1efed",
    theme_color: "#151515",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
