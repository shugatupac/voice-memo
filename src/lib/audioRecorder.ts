import RecordRTC, { RecordRTCPromisesHandler } from "recordrtc";

class AudioRecorder {
  private recorder: RecordRTCPromisesHandler | null = null;
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  async startRecording(): Promise<{ audioData: number[] }> {
    // Clean up any existing recording session
    if (this.recorder) {
      await this.stopRecording();
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.recorder = new RecordRTCPromisesHandler(this.stream, {
        type: "audio",
        mimeType: "audio/webm",
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        timeSlice: 1000,
        disableLogs: false,
        bufferSize: 16384,
      });

      await this.recorder.startRecording();

      // Set up audio analysis
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      return { audioData: Array(50).fill(0.5) };
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }

  getAudioData(): number[] {
    if (!this.analyser || !this.dataArray) return Array(50).fill(0.5);

    this.analyser.getByteFrequencyData(this.dataArray);
    const normalizedData = Array.from(this.dataArray)
      .map((value) => value / 255)
      .slice(0, 50);

    return normalizedData;
  }

  async stopRecording(): Promise<Blob> {
    if (!this.recorder || !this.stream)
      throw new Error("No recording in progress");

    await this.recorder.stopRecording();
    const blob = await this.recorder.getBlob();

    this.stream.getTracks().forEach((track) => track.stop());
    if (this.audioContext) await this.audioContext.close();

    this.recorder = null;
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;

    return blob;
  }
}

export const audioRecorder = new AudioRecorder();
