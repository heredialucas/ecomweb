import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DlgMensajeData {
	titTexto: string;
	titGrafico: number;
	mensaje: string;
	botRotulo: string;
}

@Component({
  selector: 'app-dlg-mensaje',
  templateUrl: './dlg-mensaje.component.html',
  styleUrls: ['./dlg-mensaje.component.scss']
})
export class DlgMensajeComponent implements OnInit {
	titGrafico: number;
	titTexto: string;
	mensaje: string;
	botRotulo: string;

	aTitGrafico= new Array(
		['fas', 'times-circle'],
		['fas', 'laugh-wink']
	)

  constructor(
		public dialogRef: MatDialogRef<DlgMensajeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DlgMensajeData) {

		this.titGrafico= data.titGrafico;
		this.titTexto= data.titTexto;
		this.mensaje= data.mensaje;
		this.botRotulo= data.botRotulo
	 }

  ngOnInit(): void {
  }

}
