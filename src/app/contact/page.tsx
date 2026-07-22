import type { Metadata } from "next";
import { ContactConsole } from "@/features/contact";
import { withBasePath } from "@/lib";

export const metadata: Metadata = {
  title: "Signal",
  description: "Open the ATLAS//NULL demonstration transmission console.",
  alternates: { canonical: withBasePath("/contact/") },
};

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <ContactConsole demoMode />
    </main>
  );
}
