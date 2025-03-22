"use client"

import { useState, useEffect } from 'react';

interface Sound {
  id: number;
  name: string;
}

interface SoundState {
  playing: boolean;
  volume: number;
}

interface SoundStates {
  [id: number]: SoundState;
}

export default function SoundMixer() {
  // List of sounds
  const sounds = [
    { id: 1, name: 'Rain', url: '/sounds/rain.mp3' },
    { id: 2, name: 'Coffee Shop', url: '/sounds/coffee-shop.mp3' },
    { id: 3, name: 'Birds', url: '/sounds/birds.mp3' },
  ];

  // State to track playing status and volume
  const [soundStates, setSoundStates] = useState<SoundStates>({
    1: { playing: false, volume: 0.5 },
    2: { playing: false, volume: 0.5 },
    3: { playing: false, volume: 0.5 },
  });

    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioBuffers, setAudioBuffers] = useState<{ [key: number]: AudioBuffer }>({});
    const [soundSources, setSoundSources] = useState<{
    [key: number]: { source: AudioBufferSourceNode | null; gainNode: GainNode | null };
    }>({
    1: { source: null, gainNode: null },
    2: { source: null, gainNode: null },
    3: { source: null, gainNode: null },
    });

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

  const togglePlay = (id: number) => {
  if (!audioContext || !audioBuffers[id]) return;

  if (soundStates[id].playing) {
    // Stop the sound
    soundSources[id].source?.stop();
    setSoundSources((prev) => ({
      ...prev,
      [id]: { ...prev[id], source: null },
    }));
  } else {
    // Play the sound
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[id];
    source.connect(soundSources[id].gainNode!);
    source.loop = true; // Makes the sound loop
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

const handleVolumeChange = (id: number, value: number) => {
    setSoundStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], volume: value },
    }));
    if (soundSources[id].gainNode) {
      soundSources[id].gainNode.gain.value = value;
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white">
      {sounds.map((sound) => (
        <div key={sound.id} className="mb-4 p-4 bg-gray-800 rounded">
          <h3 className="text-lg">{sound.name}</h3>
          <button
            onClick={() => togglePlay(sound.id)}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
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
            className="ml-4"
          />
        </div>
      ))}
    </div>
  );
}