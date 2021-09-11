import { ClienteFiltro } from './cliente-modelo';
// Para presentar artículos en el componente
export class ClienteListaVista {
	id: string;
  codigo: string;
  nombre: string;
  domicilio: string;
}

// Solicitud de ClienteLista
export class SolClienteLista {
	accion: string;
	rol: number;
	entidadId: string;
  codigo: string;
  nombre: string;
	domicilio: string;
	
	asigFiltro(filtro: ClienteFiltro): void {
		this.codigo= filtro.codigo;
		this.nombre= filtro.nombre;
		this.domicilio= filtro.domicilio;
	} 
}

// Respuesta recibida desde el Servidor
export class RespClienteLista {
  bOk: boolean;
  mensaje: string;
  aLista: ClienteListaVista[];
}

