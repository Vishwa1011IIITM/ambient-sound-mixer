"use client";

import { useState, useEffect } from 'react';

interface TimerProps {
  onTimerEnd: () => void;
}

export default function Timer({ onTimerEnd }: TimerProps) {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, onTimerEnd]);

  const handleStart = (minutes: number) => {
    setTime(minutes * 60);
    setIsRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Timer</h3>
      <div className="text-2xl mb-4">{formatTime(time)}</div>
      <div className="flex gap-2">
        <button
          onClick={() => handleStart(25)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={isRunning}
        >
          25 min (Focus)
        </button>
        <button
          onClick={() => handleStart(60)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={isRunning}
        >
          60 min (Sleep)
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTime(0);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}