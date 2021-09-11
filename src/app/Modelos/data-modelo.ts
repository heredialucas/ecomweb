import { DatePipe } from '@angular/common';

export class GeoData {
	bOk: boolean;
	fecha: Date;
	latitud: number;
	longitud: number;
	
	constructor() {
		this.bOk=false;
		this.fecha= new Date(2000,0, 1);
		this.latitud=0;
		this.longitud=0;
	}

	obtFecha(): string {
		const xx= new DatePipe("es-AR");
		return xx.transform(this.fecha,"yyyy-MM-dd HH:mm:ss");
	}
}
