import { Navbar } from "@/components/navbar/Navbar";
import { Banner } from "@/components/banner/Banner";
import { Trending } from "@/components/trending/Trending";
import { Spotlight } from "@/components/spotlight/Spotlight";
import { Topten } from "@/components/topten/Topten";
import { Schedule } from "@/components/schedule/Schedule";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Banner />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <Trending />
        <Spotlight />
        <Topten />
        <Schedule />
      </div>
      <Footer />
    </div>
  );
}