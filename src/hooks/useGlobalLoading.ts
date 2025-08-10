import { useState, useEffect } from "react";
import { loadingService } from "../services/loading";

export const useGlobalLoading = () => {
  const [isLoading, setIsLoading] = useState(loadingService.isLoading);

  useEffect(() => {
    const unsubscribe = loadingService.subscribe(setIsLoading);
    return unsubscribe;
  }, []);

  return isLoading;
};
