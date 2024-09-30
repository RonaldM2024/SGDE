import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  constructor() { }

  generatePdf(content: string) {
    const doc = new jsPDF();
    doc.text(content, 10, 10);
    doc.save('document.pdf');
  }

  generatePdfWithImage(imageUrl: string, pdfName: string) {
    const doc = new jsPDF('p', 'mm', 'a4'); // Crear documento en tamaño A4

    this.getBase64ImageFromURL(imageUrl).then((base64Image) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
        doc.save(`${pdfName}.pdf`);
      };
    }).catch((error) => {
      console.error('Error converting image to base64:', error);
    });
  }

  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error('Failed to load image'));
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }
}
