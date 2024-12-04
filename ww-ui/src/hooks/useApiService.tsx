import { useEffect, useState } from "react";
import ApiService from "../api/service";

const useApiService = () => {
  const [apiService, setApiService] = useState<ApiService | null>(null);

  useEffect(() => {
    const service = new ApiService();
    setApiService(service);
  }, []);

  return apiService;
};

export default useApiService;
