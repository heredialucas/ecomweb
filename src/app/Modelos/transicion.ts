export class Transicion {
	iPreparado: number; //0: No preparado, 1: Preparado exitoso, 10: Preparado con advertencias, 100: preparando
	mensaje: string;
	masDetalle: string;

	constructor() {
		this.iPreparado= 0;
		this.mensaje="";
		this.masDetalle="";
	}

	iniciar(mensaje: string) {
		this.iPreparado= 100;
		this.mensaje= mensaje;
	}

	esMostrable(): boolean {
		return this.iPreparado== 100 || this.mensaje >'';
	}

	estaPreparando(): boolean {
		return this.iPreparado==100;
	}

	estaPreparado(): boolean {
		return this.iPreparado==1 || this.iPreparado== 10;
	}

	finalizar(iFin: number, mensaje: string, detalle:string) {
		this.iPreparado= iFin;
		this.mensaje= mensaje;
		this.masDetalle= detalle;
	}

	finalizarOk() {
		this.iPreparado=1;
		this.mensaje="";
	}

	finalizarConError(mensaje: string, detalle: string) {
		this.iPreparado= 0;
		this.mensaje= mensaje;
		this.masDetalle= detalle;
	}
}
