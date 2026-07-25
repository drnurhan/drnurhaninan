import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero";
import { Trust } from "@/components/trust";
import { Services } from "@/components/services";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <Trust />
      <Services />
      <About />
      <Contact />
    </main>
  );
}
