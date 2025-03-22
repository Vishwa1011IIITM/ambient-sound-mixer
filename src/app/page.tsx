"use client";

import { useState } from 'react';
import Header from '../components/Header';
import SoundMixer from '../components/SoundMixer';

type SoundStates = {
  [id: number]: { playing: boolean; volume: number };
};

type Preset = {
  name: string;
  states: SoundStates;
};

export default function Home() {
  const defaultPresets: Preset[] = [
    {
      name: 'Rainy Cafe',
      states: {
        1: { playing: true, volume: 0.7 },
        2: { playing: true, volume: 0.5 },
        3: { playing: false, volume: 0.5 },
        4: { playing: false, volume: 0.5 },
      },
    },
    {
      name: 'Forest Morning',
      states: {
        1: { playing: false, volume: 0.5 },
        2: { playing: false, volume: 0.5 },
        3: { playing: true, volume: 0.8 },
        4: { playing: false, volume: 0.5 },
      },
    },
    {
      name: 'Cozy Fireplace',
      states: {
        1: { playing: false, volume: 0.5 },
        2: { playing: false, volume: 0.5 },
        3: { playing: false, volume: 0.5 },
        4: { playing: true, volume: 0.6 },
      },
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header presets={defaultPresets.map(p => p.name)} onPresetSelect={setSelectedPreset} />
      <SoundMixer selectedPreset={selectedPreset} />
    </main>
  );
}