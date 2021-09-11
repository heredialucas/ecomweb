import { DataService } from './data.service';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InicioComponent } from './inicio/inicio.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { ArticuloListaComponent } from './articulo-lista/articulo-lista.component';
import { ArticuloFiltroComponent } from './articulo-filtro/articulo-filtro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticuloComponent } from './articulo/articulo.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ClienteLstComponent } from './cliente-lst/cliente-lst.component';
import { ClienteFiltroComponent } from './cliente-filtro/cliente-filtro.component';
import { PedidoComponent } from './pedido/pedido.component';
import { SesionComponent } from './sesion/sesion.component';
import { HttpClientModule } from '@angular/common/http';
import { DpDatePickerModule } from 'ng2-date-picker'
//import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAR from '@angular/common/locales/es-AR';
import { ViajanteComponent } from './viajante/viajante.component';
import { VerSesionComponent } from './ver-sesion/ver-sesion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DlgGenericoComponent } from './Dialogos/dlg-generico/dlg-generico.component';
import { ViaDocInfoComponent } from './via-doc-info/via-doc-info.component';
import { DlgMensajeComponent } from './Dialogos/dlg-mensaje/dlg-mensaje.component';
import { UsuGestionComponent } from './usu-gestion/usu-gestion.component';

import { MatInputModule }  from '@angular/material/input';
//import { MatDatepickerModule } from '@angular/material/datepicker';
//import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DlgRespuestaComponent } from './Dialogos/dlg-respuesta/dlg-respuesta.component';

//import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

registerLocaleData(localeEsAR, 'es-Ar');

@NgModule({
	declarations: [
		AppComponent,
		InicioComponent,
		ArticuloListaComponent,
		ArticuloFiltroComponent,
		ArticuloFiltroComponent,
		ArticuloComponent,
		ClienteComponent,
		ClienteLstComponent,
		ClienteFiltroComponent,
		PedidoComponent,
		SesionComponent,
		ViajanteComponent,
		VerSesionComponent,
		DlgGenericoComponent,
		ViaDocInfoComponent,
		DlgMensajeComponent,
		UsuGestionComponent,
		DlgRespuestaComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FontAwesomeModule,
		FormsModule, ReactiveFormsModule,
		HttpClientModule,
		DpDatePickerModule,
		BrowserAnimationsModule,
		//MatNativeDateModule, MatDatepickerModule,
		MatDialogModule, MatButtonModule, MatInputModule,
	],
	providers: [
		DataService,
		{ provide: LOCALE_ID, useValue: "es-AR" },
		//{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }}
	],
	bootstrap: [AppComponent],
	entryComponents: [DlgGenericoComponent]
})
export class AppModule {
	constructor(library: FaIconLibrary) {
		// library.addIcons(faCoffee);
		library.addIconPacks(fas, far, fab);
	}
}
