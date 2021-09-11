/*
import { Resp}
import { JsonPipe } from '@angular/common';
import { ArticuloVistaModStock } from './../Modelo/articulo-modelo';
*/

export class RespViajanteLista {
	bOk: boolean;
	mensaje: string;
	aLista: ViajanteData[];
}

export class ViajanteData {
	id: string; // id en Calipso
	codigo: string;
	nombre: string;
	depositoId: number;
}

export class ViajanteVista {
	id: string; // id en Calipso
	codigo: string;
	nombre: string;
	depositoId: number;

	constructor() {
		this.id='';
		this.codigo='ND';
		this.nombre= 'No Disponible';
		this.depositoId= 3; //Tucumán
	}

	parseData(data: ViajanteData) {
		this.id= data.id;
		this.codigo= data.codigo;
		this.nombre= data.nombre;
		this.depositoId= data.depositoId
	}
}

