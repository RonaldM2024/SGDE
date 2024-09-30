import { ModelPhotoEditor } from "../../domain/Models/ModelPhotoEditor";

export class EditPhoto {
  private photoEditor: ModelPhotoEditor;

  constructor(photoEditor: ModelPhotoEditor) {
    this.photoEditor = photoEditor;
  }

  public loadImage(imageFile: File): void {
    this.photoEditor.loadImage(imageFile);
  }

  public rotateLeft(): void {
    this.photoEditor.rotateLeft();
  }

  public rotateRight(): void {
    this.photoEditor.rotateRight();
  }

  public flipX(): void {
    this.photoEditor.flipX();
  }

  public flipY(): void {
    this.photoEditor.flipY();
  }

  public downloadCroppedImage(): void {
    this.photoEditor.downloadCroppedImage();
  }
}
