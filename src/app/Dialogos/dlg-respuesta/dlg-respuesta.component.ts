import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DlgRespuestaData {
	titulo: string;
	mensaje: string;
	iBoton: number;
}

@Component({
  selector: 'app-dlg-respuesta',
  templateUrl: './dlg-respuesta.component.html',
  styleUrls: ['./dlg-respuesta.component.scss']
})
export class DlgRespuestaComponent implements OnInit {
	titulo='';
	mensaje='';
	//iBoton= 0; //si/no
	//iDefecto= 0;
	aBoton: string[];

  constructor(
    public dialogRef: MatDialogRef<DlgRespuestaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DlgRespuestaData) {

		this.titulo= data.titulo;
		this.mensaje= data.mensaje;

		this.aBoton= new Array<string>();
		if(data.iBoton == undefined) data.iBoton= 0b001;

		if(data.iBoton == 1) {
			this.aBoton.push("Si");
			this.aBoton.push("No");
		}
		if(data.iBoton ==  2) {
			this.aBoton.push("Aceptar");
			this.aBoton.push("Cancelar");
		}
		if(data.iBoton == 3) {
			this.aBoton.push("Ok");
			this.aBoton.push("Cancelar");
		}

	}
  ngOnInit(): void {
  }

}
