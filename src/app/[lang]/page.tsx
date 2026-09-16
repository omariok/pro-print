import Hero from "@/components/sections/Hero";
import Capabilities from "@/components/sections/Capabilities";
import Pvc from "@/components/sections/Pvc";
import Examples from "@/components/sections/Examples";
import Advantages from "@/components/sections/Advantages";
import Metrics from "@/components/sections/Metrics";
import Production from "@/components/sections/Production";
import Process from "@/components/sections/Process";
import Documents from "@/components/sections/Documents";
import Faq from "@/components/sections/Faq";
import ContactForm from "@/components/sections/ContactForm";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getContent(lang);

  return (
    <>
      <Hero lang={lang} hero={t.hero} />
      <Capabilities lang={lang} capabilities={t.capabilities} />
      <Pvc pvc={t.pvc} />
      <Examples examples={t.examples} />
      <Advantages advantages={t.advantages} />
      <Metrics metrics={t.metrics} />
      <Production production={t.production} />
      <Process process={t.process} />
      <Documents documents={t.documents} />
      <Faq faq={t.faq} />
      <ContactForm lang={lang} t={t} />
    </>
  );
}
