import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkIsAdmin } = useAuthStore();
  const { connect } = useChatStore();

  useEffect(() => {
    let interceptorId: number;

    const initAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          interceptorId = axiosInstance.interceptors.request.use(
            async (config) => {
              const token = await getToken();
              config.headers["Authorization"] = `Bearer ${token}`;
              return config;
            }
          );
          checkIsAdmin();
          connect(token);
        }
      } catch (error) {
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (interceptorId)
        axiosInstance.interceptors.request.eject(interceptorId);
    };
  }, [getToken, checkIsAdmin, connect]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <>{children}</>;
};
export default AuthProvider;
