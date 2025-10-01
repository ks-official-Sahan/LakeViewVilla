"use client";
import { createContext, useState, useContext, useEffect } from "react";

type AudioCtx = {
  isPlaying: boolean;
  toggleAudio: () => void;
  bgSound: HTMLAudioElement | null;
};
const Ctx = createContext<AudioCtx | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [bgSound, setBgSound] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // guard ssr
    if (typeof window === "undefined") return;
    const audio = new Audio("/aud/cts.mp3");
    audio.loop = true;
    audio.volume = 0.18;
    setBgSound(audio);

    const savedPlay = localStorage.getItem("isPlaying");
    const savedTime = localStorage.getItem("currentTime");
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    if (savedPlay === "true") {
      audio.currentTime = savedTime ? parseFloat(savedTime) || 0 : 0;
      audio.play().catch(() => {
        setIsPlaying(false);
        localStorage.setItem("isPlaying", "false");
      });
    }

    return () => {
      localStorage.setItem("currentTime", String(audio.currentTime || 0));
      localStorage.setItem("isPlaying", String(isPlaying));
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    if (!bgSound) return;
    const handle = () =>
      localStorage.setItem("currentTime", String(bgSound.currentTime || 0));
    bgSound.addEventListener("timeupdate", handle);
    return () => bgSound.removeEventListener("timeupdate", handle);
  }, [bgSound]);

  const toggleAudio = () => {
    if (!bgSound) return;
    if (isPlaying) {
      bgSound.pause();
      localStorage.setItem("isPlaying", "false");
    } else {
      bgSound.play().catch(() => {});
      localStorage.setItem("isPlaying", "true");
    }
    setIsPlaying((p) => !p);
  };

  return (
    <Ctx.Provider value={{ isPlaying, toggleAudio, bgSound }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAudio = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAudio must be used within AudioProvider");
  return v;
};
