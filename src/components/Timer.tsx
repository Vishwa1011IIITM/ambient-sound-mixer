"use client"

import { useState, useEffect } from 'react';

interface TimerProps {
  onTimerEnd: () => void;
}

export default function Timer({ onTimerEnd }: TimerProps) {
  const [time, setTime] = useState(30); // Default 30 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  // Convert minutes to readable format
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
  };
  
  const formatTimeRemaining = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startTimer = () => {
    setIsRunning(true);
    setRemainingTime(time * 60);
  };
  
  const stopTimer = () => {
    setIsRunning(false);
    setRemainingTime(0);
  };
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            onTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingTime, onTimerEnd]);
  
  return (
    <div className="mt-4 p-4 bg-card-bg rounded-lg">
      <h3 className="text-lg font-medium mb-2">Sleep Timer</h3>
      
      {!isRunning ? (
        <div>
          <div className="flex items-center mb-2">
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={time}
              onChange={(e) => setTime(parseInt(e.target.value))}
              className="flex-1 mr-2"
            />
            <span className="w-16 text-center">{formatTime(time)}</span>
          </div>
          
          <button
            onClick={startTimer}
            className="w-full py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
          >
            Start Timer
          </button>
        </div>
      ) : (
        <div>
          <div className="text-center mb-2">
            <span className="text-2xl font-mono">{formatTimeRemaining(remainingTime)}</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2.5 mb-4">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-1000"
              style={{ width: `${(remainingTime / (time * 60)) * 100}%` }}
            ></div>
          </div>
          
          <button
            onClick={stopTimer}
            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}