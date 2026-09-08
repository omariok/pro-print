import Hero from "@/components/sections/Hero";
import Capabilities from "@/components/sections/Capabilities";
import Pvc from "@/components/sections/Pvc";
import Examples from "@/components/sections/Examples";
import Advantages from "@/components/sections/Advantages";
import Metrics from "@/components/sections/Metrics";
import Production from "@/components/sections/Production";
import Process from "@/components/sections/Process";
import Prepress from "@/components/sections/Prepress";
import Documents from "@/components/sections/Documents";
import Faq from "@/components/sections/Faq";
import ContactForm from "@/components/sections/ContactForm";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Pvc />
      <Examples />
      <Advantages />
      <Metrics />
      <Production />
      <Process />
      <Prepress />
      <Documents />
      <Faq />
      <ContactForm />
    </>
  );
}
