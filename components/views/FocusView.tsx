
import React, { useState, useEffect, useRef } from 'react';
import { SoundType } from '../../types';
import { useData } from '../hooks/useData';

// Preset configurations
const TIMER_PRESETS = [
  { label: 'Pomodoro', focus: 25, break: 5 },
  { label: 'Deep Work', focus: 50, break: 10 },
  { label: 'Long Haul', focus: 90, break: 15 },
];

const ENVIRONMENTS = [
  { id: 'deep-study', label: 'Deep Study', icon: 'ti-book', noise: 'brown-noise', noiseVol: 0.8, music: 'lofi' },
  { id: 'coding-zone', label: 'Coding Zone', icon: 'ti-code', noise: 'pink-noise', noiseVol: 0.3, music: 'local' },
  { id: 'exam-prep', label: 'Exam Prep', icon: 'ti-school', noise: 'white-noise', noiseVol: 0.5, music: 'none' },
];

const LOFI_STREAM_URL = "https://streams.ilovemusic.de/ilovemusic16.mp3"; // Free LoFi Stream

class NoiseGenerator {
  ctx: AudioContext | null = null;
  source: AudioBufferSourceNode | null = null;
  gainNode: GainNode | null = null;
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setVolume(val: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = val;
    }
  }

  play(type: SoundType, volume: number) {
    this.stop();
    this.init();
    if (!this.ctx || type === 'none') return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.source = this.ctx.createBufferSource();
    this.source.buffer = buffer;
    this.source.loop = true;

    this.gainNode = this.ctx.createGain();
    
    // Sound Color filtering
    if (type === 'brown-noise') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      this.source.connect(filter);
      filter.connect(this.gainNode);
    } else if (type === 'pink-noise') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
       this.source.connect(filter);
      filter.connect(this.gainNode);
    } else {
      this.source.connect(this.gainNode);
    }

    this.gainNode.gain.value = volume;
    this.gainNode.connect(this.ctx.destination);
    this.source.start();
  }

  stop() {
    if (this.source) {
      this.source.stop();
      this.source.disconnect();
      this.source = null;
    }
  }
}

const noiseGen = new NoiseGenerator();

export const FocusView: React.FC = () => {
  const { addFocusSession } = useData();
  
  // Timer State
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isFocus, setIsFocus] = useState(true);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionGoal, setSessionGoal] = useState('');
  
  // Audio Mixer State
  const [ambientSound, setAmbientSound] = useState<SoundType>('none');
  const [ambientVol, setAmbientVol] = useState(0.5);
  const [musicSource, setMusicSource] = useState<'none' | 'lofi' | 'local'>('none');
  const [musicVol, setMusicVol] = useState(0.5);
  
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [localAudioSrc, setLocalAudioSrc] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string>('');
  const [isZenMode, setIsZenMode] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize timer
  useEffect(() => {
    setTimeLeft(focusTime * 60);
  }, [focusTime]);

  // Timer Logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      noiseGen.stop();
      if (audioRef.current) audioRef.current.pause();
      
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play();

      if (isFocus) {
        if (sessionGoal) {
          addFocusSession(focusTime, sessionGoal);
        }
        if (window.confirm("Focus session complete! Start break?")) {
           setIsFocus(false);
           setTimeLeft(breakTime * 60);
           setIsActive(true);
        }
      } else {
        alert("Break over! Ready to focus?");
        setIsFocus(true);
        setTimeLeft(focusTime * 60);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, isFocus, focusTime, breakTime, sessionGoal]);

  // Ambient Sound Engine
  useEffect(() => {
    if (isActive && ambientSound !== 'none') {
      noiseGen.play(ambientSound, ambientVol);
    } else {
      noiseGen.stop();
    }
    return () => noiseGen.stop();
  }, [ambientSound, isActive]);

  // Volume Updates live
  useEffect(() => {
    noiseGen.setVolume(ambientVol);
  }, [ambientVol]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = musicVol;
  }, [musicVol]);

  // Music Player Engine
  useEffect(() => {
    if (!audioRef.current) return;

    if (isActive && musicSource !== 'none') {
      if (musicSource === 'lofi') {
        if (audioRef.current.src !== LOFI_STREAM_URL) audioRef.current.src = LOFI_STREAM_URL;
      } 
      // Local source is set via handler
      
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    } else {
      audioRef.current.pause();
    }
  }, [isActive, musicSource, localAudioSrc]);

  // Handlers
  const toggleTimer = () => setIsActive(prev => !prev);
  
  const resetTimer = () => {
    setIsActive(false);
    setIsFocus(true);
    setTimeLeft(focusTime * 60);
  };

  const applyTimerPreset = (focus: number, brk: number) => {
    setFocusTime(focus);
    setBreakTime(brk);
    setIsFocus(true);
    setIsActive(false);
    setTimeLeft(focus * 60);
  };

  const applyEnvPreset = (id: string) => {
    const env = ENVIRONMENTS.find(e => e.id === id);
    if (!env) return;
    setAmbientSound(env.noise as SoundType);
    setAmbientVol(env.noiseVol);
    setMusicSource(env.music as any);
    if (env.music === 'lofi') setMusicVol(0.6);
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setBgImage(url);
    }
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setLocalAudioSrc(url);
      setLocalFileName(file.name);
      setMusicSource('local');
      if (audioRef.current) audioRef.current.src = url;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`p-6 animate-fade-in relative overflow-hidden transition-all duration-500 ${isZenMode ? 'fixed inset-0 z-[60] bg-black text-white h-screen w-screen m-0' : 'pb-28'}`}>
      
      <audio ref={audioRef} loop />

      {/* Dynamic Background */}
      {bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
      )}
      {!bgImage && !isZenMode && (
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Zen Mode Close Button */}
      {isZenMode && (
        <button onClick={() => setIsZenMode(false)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 z-50">
          <i className="ti ti-minimize text-2xl"></i>
        </button>
      )}

      <div className={`z-10 flex flex-col items-center w-full ${isZenMode ? 'h-full justify-center max-w-2xl mx-auto' : 'max-w-md mx-auto mt-4'}`}>
        
        {!isZenMode && (
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Focus Studio</h1>
            <p className="text-slate-500 dark:text-gray-400">Mix your perfect environment.</p>
          </div>
        )}

        {/* Goal Input */}
        <div className="w-full mb-8 relative z-10">
           <input 
             type="text" 
             value={sessionGoal}
             onChange={e => setSessionGoal(e.target.value)}
             placeholder="What is your main goal?"
             className={`w-full text-center bg-transparent border-b-2 border-slate-200 dark:border-slate-700 py-2 focus:border-primary focus:outline-none placeholder-slate-400 transition-all ${isZenMode ? 'text-2xl text-white border-white/30' : 'text-lg text-slate-800 dark:text-white'}`}
           />
        </div>

        {/* Timer Display */}
        <div className={`font-mono font-bold tracking-tighter transition-all relative z-10 ${isZenMode ? 'text-[10rem] text-white leading-none drop-shadow-2xl' : 'text-8xl text-slate-800 dark:text-white mb-8'}`}>
          {formatTime(timeLeft)}
        </div>
        
        {/* Status Badge */}
        <div className="mb-8 relative z-10">
           <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${isFocus ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'}`}>
             {isFocus ? 'Focus Session' : 'Short Break'}
           </span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 mb-10 relative z-10">
          <button onClick={resetTimer} className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <i className="ti ti-rotate-clockwise text-xl"></i>
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white shadow-xl transition-transform active:scale-95 ${isActive ? 'bg-orange-500' : 'bg-primary'}`}
          >
            <i className={`ti ${isActive ? 'ti-player-pause' : 'ti-player-play-filled'}`}></i>
          </button>
          
          {!isZenMode && (
             <button onClick={() => setIsZenMode(true)} className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Zen Mode">
               <i className="ti ti-maximize text-xl"></i>
             </button>
          )}
        </div>

        {/* Settings Panel (Hidden in Zen Mode) */}
        {!isZenMode && (
          <div className="w-full space-y-4 relative z-10">
            
            {/* Environment Presets */}
            <div className="grid grid-cols-3 gap-3">
               {ENVIRONMENTS.map(env => (
                 <button 
                   key={env.id}
                   onClick={() => applyEnvPreset(env.id)}
                   className="bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex flex-col items-center gap-2 hover:border-primary transition-colors group"
                 >
                   <i className={`ti ${env.icon} text-2xl text-slate-400 group-hover:text-primary`}></i>
                   <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{env.label}</span>
                 </button>
               ))}
            </div>

            {/* Audio Mixer */}
            <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <i className="ti ti-volume"></i> Audio Mixer
               </h3>
               
               {/* Ambient Channel */}
               <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Ambient Noise</span>
                    <select 
                      value={ambientSound} 
                      onChange={e => setAmbientSound(e.target.value as SoundType)}
                      className="bg-slate-100 dark:bg-black/20 border-none rounded text-xs px-2 py-0.5"
                    >
                      <option value="none">Off</option>
                      <option value="white-noise">White Noise</option>
                      <option value="pink-noise">Pink Noise</option>
                      <option value="brown-noise">Brown Noise (Rain)</option>
                    </select>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05" 
                    value={ambientVol} onChange={e => setAmbientVol(parseFloat(e.target.value))}
                    className="w-full accent-primary h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
               </div>

               {/* Music Channel */}
               <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Music Overlay</span>
                    <div className="flex gap-2">
                      <button onClick={() => setMusicSource('none')} className={`px-2 py-0.5 rounded ${musicSource==='none' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>Off</button>
                      <button onClick={() => setMusicSource('lofi')} className={`px-2 py-0.5 rounded ${musicSource==='lofi' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>LoFi</button>
                      <label className={`px-2 py-0.5 rounded cursor-pointer ${musicSource==='local' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {localFileName ? 'File' : 'Upload'}
                        <input type="file" accept="audio/*" onChange={handleMusicUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                  {musicSource === 'local' && localFileName && <div className="text-[10px] text-green-500 mb-1 truncate">{localFileName}</div>}
                  <input 
                    type="range" min="0" max="1" step="0.05" 
                    value={musicVol} onChange={e => setMusicVol(parseFloat(e.target.value))}
                    className="w-full accent-green-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
               </div>
            </div>

            {/* Timer Presets */}
            <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Timer Settings</h3>
               <div className="flex justify-between gap-2 mb-3">
                 {TIMER_PRESETS.map((p, i) => (
                   <button 
                     key={i} 
                     onClick={() => applyTimerPreset(p.focus, p.break)}
                     className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${focusTime === p.focus ? 'bg-primary text-white border-primary' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                   >
                     {p.focus}/{p.break}
                   </button>
                 ))}
               </div>
               
               <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                    <i className="ti ti-photo"></i>
                    <span>Custom Wallpaper</span>
                  </div>
                  <label className="cursor-pointer bg-white dark:bg-slate-700 px-3 py-1 rounded border border-slate-200 dark:border-slate-600 text-xs hover:bg-slate-50">
                    Upload
                    <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
                  </label>
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
