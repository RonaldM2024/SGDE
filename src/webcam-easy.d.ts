declare module 'webcam-easy' {
    export default class Webcam {
      constructor(videoElement: HTMLVideoElement, facingMode: string, canvasElement?: HTMLCanvasElement, snapSoundElement?: HTMLAudioElement);
      start(): Promise<void>;
      stop(): void;
      snap(): string;
      flip(): void;
    }
  }