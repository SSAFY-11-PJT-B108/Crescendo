import React, { useState, useEffect } from 'react';
import { ReactComponent as Play } from '../../assets/images/challenge/playbtn.svg';
import { ReactComponent as Pause } from '../../assets/images/challenge/pause.svg';
import { getChallengeOriginAPI } from '../../apis/challenge';
import { IMAGE_BASE_URL } from '../../apis/core';

interface ParmsProps {
  challengeId: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  setIsPlaying: (argu: boolean) => void;
}
export default function VideoPlayerOrigin({
  challengeId,
  videoRef,
  isPlaying,
  setIsPlaying,
}: ParmsProps) {
  const [url, setUrl] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleLoadedMetadata = () => {
        if (videoElement) {
          setDuration(videoElement.duration);
        }
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        if (videoElement) {
          videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, [videoRef]);

  useEffect(() => {
    const getOriginChallenge = async () => {
      const response = await getChallengeOriginAPI(challengeId);
      setUrl(response.challengeVideoPath);
    };
    getOriginChallenge();
  }, [challengeId]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [videoRef, setIsPlaying]);

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        setIsPlaying(true);
      } else {
        videoElement.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = (value / 100) * duration;
      setProgress(value);
    }
  };

  const updateProgress = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setProgress((videoElement.currentTime / videoElement.duration) * 100);
    }
  };

  return (
    <div className="video-container" onClick={togglePlayPause}>
      <video
        ref={videoRef}
        className="video-player"
        onTimeUpdate={updateProgress}
        src={`${IMAGE_BASE_URL}${url}`}
      />
      <div className="controls">
        <button className="play-pause-button">{isPlaying ? <Pause /> : <Play />}</button>
        <input
          type="range"
          className="progress-bar"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
        />
      </div>
      <div className="big-play-pause-button">
        {isPlaying ? (
          <Pause className="w-20 h-20 fade-out" />
        ) : (
          <Play className="w-20 h-20 fade-out" />
        )}
      </div>
    </div>
  );
}
