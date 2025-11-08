import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Album, Loader, Music } from "lucide-react";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useAdminStore } from "@/stores/useAdminStore";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Toaster } from "react-hot-toast";

const AdminPage = () => {
  const { isAdmin } = useAuthStore();
  const { isLoading, getAll } = useAdminStore();

  useEffect(() => {
    getAll();
  }, [getAll]);

  if (!isAdmin)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className=" p-6 rounded-lg">Unauthorized</span>
      </div>
    );
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-8 text-emerald-500 animate-spin" />
        <span className=" p-6 rounded-lg">Loading</span>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-linear-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8"
    >
      <div>
        <Toaster />
      </div>

      <Header />

      <DashboardStats />

      <Tabs defaultValue="songs" className="space-y-6">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-zinc-700"
          >
            <Music className="mr-2 size-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            className="data-[state=active]:bg-zinc-700"
          >
            <Album className="mr-2 size-4" />
            Albums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
