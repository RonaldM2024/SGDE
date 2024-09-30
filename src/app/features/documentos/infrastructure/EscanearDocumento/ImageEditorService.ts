import { Injectable, ElementRef } from '@angular/core';
import Cropper from 'cropperjs';
import { ModelPhotoEditor } from '../../domain/Models/ModelPhotoEditor';

@Injectable({
    providedIn: 'root'
  })
  export class ImageEditorService implements ModelPhotoEditor {
    private cropper!: Cropper;
    private imageElement!: ElementRef;
    private scaleX: number = 1;
    private scaleY: number = 1;
  
    setImageElement(imageElement: ElementRef): void {
      this.imageElement = imageElement;
    }
  
    loadImage(imageFile: File): void {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imageElement.nativeElement.src = reader.result as string;
          this.initializeCropper();
        }
      };
      reader.readAsDataURL(imageFile);
    }
  
    private initializeCropper(): void {
      if (this.cropper) {
        this.cropper.destroy();
      }
  
      setTimeout(() => {
        this.cropper = new Cropper(this.imageElement.nativeElement, {
          aspectRatio: NaN,
          viewMode: 1,
          autoCropArea: 0.5,
          movable: true,
          rotatable: true,
          scalable: true,
          zoomable: true
        });
      }, 100);
    }
  
    rotateLeft(): void {
      if (this.cropper) {
        this.cropper.rotate(-45);
      }
    }
  
    rotateRight(): void {
      if (this.cropper) {
        this.cropper.rotate(45);
      }
    }
  
    flipX(): void {
      if (this.cropper) {
        this.scaleX = -this.scaleX;
        this.cropper.scaleX(this.scaleX);
      }
    }
  
    flipY(): void {
      if (this.cropper) {
        this.scaleY = -this.scaleY;
        this.cropper.scaleY(this.scaleY);
      }
    }
  
    downloadCroppedImage(): void {
      if (this.cropper) {
        const croppedCanvas = this.cropper.getCroppedCanvas();
        const croppedImage = croppedCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = croppedImage;
        link.download = 'cropped-image.png';
        link.click();
      }
    }
  
    destroy(): void {
      if (this.cropper) {
        this.cropper.destroy();
      }
    }
  }