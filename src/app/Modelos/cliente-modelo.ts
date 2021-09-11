// Para presentar artículos en el componente
export class ClienteVista {
	id: string;  // clave en Calipso
	codigo: string;
	nombre: string;
	domicilio: string;

	constructor() {
		const nd = '<No Disponible>';
		this.id = '';
		this.codigo = nd;
		this.nombre = nd;
		this.domicilio = nd;
	}

	parseData(data: ClienteData) {
		this.id = data.id;
		this.codigo = data.codigo;
		this.nombre = data.nombre;
		this.domicilio = data.domicilio;
	}
}

// Solicitud del registro Cliente
export class SolCliente {
	accion: string;
	rol: number;
	entidadId: string;

	id: string;
	//codigo: string;
}

// Respuesta recibida para Accion=Registro
export class RespCliente {
	bOk: boolean;
	mensaje: string;
	oRegistro: ClienteData;

	genClienteVista(): ClienteVista {
		const cv = new ClienteVista();
		cv.id = this.oRegistro.id;
		cv.codigo = this.oRegistro.codigo;
		cv.nombre = this.oRegistro.nombre;
		cv.domicilio = this.oRegistro.domicilio;

		return cv;
	}
}

export class ClienteData {
	id: string;
	codigo: string;
	nombre: string;
	domicilio: string;
}

export class ClienteFiltro {
	codigo: string;
	nombre: string;
	domicilio: string;

	constructor(agrComodin: boolean, codigo: string, nombre: string, domicilio: string) {

		if(agrComodin) {
			this.codigo= this.agrComodines(codigo);
			this.nombre= this.agrComodines(nombre);
			this.domicilio= this.agrComodines(domicilio);
		} else {
			this.codigo= codigo;
			this.nombre= nombre;
			this.domicilio= domicilio;
		}
	}

	asignar(filtro: ClienteFiltro):boolean {
		let bAsignado = false;

		//filtro.codigo= this.agrComodines(filtro.codigo);
		if (this.codigo !== filtro.codigo ) {
			bAsignado = true;
			this.codigo = filtro.codigo;
		}

		//filtro.nombre= this.agrComodines(filtro.nombre);
		if (this.nombre !== filtro.nombre ) {
			bAsignado = true;
			this.nombre = filtro.nombre;
		}

		//filtro.domicilio= this.agrComodines(filtro.domicilio);
		if (this.domicilio !== filtro.domicilio) {
			bAsignado = true;
			this.domicilio = filtro.domicilio;
		}

		return bAsignado;
	}

	agrComodines(cadena: string): string {
		if (!(cadena === null)) {
			if (!cadena.includes('%')) {
				const aSinValor = ['<Todos>', '<Todas>', ''];
				if (!aSinValor.includes(cadena)) {
					cadena = '%' + cadena + '%';
				} else {
					cadena = '%';
				}
			}
		} else {
			cadena = '%';
		}
		return cadena;
	}

	blanquear() {
		this.codigo= "";
		this.nombre= "";
		this.domicilio= "";
	}	
}
