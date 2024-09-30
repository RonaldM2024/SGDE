import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './pages/shared/shared.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { BehavierIdbRepository } from './features/persistence/behavierIdb-repository.service';

const dbConfig: DBConfig = {
  name: 'UserDb',
  version: 1,
  objectStoresMeta: [
    {
      store: 'user', 
      storeConfig: { keyPath: 'id', autoIncrement: true },  
      storeSchema: [  
        { name: 'email', keypath: 'email', options: { unique: true } },
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'roles', keypath: 'roles', options: { unique: false } },
        { name: 'estado', keypath: 'estado', options: { unique: false } },
        { name: 'nombre', keypath: 'nombre', options: { unique: false } },
        { name: 'apellido', keypath: 'apellido', options: { unique: false } },
        { name: 'cargo', keypath: 'cargo', options: { unique: false } },
      ]
    }
  ]
};

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    FormsModule,
    CommonModule,
    MatDatepickerModule
  ],
  providers: [
    BehavierIdbRepository  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
