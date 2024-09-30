export interface ModelPhotoEditor {
    loadImage(imageFile: File): void;
    rotateLeft(): void;
    rotateRight(): void;
    flipX(): void;
    flipY(): void;
    downloadCroppedImage(): void;
  }
  