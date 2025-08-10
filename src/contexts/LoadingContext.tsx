import { createContext, useContext, useState, type ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  requestCount: number;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [requestCount, setRequestCount] = useState(0);
  const isLoading = requestCount > 0;

  const setLoading = (loading: boolean) => {
    setRequestCount((prev) => {
      const newCount = loading ? prev + 1 : Math.max(0, prev - 1);
      return newCount;
    });
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, requestCount }}>
      {children}
    </LoadingContext.Provider>
  );
};
