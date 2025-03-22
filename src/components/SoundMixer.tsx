"use client";

import { useState, useEffect } from 'react';
import { FaCloudRain, FaCoffee, FaCrow, FaFire } from 'react-icons/fa';
import AudioVisualizer from './AudioVisualiser';
import Timer from './Timer';

interface Sound {
  id: number;
  name: string;
  url: string;
}

interface SoundState {
  playing: boolean;
  volume: number;
}

interface SoundStates {
  [id: number]: SoundState;
}

interface SoundMixerProps {
  selectedPreset: string | null;
}

export default function SoundMixer({ selectedPreset }: SoundMixerProps) {
  const sounds: Sound[] = [
    { id: 1, name: 'Rain', url: '/sounds/rain.mp3' },
    { id: 2, name: 'Coffee Shop', url: '/sounds/coffee-shop.mp3' },
    { id: 3, name: 'Birds', url: '/sounds/birds.mp3' },
    { id: 4, name: 'Fireplace', url: '/sounds/fireplace.mp3' },
  ];

  const [soundStates, setSoundStates] = useState<SoundStates>({
    1: { playing: false, volume: 0.5 },
    2: { playing: false, volume: 0.5 },
    3: { playing: false, volume: 0.5 },
    4: { playing: false, volume: 0.5 },
  });

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffers, setAudioBuffers] = useState<{ [key: number]: AudioBuffer }>({});
  const [soundSources, setSoundSources] = useState<{
    [key: number]: { source: AudioBufferSourceNode | null; gainNode: GainNode | null };
  }>({
    1: { source: null, gainNode: null },
    2: { source: null, gainNode: null },
    3: { source: null, gainNode: null },
    4: { source: null, gainNode: null },
  });

  // Initialize AudioContext and load sounds
  useEffect(() => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(context);
    
    const loadSounds = async () => {
      const buffers: { [key: number]: AudioBuffer } = {};
      for (const sound of sounds) {
        const response = await fetch(sound.url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        buffers[sound.id] = audioBuffer;
        
        const gainNode = context.createGain();
        gainNode.gain.value = soundStates[sound.id].volume;
        gainNode.connect(context.destination);
        setSoundSources((prev) => ({
          ...prev,
          [sound.id]: { ...prev[sound.id], gainNode },
        }));
      }
      setAudioBuffers(buffers);
    };
    loadSounds();
  }, []);

  // Toggle play/pause for a sound
  const togglePlay = (id: number) => {
    if (!audioContext || !audioBuffers[id]) return;

    if (soundStates[id].playing) {
      soundSources[id].source?.stop();
      setSoundSources((prev) => ({
        ...prev,
        [id]: { ...prev[id], source: null },
      }));
    } else {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffers[id];
      source.connect(soundSources[id].gainNode!);
      source.loop = true;
      source.start();
      setSoundSources((prev) => ({
        ...prev,
        [id]: { ...prev[id], source },
      }));
    }
    setSoundStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], playing: !prev[id].playing },
    }));
  };

  // Handle volume change
  const handleVolumeChange = (id: number, value: number) => {
    setSoundStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], volume: value },
    }));
    if (soundSources[id].gainNode) {
      soundSources[id].gainNode.gain.value = value;
    }
  };

  // Fade out and stop sounds when timer ends
  const handleTimerEnd = () => {
    const fadeOutDuration = 10; // seconds
    sounds.forEach((sound) => {
      if (soundStates[sound.id].playing && soundSources[sound.id].gainNode) {
        const gainNode = soundSources[sound.id].gainNode!;
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext!.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext!.currentTime + fadeOutDuration);
        
        setTimeout(() => {
          soundSources[sound.id].source?.stop();
          setSoundSources((prev) => ({
            ...prev,
            [sound.id]: { ...prev[sound.id], source: null },
          }));
          setSoundStates((prev) => ({
            ...prev,
            [sound.id]: { ...prev[sound.id], playing: false },
          }));
        }, fadeOutDuration * 1000);
      }
    });
  };

  // Apply selected preset
  useEffect(() => {
    if (selectedPreset) {
      const presetStates: SoundStates | undefined = {
        'Rainy Cafe': {
          1: { playing: true, volume: 0.7 },
          2: { playing: true, volume: 0.5 },
          3: { playing: false, volume: 0.5 },
          4: { playing: false, volume: 0.5 },
        },
        'Forest Morning': {
          1: { playing: false, volume: 0.5 },
          2: { playing: false, volume: 0.5 },
          3: { playing: true, volume: 0.8 },
          4: { playing: false, volume: 0.5 },
        },
        'Cozy Fireplace': {
          1: { playing: false, volume: 0.5 },
          2: { playing: false, volume: 0.5 },
          3: { playing: false, volume: 0.5 },
          4: { playing: true, volume: 0.6 },
        },
      }[selectedPreset] as SoundStates | undefined;

      if (presetStates) {
        // Stop currently playing sounds
        sounds.forEach(sound => {
          if (soundStates[sound.id].playing) {
            togglePlay(sound.id);
          }
        });
        setSoundStates(presetStates);
        // Start sounds based on the preset
        sounds.forEach(sound => {
          if (presetStates[sound.id].playing) {
            togglePlay(sound.id);
          }
        });
      }
    }
  }, [selectedPreset]);

  // Map sound names to icons
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'rain':
        return <FaCloudRain className="mr-2" />;
      case 'coffee shop':
        return <FaCoffee className="mr-2" />;
      case 'birds':
        return <FaCrow className="mr-2" />;
      case 'fireplace':
        return <FaFire className="mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sounds.map((sound) => (
          <div key={sound.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex items-center mb-2">
              {getIcon(sound.name)}
              <h3 className="text-lg font-medium">{sound.name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => togglePlay(sound.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {soundStates[sound.id].playing ? 'Pause' : 'Play'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={soundStates[sound.id].volume}
                onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <AudioVisualizer
              audioContext={audioContext}
              gainNode={soundSources[sound.id].gainNode}
              isPlaying={soundStates[sound.id].playing}
              soundType={sound.name}
            />
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Timer onTimerEnd={handleTimerEnd} />
      </div>
    </div>
  );
}