import { DepositoData } from './deposito-modelo';
import { ViajanteData } from "./viajante-modelo";

/*** Respuesta correspondientes a Solicitudes */
export interface RespSesion {
	bOk: boolean;
	mensaje: string;
	usuario: SesionUsuario;
	aViajante: ViajanteData[];
	aDeposito: DepositoData[];
}

export class SesionUsuario {
	rol: number; // 1: Cliente, 2: Viajante; 0: Invitado (la apli nunca devuelve 0)
	entidadId: string;
	codigo: string;
	nombre: string;
	domicilio: string;
	depositoId: number;

	constructor() {
		this.rol=1;
		this.entidadId="";
		this.codigo="";
		this.nombre="";
		this.domicilio="";
		this.depositoId= -1; //Sin depósito.
	}
}
