import { useEffect, useState } from 'react';
import styles from './YouTubeVideo.module.scss';
import YouTube, { YouTubeProps } from 'react-youtube';
import { YT } from 'react-youtube/dist/types/YouTube.d';

import Pause from '@components/icons/pause';
import PlayIcon from '@components/icons/play';
import SoundIcon from '@components/icons/sound';
import MuteIcon from '@components/icons/mute';

interface YouTubeVideoProps {
  title: string;
  videoId: string;
}

export default function YouTubeVideo({
  title,
  videoId }: YouTubeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [player, setPlayer] = useState<YT.Player | null>(null);

  useEffect(() => {
    if (player) {
      const currentState = player.getPlayerState();
      if (currentState === 1) {
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }

      if (player.isMuted()) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    }
  }, [player, videoId]);

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: {
      allowFullScreen: true,
      autoplay: 1,
      mute: 1,
      //origin: "http://localhost:3000",
      origin: `${process.env.URL_ORIGIN}`,
    },
  };

  const togglePlay = () => {
    if (player) {
      const currentState = player.getPlayerState();
      if (currentState === 1) {
        setIsPlaying(false);
        player.pauseVideo();
      } else {
        setIsPlaying(true);
        player.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (player) {
      if (player.isMuted()) {
        setIsMuted(false);
        player.unMute();
      } else {
        setIsMuted(true);
        player.mute();
      }
    }
  };

  return (
    <div onClick={e => console.log('Eh')} className={styles['video-container']}>
      <div className={styles['title-container']}>
        <h3 className={styles['title']} >
          <span>{title}</span>
        </h3>
        <div className={styles['buttons-container']}>
          <button
            className={styles['btn']}
            onClick={togglePlay}
            title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
            {isPlaying ? <Pause /> : <PlayIcon />}
          </button>
          <button
            className={`${styles['btn']} ${styles['alternative']}`}
            onClick={toggleMute}
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            >
            {isMuted ? <MuteIcon /> : <SoundIcon />}
          </button>
        </div>
      </div>
      <YouTube
        className={styles['video']}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onReady={(event) => setPlayer(event.target)}
        opts={opts}
        videoId={videoId}
      />
    </div>
  );
};