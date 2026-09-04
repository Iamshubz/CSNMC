import React, { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, Loader2, MapPin, RefreshCcw, X } from 'lucide-react';
import { fetchApi } from '../lib/utils';

interface WorkerProofModalProps {
  complaintId: number;
  onClose: () => void;
  onSubmitted: () => void;
}

type Coordinates = {
  latitude: number | null;
  longitude: number | null;
};

export const WorkerProofModal: React.FC<WorkerProofModalProps> = ({
  complaintId,
  onClose,
  onSubmitted,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates>({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState('');
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera access is not supported on this device.');
        }

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

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
        if (!cancelled) {
          setCameraError(error instanceof Error ? error.message : 'Unable to open camera.');
        }
      }
    };

    if (!navigator.geolocation) {
      setLocationError('Location access is required to submit proof.');
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!cancelled) {
            setCoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        },
        () => {
          if (!cancelled) {
            setLocationError('Location access is required to submit proof.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, []);

  const handleSnap = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !cameraReady || !video.videoWidth) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        setCameraError('Unable to capture a photo. Please try again.');
        return;
      }
      setPhoto(blob);
      setPhotoPreview(URL.createObjectURL(blob));
    }, 'image/jpeg', 0.92);
  };

  const handleRetake = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhoto(null);
    setPhotoPreview('');
  };

  const handleSubmit = async () => {
    if (!photo || coordinates.latitude === null || coordinates.longitude === null) {
      setLocationError('Wait for a GPS fix before submitting proof.');
      return;
    }

    setSubmitting(true);
    stopCamera();
    try {
      const formData = new FormData();
      formData.append('image', photo, 'worker-proof.jpg');
      formData.append('latitude', String(coordinates.latitude));
      formData.append('longitude', String(coordinates.longitude));
      await fetchApi(`/api/complaints/${complaintId}/resolve`, {
        method: 'POST',
        body: formData,
      });
      onSubmitted();
      onClose();
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : 'Unable to submit proof.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="proof-modal-title">
      <button type="button" className="absolute inset-0 bg-slate-950/70" onClick={onClose} aria-label="Close proof capture" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div>
            <h2 id="proof-modal-title" className="text-lg font-bold text-slate-900">Capture Proof &amp; Resolve</h2>
            <p className="text-xs text-slate-500">Take a fresh photo at the reported site.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="overflow-hidden rounded-xl bg-slate-950">
            {photoPreview ? (
              <img src={photoPreview} alt="Worker proof preview" className="aspect-video w-full object-cover" />
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full object-cover" />
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="h-4 w-4 text-emerald-600" />
            {coordinates.latitude === null ? 'Getting GPS location...' : 'GPS location attached'}
          </div>

          {(cameraError || locationError) && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{cameraError || locationError}</p>
          )}

          {photoPreview ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={handleRetake} disabled={submitting} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                <RefreshCcw className="h-4 w-4" />
                Retake
              </button>
              <button type="button" onClick={handleSubmit} disabled={submitting || coordinates.latitude === null} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Submit Resolution
              </button>
            </div>
          ) : (
            <button type="button" onClick={handleSnap} disabled={!cameraReady} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
              {cameraReady ? <Camera className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
              Snap Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
