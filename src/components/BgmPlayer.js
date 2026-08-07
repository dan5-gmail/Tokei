import React, { useState, useRef, useEffect } from 'react';

// BGMリストの定義
const TRACKS = [
  { id: 1, title: 'You and Me', src: '/audio/You_and_Me.mp3' },
  { id: 2, title: 'さみしいおばけと東京の月', src: '/audio/さみしいおばけと東京の月.mp3' },
];

export const BgmPlayer = () => {
  /** @type {React.MutableRefObject<HTMLAudioElement | null>} */
  const audioRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const currentTrack = TRACKS[currentIndex];

  // 音量変更の同期
  useEffect(() => {
    /** @type {HTMLAudioElement | null} */
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // トラックが切り替わった時の再生制御
  const playTrack = () => {
    /** @type {HTMLAudioElement | null} */
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    if (isPlaying) {
      audio.play().catch((err) => console.log('再生エラー:', err));
    }
  };

  // 再生 / 一時停止
  const togglePlay = () => {
    /** @type {HTMLAudioElement | null} */
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('再生制限:', err));
    }
  };

  // 前の曲へ
  const handlePrev = () => {
    const nextIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentIndex(nextIndex);
    setTimeout(playTrack, 0);
  };

  // 次の曲へ
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    setCurrentIndex(nextIndex);
    setTimeout(playTrack, 0);
  };

  return (
    <div className="bgm-player-card">
      {/* 隠しオーディオ要素 */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={handleNext}
        preload="auto"
      />

      {/* 現在の曲名表示 */}
      <div className="bgm-track-title">{currentTrack.title}</div>

      {/* メインの操作ボタン */}
      <div className="bgm-controls">
        {/* 前の曲ボタン */}
        <button
          onClick={handlePrev}
          className="bgm-btn bgm-btn-small"
          aria-label="前の曲"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="19,20 9,12 19,4" />
            <line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* 再生 / 停止ボタン */}
        <button
          onClick={togglePlay}
          className="bgm-btn bgm-btn-main"
          aria-label={isPlaying ? '一時停止' : '再生'}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* 次の曲ボタン */}
        <button
          onClick={handleNext}
          className="bgm-btn bgm-btn-small"
          aria-label="次の曲"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,4 15,12 5,20" />
            <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* 音量調整スライダー */}
      <div className="bgm-volume-wrapper">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="bgm-volume-slider"
          aria-label="音量"
        />
      </div>
    </div>
  );
};

export default BgmPlayer;