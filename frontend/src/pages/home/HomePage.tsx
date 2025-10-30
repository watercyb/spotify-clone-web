import { ScrollArea } from "@/components/ui/scroll-area";
import Topbar from "@/pages/home/components/Topbar";
import SectionGrid from "./components/SectionGrid";
import FeaturedSection from "./components/FeaturedSection";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";

const HomePage = () => {
  const {
    isLoadingMadeForYouSongs,
    madeForYouSongs,
    isLoadingTrendingSongs,
    trendingSongs,
    getMadeForYouSongs,
    getFeaturedSongs,
    getTrendingSongs,
  } = useMusicStore();

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good morning");
      } else if (hour < 18) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };

    updateGreeting();
    const timer = setInterval(updateGreeting, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getMadeForYouSongs();
    getFeaturedSongs();
    getTrendingSongs();
  }, [getFeaturedSongs, getMadeForYouSongs, getTrendingSongs]);

  return (
    <main className="rounded-md overflow-hidden h-full bg-linear-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">{greeting}</h1>
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid
              title="Made For You"
              songs={madeForYouSongs}
              isLoading={isLoadingMadeForYouSongs}
            />
            <SectionGrid
              title="Trending"
              songs={trendingSongs}
              isLoading={isLoadingTrendingSongs}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;
