import { useCallback, useEffect, useRef, useState } from "react";

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
  photoDataUrl: string | null;
  capture: () => string | null;
  reset: () => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  error: string | null;
}

/**
 * Reusable hook for accessing the device camera and capturing photos.
 * Uses the rear-facing camera by default for mobile devices.
 */
export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Rear camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsStreaming(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Camera permission denied. Please allow camera access in your browser settings.");
      } else {
        setError("Could not access camera. Please try again.");
      }
      setIsStreaming(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const capture = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !isStreaming) return null;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhotoDataUrl(dataUrl);
    stopCamera();
    return dataUrl;
  }, [isStreaming, stopCamera]);

  const reset = useCallback(() => {
    setPhotoDataUrl(null);
    setError(null);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    isStreaming,
    photoDataUrl,
    capture,
    reset,
    startCamera,
    stopCamera,
    error,
  };
}
