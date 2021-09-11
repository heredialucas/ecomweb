// Para presentar artículos en el componente
export class ArticuloListaVista {
	id: number;
	codigo: string;
	descripcion: string;
	rubro: string;
	subrubro: string;
	precio: number;  // precio de lista sin iva
}

export class ArticuloFiltro {
	codigo: string;
	descrip: string;
	rubro: string;
	subrubro: string;

	constructor(agrComodin: boolean, rubro: string, subrubro: string, descrip: string, codigo: string) {
		if(agrComodin) {
			this.rubro= this.agrComodines(rubro);
			this.subrubro= this.agrComodines(subrubro);
			this.descrip= this.agrComodines(descrip);
			this.codigo= this.agrComodines(codigo);
	
		} else {
			this.rubro = rubro;
			this.subrubro = subrubro;
			this.descrip = descrip;
			this.codigo = codigo;
		}
	}

	detAccion(filtro: ArticuloFiltro): string {
		let cAccion="";

		if(filtro.codigo===undefined && filtro.rubro===undefined && filtro.subrubro === undefined) {
			cAccion= 'Lista';
		} else {
			cAccion= 'ListaPorFiltro';
		}

		return cAccion;
	}

	asignar(filtro: ArticuloFiltro): boolean {
		let bAsignado = false;

		filtro.codigo= this.agrComodines(filtro.codigo);
		if (this.codigo !== filtro.codigo ) {
			bAsignado = true;
			this.codigo = filtro.codigo;
		}

		filtro.descrip= this.agrComodines(filtro.descrip);
		if (this.descrip !== filtro.descrip ) {
			bAsignado = true;
			this.descrip = filtro.descrip;
		}

		filtro.rubro= this.agrComodines(filtro.rubro);
		if (this.rubro !== filtro.rubro) {
			bAsignado = true;
			this.rubro = filtro.rubro;
		}

		filtro.subrubro= this.agrComodines(filtro.subrubro);
		if (this.subrubro !== filtro.subrubro) {
			bAsignado = true;
			this.subrubro = filtro.subrubro;
		}

		return bAsignado;
	}

	agrComodines(cadena: string): string {
		if (!(cadena == null)) {
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
		this.rubro = "";
		this.subrubro = "";
		this.descrip = "";
		this.codigo = "";
	}


}

// Solicitud de ArtículosLista
export class SolArticuloLista {
	accion: string;
	rol: number;
	entidadId: string;
	codigo: string;
	descrip: string;
	rubro: string;
	subrubro: string;

	asigFiltro(filtro: ArticuloFiltro) {
		this.codigo = filtro.codigo;
		this.descrip = filtro.descrip;
		this.rubro = filtro.rubro;
		this.subrubro = filtro.subrubro;
	}
}

// Respuesta recibida desde el Servidor
export class RespArticuloLista {
	bOk: boolean;
	mensaje: string;
	aLista: ArticuloListaVista[];
}