import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DlgGenericoData {
	iBoton: number;
	titulo: string;
	mensaje: string;
}

@Component({
  selector: 'app-dlg-generico',
	templateUrl: './dlg-generico.component.html'
	//,  styleUrls: ['./dlg-generico.component.scss']
})
export class DlgGenericoComponent implements OnInit {
	titulo='';
	mensaje='';
	iBoton= 0; //si/no
	iDefecto= 0;
	aBoton: string[];

  constructor(
    public dialogRef: MatDialogRef<DlgGenericoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DlgGenericoData) {

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
