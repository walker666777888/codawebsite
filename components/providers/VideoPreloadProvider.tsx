"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface VideoPreloadContextValue {
  shouldLoad: boolean;
  triggerLoad: () => void;
}

const VideoPreloadContext = createContext<VideoPreloadContextValue>({
  shouldLoad: false,
  triggerLoad: () => {},
});

export function VideoPreloadProvider({ children }: { children: React.ReactNode }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const triggerLoad = useCallback(() => setShouldLoad(true), []);

  return (
    <VideoPreloadContext.Provider value={{ shouldLoad, triggerLoad }}>
      {children}
    </VideoPreloadContext.Provider>
  );
}

export function useVideoPreload() {
  return useContext(VideoPreloadContext);
}
