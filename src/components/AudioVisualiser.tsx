"use client";

import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
  isPlaying: boolean;
  soundType: string;
}

export default function AudioVisualizer({ audioContext, gainNode, isPlaying, soundType }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioContext || !gainNode || !canvasRef.current || !isPlaying) return;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    gainNode.connect(analyser);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(59, 130, 246)';
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    draw();

    return () => {
      gainNode.disconnect(analyser);
    };
  }, [audioContext, gainNode, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className="mt-2 w-full bg-white dark:bg-gray-700 rounded"
    />
  );
}