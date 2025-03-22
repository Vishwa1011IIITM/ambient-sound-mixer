"use client"

import { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
  isPlaying: boolean;
  soundType: string;
}

export default function AudioVisualizer({ 
  audioContext, 
  gainNode, 
  isPlaying,
  soundType 
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  
  // Set up visualization colors based on sound type
  const getColors = () => {
    switch(soundType.toLowerCase()) {
      case 'rain':
        return {
          primary: '#3b82f6',
          secondary: '#60a5fa'
        };
      case 'coffee shop':
        return {
          primary: '#d97706',
          secondary: '#f59e0b'
        };
      case 'birds':
        return {
          primary: '#10b981',
          secondary: '#34d399'
        };
      case 'fireplace':
        return {
          primary: '#ef4444',
          secondary: '#f87171'
        };
      case 'ocean':
        return {
          primary: '#0ea5e9',
          secondary: '#38bdf8'
        };
      default:
        return {
          primary: '#8b5cf6',
          secondary: '#a78bfa'
        };
    }
  };

  useEffect(() => {
    if (!audioContext || !gainNode || !canvasRef.current) return;
    
    // Create analyzer if it doesn't exist
    if (!analyserRef.current) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      gainNode.connect(analyser);
      analyserRef.current = analyser;
    }
    
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Adjust canvas size for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const colors = getColors();
    
    const draw = () => {
      if (!isPlaying) {
        // Draw a static line when not playing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }
      
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create a gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, colors.secondary);
      gradient.addColorStop(1, colors.primary);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [audioContext, gainNode, isPlaying, soundType]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-16 rounded-md bg-opacity-10 bg-gray-500"
    />
  );
}