// services/AudioService.ts
import { Audio } from 'expo-av';
import { Song } from '../types/Song';

class AudioService {
  private sound: Audio.Sound | null = null;
  private currentSong: Song | null = null;
  private isPlaying: boolean = false;
  private position: number = 0;
  private duration: number = 0;

  async initializeAudio() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }

  async loadSong(song: Song, url: string) {
    if (this.sound) {
      await this.sound.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: false }
    );

    this.sound = sound;
    this.currentSong = song;
    
    // Set up status updates
    this.sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
  }

  async play() {
    if (this.sound) {
      await this.sound.playAsync();
      this.isPlaying = true;
    }
  }

  async pause() {
    if (this.sound) {
      await this.sound.pauseAsync();
      this.isPlaying = false;
    }
  }

  async seekTo(position: number) {
    if (this.sound) {
      await this.sound.setPositionAsync(position * 1000); // Convert to milliseconds
    }
  }

  private onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      this.position = status.positionMillis / 1000; // Convert to seconds
      this.duration = status.durationMillis / 1000;
      this.isPlaying = status.isPlaying;
      
      // Emit events to update UI
      // You can use EventEmitter or Context API
    }
  };
}

export const audioService = new AudioService();