import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import FeaturesSection from "@/components/FeaturesSection";
import RecentEvents from "@/components/RecentEvents";
import GallerySection from "@/components/GallerySection";
import NewsletterSection from "@/components/NewsletterSection";

// Recent Events, Gallery and Banner fetch events on the server at
// request time — never freeze them at build time.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <FeaturesSection />
      <RecentEvents />
      <GallerySection />
      <NewsletterSection />
    </>
  );
}
