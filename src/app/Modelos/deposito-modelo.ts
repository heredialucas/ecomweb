export class DepositoData {
	id: number;
	codigo: string;
	nombre: string;
	
	constructor() {
		this.id=0;
		this.codigo="";
		this.nombre=""
	}
}

export class DepositoVista {
	id: number; // id en aplicacion
	codigo: string;
	nombre: string;

	constructor() {
		this.id=0;
		this.codigo='ND';
		this.nombre= 'No Disponible';
	}

	parseData(data: DepositoData) {
		this.id= data.id;
		this.codigo= data.codigo;
		this.nombre= data.nombre;
	}
}