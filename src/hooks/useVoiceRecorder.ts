import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecorderOptions {
  onTranscription: (text: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceRecorder({ onTranscription, onError }: UseVoiceRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const maxVolumeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      maxVolumeRef.current = 0;

      // Voice Activity Detection (Analyser)
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkVolume = () => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const avg = sum / dataArray.length;
            if (avg > maxVolumeRef.current) maxVolumeRef.current = avg;
            requestAnimationFrame(checkVolume);
          };
          requestAnimationFrame(checkVolume);
        }
      } catch (e) {}

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          try { audioContextRef.current.close(); } catch (e) {}
          audioContextRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        audioChunksRef.current = [];

        // Check if silence or too short
        if (audioBlob.size < 500 || maxVolumeRef.current < 4) {
          if (onError) onError('No se detectó voz audible. Intenta hablar más cerca del micrófono.');
          return;
        }

        setIsTranscribing(true);
        try {
          const res = await fetch('/api/chat/audio', {
            method: 'POST',
            headers: { 'Content-Type': recorder.mimeType || 'audio/webm' },
            body: audioBlob
          });

          if (res.ok) {
            const data = await res.json();
            if (data.text && data.text.trim()) {
              onTranscription(data.text.trim());
            } else if (onError) {
              onError('No se pudo transcribir la voz con claridad.');
            }
          } else {
            throw new Error('Error de servidor en Cloudflare Workers AI');
          }
        } catch (err: any) {
          if (onError) onError(err.message || 'Error transcribiendo audio');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 60) {
            // Auto stop at 60s
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      if (onError) onError('Permiso de micrófono denegado o no disponible.');
    }
  }, [onTranscription, onError]);

  const stopRecording = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const cancelRecording = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingSeconds(0);
  }, []);

  return {
    isRecording,
    recordingSeconds,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording
  };
}
