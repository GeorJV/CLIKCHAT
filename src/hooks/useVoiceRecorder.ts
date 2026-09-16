import { useState, useRef, useCallback } from 'react';

export interface RecordedAudioData {
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
}

interface UseVoiceRecorderOptions {
  onTranscription: (text: string, audioData?: RecordedAudioData) => void;
  onAudioRecorded?: (audioData: RecordedAudioData) => void;
  onError?: (error: string) => void;
}

export function useVoiceRecorder({ onTranscription, onAudioRecorded, onError }: UseVoiceRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const maxVolumeRef = useRef<number>(0);
  const recordingSecondsRef = useRef<number>(0);

  const startTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    recordingSecondsRef.current = 0;
    timerIntervalRef.current = setInterval(() => {
      recordingSecondsRef.current += 1;
      setRecordingSeconds(recordingSecondsRef.current);
      if (recordingSecondsRef.current >= 60) stopRecording();
    }, 1000);
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      maxVolumeRef.current = 0;

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
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((acc, v) => acc + v, 0) / dataArray.length;
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

        if (audioBlob.size < 500 || maxVolumeRef.current < 4) {
          if (onError) onError('No se detectó voz audible. Intenta hablar más cerca del micrófono.');
          return;
        }

        const duration = Math.max(recordingSecondsRef.current, 1);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioData: RecordedAudioData = { audioBlob, audioUrl, duration };

        // APENAS EL USUARIO SUELTA: Se muestra de inmediato en el chat
        if (onAudioRecorded) onAudioRecorded(audioData);

        // MIENTRAS POR DETRÁS SE PROCESA la transcripción en Cloudflare Workers AI
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
              onTranscription(data.text.trim(), audioData);
            }
          }
        } catch (err: any) {
          if (onError) onError(err.message || 'Error transcribiendo audio');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingSeconds(0);
      startTimer();
    } catch (err: any) {
      if (onError) onError('Permiso de micrófono denegado o no disponible.');
    }
  }, [onTranscription, onAudioRecorded, onError]);

  const stopRecording = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  }, []);

  const cancelRecording = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  }, []);

  return {
    isRecording, isPaused, recordingSeconds, isTranscribing,
    startRecording, stopRecording, cancelRecording, pauseRecording, resumeRecording
  };
}
