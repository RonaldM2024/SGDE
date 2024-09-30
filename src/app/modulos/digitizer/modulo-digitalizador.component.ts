import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TipoDocumento } from 'src/app/features/documentos/domain/ValueObject/TipoDocumento';
import { TesseractModelOCR } from 'src/app/features/documentos/infrastructure/EscanearDocumento/TesseractModelOCR.service';
import { CiDetectionService } from 'src/app/features/documentos/infrastructure/servicios/DeteccionInformacionEgresado/ci-detection.service';
import { NameDetectionService } from 'src/app/features/documentos/infrastructure/servicios/DeteccionInformacionEgresado/name-detection.service';
import { SurnameDetectionService } from 'src/app/features/documentos/infrastructure/servicios/DeteccionInformacionEgresado/surname-detection.service';
import { FirestoreDocumentoRepositoryService } from 'src/app/features/documentos/infrastructure/servicios/Firebase/firestore-documento-repository.service';
import { FirestoreStorageService } from 'src/app/features/documentos/infrastructure/servicios/Firebase/firestore-storage.service';
import { FirestoreEgresadoRepository } from 'src/app/features/egresado/infrastructure/FirestoreEgresadoRepository';
import { EditImgDialogComponent } from './edit-img-dialog/edit-img-dialog.component';
import { CamaraDialogComponent } from './camara-dialog/camara-dialog.component';
import { combineLatest, switchMap, take } from 'rxjs';
import { Egresado } from 'src/app/features/egresado/domain/Egresado';
import { Cedula } from 'src/app/features/egresado/domain/ValueObject/Cedula';
import { NombreCompleto } from 'src/app/features/egresado/domain/ValueObject/NombreCompleto';
import { Documento } from 'src/app/features/documentos/domain/Documento';
import { isValidCI } from 'src/app/features/egresado/domain/ValueObject/validateCI';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';
import { DialogConfirmationComponent } from 'src/app/pages/shared/dialog-confirmation/dialog-confirmation.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-modulo-digitalizador',
  templateUrl: './modulo-digitalizador.component.html',
  styleUrls: ['./modulo-digitalizador.component.css']
})
export class ModuloDigitalizadorComponent {
  @HostListener('window:resize', ['$event'])
  @ViewChild('fileInput') fileInput!: ElementRef;
  private fileReader!: FileReader; // Almacena la instancia de FileReader
  private mobileMaxWidth = 768;
  
  isDesktop!: boolean; // Manejo de tipo de dispositivo
  newFile: any = '';
  statusImage = false; // Indica cuando la imagen ha sido cargada o no
  text: string | null = null; // Almacena el texto extraído de la imagen
  isLoading: boolean = false; // Indica si el OCR está en progreso
  error: string | null = null; // Almacena los mensajes de error
  selectedFile: File | null = null;
  inputText: string = ''; // Almacena el texto ingresado por el usuario
  detectedNames: string[] = []; // Almacena los nombres detectados
  detectedSurnames: string[] = []; // Almacena los apellidos detectados
  detectedCIs: string[] = []; // Almacena las cédulas detectadas
  concatNames!: string;
  studentForm!:FormGroup;
  selectedId!: any;
  newTipoDocumento = '';
  tiposDocumentos = TipoDocumento.tiposValidos;
  selectedNames: string[] = [];
  selectedLastNames: string[] = [];
  showSpinner: boolean = false;
  toastr: any;
  btnEnabled: boolean = true;
  loadingSave: boolean = false;

  constructor(
    private dialog: MatDialog,
    private tesseractService: TesseractModelOCR,
    private nameDetectionService: NameDetectionService,
    private surnameDetectionService: SurnameDetectionService,
    private ciDetectionService: CiDetectionService,
    private fb: FormBuilder,
    private egresadoRepository: FirestoreEgresadoRepository,
    private documentoRepository: FirestoreDocumentoRepositoryService,
    private storageService: FirestoreStorageService,
    private _toastr: ToastrService,
    private logRepository: FirestoreLogRepositoryService, // Inyecta el servicio de registro de logs
  ) { 
    this.studentForm = this.fb.group({
      ci: '', // CI field with validation
      nombres: ['', Validators.required], // Nombres field with validation
      apellidos: ['', Validators.required], // Apellidos field with validation
      tipoDocumento: ['Seleccionar Documento', Validators.required] // Tipo de documento with default value and validation
    });

  }

  // Método que se ejecuta al iniciar el componente Scanner
  ngOnInit(): void {
    // Carga los nombres y apellidos desde archivos CSV
    this.nameDetectionService.loadNames('/assets/nombres.csv').subscribe(); // Carga nombres
    this.surnameDetectionService.loadSurnames('/assets/apellidos.csv').subscribe(); // Carga apellidos
    this.checkDeviceType();

    const date = new Date();
    console.log(date);
  }
  
  // Método que se ejecuta al redimensionar la ventana
  onResize(event: Event): void {
    this.checkDeviceType();
  }

  // Método para verificar el tipo de dispositivo
  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > this.mobileMaxWidth;
    console.log('Updated device type:', this.isDesktop ? 'desktop' : 'mobile');
  }

  //Metodo para subir archivo y cargarlo en la etiqueta img
  onFileSelected(event: any) {
    //this.loading = false; 
    const file = event.target.files[0];
    const type = file.type;
    const imagePreviewElement = document.getElementById('imageDoc');
    //Validamos si se subió un archivo en formato correcto
    if (type !== 'image/png' && type !== 'image/jpeg') {
    }else{
      this.statusImage = true;  
      //Porcedemos a cargar la imagen
      if (imagePreviewElement) {
        this.newFile = event.target.files[0];
        const objectURL = URL.createObjectURL(this.newFile);
        const imgElement = imagePreviewElement as HTMLImageElement;
        imgElement.src = objectURL;
        this.newFile = objectURL;
        this.selectedFile = file;
        this._toastr.success("Imagen cargada con éxito","SGDE");
      } else {
        this._toastr.error("Error al cargar imagen!","SGDE");
      }
    }
  }

  //Metodo para abrir el input de tipo file
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  //Abrimos Modal para la agrandar la imagen
  openDialogPicture(enterAnimationDuration: string, exitAnimationDuration: string){
    const imageUrl = this.newFile;

    const dialogRef = this.dialog.open(EditImgDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      width: this.isDesktop ? "650px" : "auto",
      height: "auto",
      enterAnimationDuration,
      exitAnimationDuration,
      data: { imageUrl },  
    });

    // Maneja el valor de retorno aquí para la imagen agrandada o editada
    dialogRef.afterClosed().subscribe((result: string | null) => {
      if (result) {
        this.newFile = result;
        this.btnEnabled = true;
        // Convertir la URL de datos a un objeto File
        fetch(result)
          .then(res => res.blob())
          .then(blob => {
            this.selectedFile = new File([blob], 'edited_image.png', { type: 'image/png' });
          })
          .catch(error => console.error('Error al convertir la imagen en un archivo:', error));
      }
    });
  }

  // Método que se ejecuta al hacer clic en el botón "Analizar"
  onAnalyzeClick() {
    if (this.selectedFile) {
      this.isLoading = true; // Indica que el OCR está en progreso
      this.analyzeImage(this.selectedFile); // Llama al método para analizar la imagen
    } else {
      this.error = 'Por favor, seleccione una imagen antes de analizar.'; // Muestra un mensaje de error si no hay una imagen seleccionada
    }
  }

  // Método para analizar la imagen
  analyzeImage(file: File) {
    this.showSpinner = true;
    this.fileReader = new FileReader(); // Crea una nueva instancia de FileReader
    this.fileReader.onload = () => {
      this.tesseractService.extraerTextoDeImagen(this.fileReader.result as string) // Llama al servicio Tesseract para extraer texto de la imagen
        .then(result => {
          this.text = result ; 
          this.getDetails(this.text);// Almacena el texto extraído
          this.showSpinner = false; // Indica que el OCR ha terminado
        })
        .catch(error => {
          console.error(error); // Muestra el error en la consola
          this.error = 'Error al reconocer el texto'; // Muestra un mensaje de error
          this.showSpinner = false; // Indica que el OCR ha terminado con un error
        });
    };
    this.fileReader.readAsDataURL(file); // Lee el archivo como una URL de datos
  }

  // Método que se ejecuta al destruir el componente
  ngOnDestroy() {
    // Limpiar el lector de archivos si aún está en uso
    if (this.fileReader) {
      this.fileReader.abort(); // Aborta cualquier lectura de archivo en progreso
    }
  }

  openConfirmationDialog(): void {
    const title = "¿Está seguro de guardar los cambios?";
    const description = "Una vez guardados los cambios no se podrán editar, excepto por un administrador.";
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '350px',
      data: {title, description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.registrarEgresado();
      }
    });
  }

  //Modal para capturar imagen con la camara
  openCameraDialog(enterAnimationDuration: string, exitAnimationDuration: string){

    //Abrimos el dialogo de la camara en base al tipo de dispositivo Desktop
    if(this.isDesktop){
      this.dialog.open(CamaraDialogComponent, {
        disableClose: true,
        hasBackdrop: true,
        autoFocus: false,
        width: "750px",
        height: "auto",
        enterAnimationDuration,
        exitAnimationDuration,
      }).afterClosed().subscribe(result => {
        if(result !== null){
          this.onFileCameraSelected(result) // Maneja el valor de retorno aquí
        }
      });
    }else{
      this.dialog.open(CamaraDialogComponent, {
        disableClose: true,
        hasBackdrop: true,
        autoFocus: false,
        width: "auto",
        height: "auto",
        enterAnimationDuration,
        exitAnimationDuration,
      }).afterClosed().subscribe(result => {
        if(result !== null){
          this.onFileCameraSelected(result) // Maneja el valor de retorno aquí
        }
      });
    }
  }

  //Cambiar estado cuando se quiere reiniciar todos los valores de los input y la imagen.
  changedStatus(){
    this.statusImage = false;
    this.selectedNames = [];
    this.detectedNames = [];
    this.detectedSurnames = [];
    this.selectedLastNames= [];
    this.studentForm.reset();
    this.newFile = '';
  }

  // Método para obtener los detalles (nombres, apellidos y cédulas) del texto ingresado
  getDetails(text: any): void {
    // Detecta nombres y elimina duplicados
    const names = this.nameDetectionService.detectNames(text);
    this.detectedNames = [...new Set(names)]; // Convierte a Set para eliminar duplicados y luego a Array

    // Detecta apellidos y elimina duplicados
    const surnames = this.surnameDetectionService.detectSurnames(text);
    this.detectedSurnames = [...new Set(surnames)]; // Convierte a Set para eliminar duplicados y luego a Array

    // Detecta cédulas y elimina duplicados
    const cis = this.ciDetectionService.detectCIs(text);
    this.detectedCIs = [...new Set(cis)]; // Convierte a Set para eliminar duplicados y luego a Array

    // Establece el valor de la cédula en el formulario, asumiendo que solo hay una cédula válida
    if(this.detectedCIs){
      this.studentForm.get("ci")?.setValue(this.detectedCIs);
    }
  }

  onFileCameraSelected(imagePath: string) {
      this.newFile = imagePath;
      this.statusImage = true;
      // Convertir la ruta de la imagen en un objeto File y asignarlo a selectedFile
      fetch(imagePath)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'captured_image.png', { type: 'image/png' });
        this.selectedFile = file;
      })
      .catch(error => console.error('Error al convertir la imagen en un archivo:', error));
  } 
  
  

  registrarEgresado() {
    this.loadingSave = true;
    if (this.studentForm.valid) {
      // Obtener las variables del formulario
      const nombres = this.studentForm.get('nombres')?.value;
      const apellidos = this.studentForm.get('apellidos')?.value;
      const cedula = this.studentForm.get('ci')?.value;

      // Obtener el ID del egresado y validar si existe una cédula
      if (cedula && typeof cedula === 'string' && cedula.trim() !== '') {
          // Validar que la cédula sea correcta
          if (!isValidCI(cedula)) {
              console.log(isValidCI(cedula));
              this._toastr.error('Formulario inválido, la cédula digitada es incorrecta');
          } else {
              // Validar si el egresado con esta cédula existe
              console.log("> 1");
              this.egresadoRepository.consultarEgresadoPorCedula(new Cedula(cedula)).pipe(take(1)).subscribe(egresadoCedula => {
                  console.log("> 2");
                  if (egresadoCedula) { // Cédula Existe
                      console.log("> 3");
                      if (egresadoCedula.id !== null) { // Evita el error de enviar una cédula nula
                          console.log("> 4");
                          this.createDocumento(egresadoCedula.id);
                          this.loadingSave = false;
                      }
                  } else { // Cédula No existe, por tanto se crea un nuevo egresado
                      console.log("Esta cédula no pertenece a ningún Egresado, se registrará uno nuevo");
                      console.log("> A3");
                      // Crear un nuevo egresado con la nueva cédula detectada
                      const nuevoEgresado = new Egresado(
                          null,
                          new Cedula(cedula),
                          new NombreCompleto(nombres, apellidos)
                      );
                      console.log("Se crea el egresado");
                      console.log(nuevoEgresado)
                      this.egresadoRepository.registrarEgresado(nuevoEgresado).then((egresadoId: string) => {
                          console.log('Egresado registrado con éxito');
                          console.log("> A4");
                          this.createDocumento(egresadoId);
                          this.loadingSave = false;
                      }).catch(error => {
                          console.error('Error al registrar el egresado:', error);
                          this.loadingSave = false;
                      });
                  }
              });
          }
      } else {
          console.log("No existe cédula");
          /// Validación de nombres completos aquí
          this.egresadoRepository.consultarEgresadoPorNombreCompleto(nombres, apellidos).pipe(take(1)).subscribe(egresadoNombreCompleto => {
            if (egresadoNombreCompleto) {
                // Si existe un egresado con el mismo nombre completo y el ID no es nulo
                if (egresadoNombreCompleto.id) {
                    console.log("Egresado encontrado por nombre completo, ID: ", egresadoNombreCompleto.id);
                    this.createDocumento(egresadoNombreCompleto.id);
                    this.loadingSave = false;
                } else {
                    console.error('El egresado encontrado no tiene un ID válido.');
                }
            } else {
                // Crear un nuevo egresado
                const nuevoEgresado = new Egresado(
                    null,
                    null, // Sin cédula
                    new NombreCompleto(nombres, apellidos)
                );
                console.log("Se crea el egresado");
                this.egresadoRepository.registrarEgresado(nuevoEgresado).then((egresadoId: string) => {
                    console.log('Egresado registrado con éxito');

                    console.log("> A4");

                    this.createDocumento(egresadoId);
                    this.loadingSave = false;
                }).catch(error => {
                    console.error('Error al registrar el egresado:', error);
                    this.loadingSave = false;
                });
            }
        });
      }

  } else {
      Object.keys(this.studentForm.controls).forEach(field => {
          const control = this.studentForm.get(field);
          control!.markAsTouched({ onlySelf: true });
      });
      this.loadingSave = false;
      this._toastr.error('Formulario inválido, campos no pueden estar vacíos');
  }
  }

  //Metodo para crear un documento en Firestore
  createDocumento(egresadoId: string ): void {
    console.log("> 5 - A5")
    if (this.selectedFile) {
      const nuevoDocumento = new Documento(
        '', // ID se genera automáticamente en el servicio
        egresadoId,
        new TipoDocumento(this.newTipoDocumento),
        this.text!,
        ''
      );
      console.log("> 6 - A6")
      console.log(nuevoDocumento)
      this.documentoRepository.createDocumento(nuevoDocumento, this.selectedFile).then(() => {
        console.log("> 7 - A7")

        // Llamar al método para registrar el log
        this.logRepository.registrarAccion(
          TipoModulo.MODULO_DIGITALIZADOR, 
          "Creación de documento", 
          `Documento creado para el egresado con ID: ${egresadoId}`
        )

        this._toastr.success('Documento creado con éxito');
        this.loadingSave = false;
        console.log('Documento creado con éxito.');
        this.changedStatus();
      }).catch(error => {
        this._toastr.error('Error al crear el documento');
        this.loadingSave = false;
      });
    } else {
      console.error('No se ha seleccionado ninguna imagen.');
      this.loadingSave = false;
    }
  }
    
  selectName(name: string) {
    const index = this.selectedNames.indexOf(name);
    if (index >= 0) {
      this.selectedNames.splice(index, 1); // Deselect if already selected
    } else {
      this.selectedNames.push(name); // Add to selected names if not selected
    }
    this.studentForm.get('nombres')?.setValue(this.selectedNames.join(' '));
  }

  selectLastName(name: string) {
    const index = this.selectedLastNames.indexOf(name);
    if (index >= 0) {
      this.selectedLastNames.splice(index, 1); // Deselect if already selected
    } else {
        this.selectedLastNames.push(name); // Add to selected names if not selected
      }
    this.studentForm.get('apellidos')?.setValue(this.selectedLastNames.join(' '));
  }
    
  
  
  // Sube la imagen seleccionada a Cloud Storage
  uploadImage(): void {
    if (this.selectedFile) {
      const filePath = `${this.selectedFile.name}`; // Define la ruta del archivo en Cloud Storage
      const date = new Date();
      this.storageService.uploadImage(filePath + '_' + date, this.selectedFile).subscribe(url => {
        console.log('Image uploaded, URL:', url); // Muestra la URL de la imagen subida en la consola/ Recarga las imágenes después de subir una nueva
      });
    }
  }

  toUpperCase(controlName: string): void {
    const control = this.studentForm.get(controlName);
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }
}
