import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, RefreshCcw, MapPinned, ShieldAlert, Loader2 } from 'lucide-react';

export type CaptureMetadata = {
  imageUrl: string;
  capturedAt: string;
  captureLatitude: number | null;
  captureLongitude: number | null;
  captureAccuracy: number | null;
};

interface LiveCameraCaptureProps {
  value: string;
  onCapture: (metadata: CaptureMetadata) => void;
  onClear: () => void;
}

export const LiveCameraCapture: React.FC<LiveCameraCaptureProps> = ({ value, onCapture, onClear }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [capturingLocation, setCapturingLocation] = useState(true);
  const [locationError, setLocationError] = useState('');
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null; accuracy: number | null }>({
    latitude: null,
    longitude: null,
    accuracy: null,
  });

  const canCapture = useMemo(() => cameraReady && Boolean(videoRef.current), [cameraReady]);

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera access is not supported on this device');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraReady(true);
      } catch (error) {
        setCameraError(error instanceof Error ? error.message : 'Unable to open camera');
      }
    };

    const captureLocation = () => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported on this device');
        setCapturingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) {
            return;
          }

          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setCapturingLocation(false);
        },
        () => {
          if (!cancelled) {
            setLocationError('Location permission is needed to submit a complaint');
            setCapturingLocation(false);
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    startCamera();
    captureLocation();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !cameraReady) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL('image/jpeg', 0.92);

    onCapture({
      imageUrl,
      capturedAt: new Date().toISOString(),
      captureLatitude: location.latitude,
      captureLongitude: location.longitude,
      captureAccuracy: location.accuracy,
    });
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-950 overflow-hidden">
        {value ? (
          <img src={value} alt="Captured complaint" className="aspect-video w-full object-cover" />
        ) : (
          <video ref={videoRef} playsInline muted className="aspect-video w-full object-cover bg-slate-900" />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-emerald-700">
          <Camera className="w-3.5 h-3.5" />
          Live camera only
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1">
          <MapPinned className="w-3.5 h-3.5" />
          {capturingLocation ? 'Capturing location...' : location.latitude && location.longitude ? 'Location attached' : 'Location unavailable'}
        </span>
      </div>

      {cameraError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {locationError && (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800 flex items-start gap-2">
          <MapPinned className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleCapture}
          disabled={!canCapture}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cameraReady ? <Camera className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
          Capture live photo
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={!value}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw className="w-4 h-4" />
          Retake
        </button>
      </div>
    </div>
  );
};