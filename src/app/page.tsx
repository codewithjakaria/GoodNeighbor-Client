import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import FeaturesSection from "@/components/FeaturesSection";
import RecentEvents from "@/components/RecentEvents";
import GallerySection from "@/components/GallerySection";
import NewsletterSection from "@/components/NewsletterSection";

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
