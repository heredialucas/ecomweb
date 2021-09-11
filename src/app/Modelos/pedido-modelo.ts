import { DepositoData, DepositoVista } from './deposito-modelo';
//import { DataService } from './../data.service';
import { ClienteVista } from './cliente-modelo';
import { ViajanteData, ViajanteVista } from "./viajante-modelo";
import { DatePipe } from '@angular/common';

// Para presentación en el Componente
export class PedidoVista {
	id: number;
	fecha: Date;
	oCliente: ClienteVista;
	oViajante: ViajanteVista;
	oDeposito: DepositoVista;

	// oDeposito
	aArt: PedidoVistaArticulo[];
	estado: number; // 0: en confeccion, 1: Solicitado (no se puede modificar)
	estadoDB: number; //0: en confeccion, 1: Solicitado (no se puede modificar), estado registrado en la DB.
	obs: string;
	operador: number; // 0: Nada, 1: insert, 2: update; 3 delete
	
	hayCambios: boolean;

	constructor() {
		this.id = 0;
		this.fecha = new Date();
		this.oCliente = new ClienteVista();
		this.oViajante = new ViajanteVista();
		this.oDeposito= new DepositoVista();
		this.aArt = new Array<PedidoVistaArticulo>();
		this.obs='';
		this.estado = 0;
		this.estadoDB= 0;
		this.operador = 1;
		this.hayCambios= false;
	}

	genSolRegistro(rol: number, usuario: string, pedidoId:number, entidadId: string): SolPedidoRegistro {
		const spr= new SolPedidoRegistro();
		spr.accion="Registro";
		spr.pedidoId= pedidoId;
		spr.rol= rol;
		spr.usuario= usuario;
		spr.entidadId= entidadId;

		return spr;
	}

	genSolRegistrar(): SolPedidoRegistrar {
		const spr = new SolPedidoRegistrar();
		spr.oRegistro = new SolPedidoRegistrarPedido();
		spr.oRegistro.id = this.id;
		//console.log(this.fecha);
		spr.oRegistro.fecha = this.fecha.toISOString().slice(0, 19).replace('T', ' ');
		spr.oRegistro.clienteId = this.oCliente.id;
		spr.oRegistro.viajanteId= this.oViajante.id;
		spr.oRegistro.depositoId= this.oDeposito.id;
		spr.oRegistro.operador = this.operador;
		spr.oRegistro.aArt = new Array<SolPedidoRegistrarArticulo>();
		spr.oRegistro.estado = this.estado;
		spr.oRegistro.obs= this.obs;
		this.aArt.forEach(element => {
			if (element.operador==1 && element.id== 0
				|| element.operador==2 && element.id >0 
				|| element.operador==3 && element.id >0) {
				spr.oRegistro.aArt.push(element.genPedidoRegistrarArticulo());
			}
		});
		return spr;
	}

	parseRespuesta(data: RespPedido, rol: number): boolean {
		let bOk = false;
		bOk = 
			rol==1 && this.oCliente.id.toUpperCase() === data.oRegistro.oCliente.id.toUpperCase() 
			|| rol==2 
			|| rol==8;
		// validar ademas: viajante y deposito
		// validar cantidad artículos
		// validar monto
		if (bOk) {
			this.id = data.oRegistro.id;
			this.fecha = this.parseFecha(data.oRegistro.fecha);  // Desde php y mysql, vuelve como un string, ejemplo "2020-07-20 06:44:51"
			this.estado = data.oRegistro.estado;
			this.obs= data.oRegistro.obs;
			this.estadoDB= data.oRegistro.estado; //Mantiene el estado original del Pedido
			this.operador = 0; // Nada, está recien actualizado
			this.oCliente = new ClienteVista();
			this.oCliente.parseData(data.oRegistro.oCliente);
			this.oViajante = new ViajanteVista();
			this.oViajante.parseData(data.oRegistro.oViajante);
			this.oDeposito= new DepositoVista();
			this.oDeposito.parseData(data.oRegistro.oDeposito);

			this.aArt.length = 0;
			data.oRegistro.aArt.forEach(
				(item: PedidoArticuloData) => {
					const pva = new PedidoVistaArticulo();
					pva.parseRespuesta(item);
					if (this.estado === 0) {
						if (item.precio !== item.monto) { item.precio = item.monto; }
						pva.mensaje = 'Precio actualizado!!!';
					}
					this.aArt.push(pva);
				}
			);
		}

		return bOk;
	}

	parseFecha(cadFecha: string): Date {
		//cadFecha: yyyy-MM-dd HH:mm:ss
		//          0123456789012345678
		return new Date(
			parseInt(cadFecha.slice(0,4), 10),
			parseInt(cadFecha.slice(5,7), 10)-1,
			parseInt(cadFecha.slice(8,10), 10),
			parseInt(cadFecha.slice(11,13), 10),
			parseInt(cadFecha.slice(14,16), 10),
			parseInt(cadFecha.slice(17,19), 10)
		)
	}

}

export class PedidoVistaArticulo {
	id: number; // id en Tabla PedidoArticulo
	articuloId: string; // id de Articulo en Calipso
	codigo: string;
	descripcion: string;
	precio: number;
	iva: number;
	cantidad: number;
	operador: number; // 0: Nada, 1: insert, 2: update; 3 delete
	mensaje: string;

	constructor() {
		this.id=0;
		this.articuloId="";
		this.codigo="";
		this.descripcion="";
		this.precio=0.00;
		this.iva= 0.00;
		this.cantidad=0;
		this.operador=0;
		this.mensaje="";
	}

	esOculto(): boolean {
		return (this.operador === 3? true : false);
	}

	obtIvaMonto(): number {
		return this.precio * this.iva / 100;
	}

	obtPrecioTotal(): number {
		return (this.precio + this.obtIvaMonto()) * this.cantidad;
	}

	genPedidoRegistrarArticulo(): SolPedidoRegistrarArticulo {
		const spra = new SolPedidoRegistrarArticulo();
		spra.id = this.id;
		spra.articuloId = this.articuloId;
		spra.codigo = this.codigo;
		spra.descripcion = this.descripcion;
		spra.iva = this.iva;
		spra.precio = this.precio;
		spra.cantidad = this.cantidad;
		spra.operador = this.operador;
		return spra;
	}

	parseRespuesta(art: PedidoArticuloData) {
		this.id = art.id;
		this.articuloId= art.articuloId;
		this.codigo = art.codigo;
		this.descripcion = art.descripcion;
		this.iva = art.iva;
		this.precio = art.precio;
		this.cantidad = art.cantidad;
		this.mensaje = '';
		this.operador= 0;
	}
}

// Solicitud de Pedido (espera RespPedido)
export class SolPedido {
	accion = 'Registro';
	id: number;
	rol: string;
	Usuario: string;
}

// Solicitud de Registro un pedido (espera RespRegistrar)
export class SolPedidoRegistro {
	accion = 'Registro';
	usuario: string;
	rol: number;
	//
	pedidoId: number;
	//clienteId: string;
	entidadId: string;
}


// Solicitud de Registrar un pedido (espera RespRegistrar)
export class SolPedidoRegistrar {
	accion = 'Registrar';
	usuario: string;
	rol: number;
	oRegistro: SolPedidoRegistrarPedido;
}

export class SolPedidoRegistrarPedido {
	id: number;
	fecha: string;
	clienteId: string; //id en calipso
	viajanteId: string; //id en Calipso
	depositoId: number;
	aArt: SolPedidoRegistrarArticulo[];
	estado: number;
	obs: string;
	operador: number; // 0: Nada, 1: agregar, 2: actualizar
}

export class SolPedidoRegistrarArticulo {
	id: number; // id en Tabla PedidoArticulo
	articuloId: string; // id de Articulo en Calipso
	codigo: string;
	descripcion: string;
	precio: number;
	iva: number;
	cantidad: number;
	operador: number; // 0: Nada, 1: insert, 2: update; 3 delete
}

// Respuesta Pedido (causada por SolPedidoRegistrar y SolPedidoRegistro)
export class RespPedido {
	bOk: boolean;
	mensaje: string;
	oRegistro: PedidoData; // Devuelve todo el pedido, en formato de Data de la DB
}

// Registros crudos de la DB, contenidos en RespPedido
export class PedidoData {
	id: number;
	fecha: string; // Desde mysql, vuelve como una fecha ejemplo "2020-07-20 06:44:51"
	estado: number;
	obs: string;
	oCliente: PedidoClienteData;
	oViajante: ViajanteData;
	oDeposito: DepositoData;
	aArt: PedidoArticuloData[];
}

export class PedidoClienteData {
	id: string;
	codigo: string;
	nombre: string;
	domicilio: string;
}

export class PedidoViajanteData {
	id: string;
	codigo: string;
	nombre: string;
}

export class PedidoDepositoData {
	id: string;
	codigo: string;
	nombre: string;
}

export class PedidoArticuloData {
	id: number; // id en Tabla PedidoArticulo
	articuloId: string;
	codigo: string;
	descripcion: string;
	precio: number;
	iva: number;
	cantidad: number;
	monto: number;
}


export class PedidoFiltro {
	viajanteId: string;
	clienteId: string; //Rol viajante en ficha de Cliente (necesita enviar ClienteId)
	cliente: string;
	desde: Date;
	hasta: Date;
	estado: number;

	constructor(agrComodin: boolean, clienteId: string, cliente: string, viajanteId: string, desde: string, hasta: string) {
		let fecRef= new Date();
		fecRef.setHours(0,0,0);

		this.hasta= this.obtFechaDesdeCadena(hasta, fecRef);

		fecRef= new Date()
		fecRef.setHours(0,0,0);
		fecRef.setMonth(fecRef.getMonth()-3);
		fecRef.setDate(fecRef.getDate()+1);

		this.desde= this.obtFechaDesdeCadena(desde, fecRef);

		this.viajanteId='';
		this.clienteId='';
		this.estado= -1;

		if(agrComodin) {
			//this.clienteId= this.agrComodines(clienteId);
			this.cliente= this.agrComodines(cliente);
		} else {
			//
			this.cliente= cliente;
		}
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

	asignar(filtro: PedidoFiltro): boolean {
		let bCambio= false;
		if(this.desde!==filtro.desde) {
			this.desde= filtro.desde;
			bCambio= true;
		}
		if(this.hasta!==filtro.hasta) {
			this.hasta= filtro.hasta;
			bCambio= true;
		}
		if(this.clienteId!==filtro.clienteId) {
			this.clienteId= filtro.clienteId;
			bCambio= true;
		}
		if(this.cliente!==filtro.cliente) {
			this.cliente= filtro.cliente;
			bCambio= true;
		}
		if(this.estado!==filtro.estado) {
			this.estado= filtro.estado;
			bCambio= true;
		}

		return bCambio;
	}

	public asigFechaDesde(cadena: string ) {
		this.desde= this.obtFechaDesdeCadena(cadena, new Date('2000-01-01T00:00:00Z'));
	}
	public asigFechaHasta(cadena: string ) {
		this.hasta= this.obtFechaDesdeCadena(cadena, new Date());
	}

	obtFechaDesdeCadena(cadena: string, porDefecto: Date) {
		//cadena en formato: dd/MM/yyyy
		let fecha= porDefecto;
		if(!(cadena=== undefined || cadena===null)) {
			//fecha= new Date(cadena +"T00:00:00");
			/*
			fecha= new Date(
				parseInt(cadena.slice(6,10),10),
				parseInt(cadena.slice(3,5),10)-1,
				parseInt(cadena.slice(0,2),10)
			);
			*/
			fecha= new Date(
				cadena.slice(6,10) +"-"
				+cadena.slice(3,5) +"-"
				+cadena.slice(0,2)
				+"T00:00:00Z"
			);
		}

		return fecha;
	}

	obtDesdeCadena(): string {
		const xx= new DatePipe("es-AR");
		return xx.transform(this.desde,"dd/MM/yyyy");

	}
	
	obtHastaCadena(): string {
		const xx= new DatePipe("es-AR");
		return xx.transform(this.hasta,"dd/MM/yyyy");
	}

	genSolicitud(accion: string) {
		let solicitud: string;
		switch(accion) {
			case "Lista":
				const xx= new DatePipe("es-AR");
				let hasta= this.hasta;
				hasta.setDate(hasta.getDate()+1);

				solicitud= JSON.stringify({
					accion: "Lista",
					desde: xx.transform(this.desde,"yyyy-MM-dd HH:mm:ss"),
					hasta: xx.transform(hasta,"yyyy-MM-dd HH:mm:ss"),
					viajanteId: this.viajanteId,
					cliente: this.cliente,
					clienteId: this.clienteId,
					estado: this.estado
				})
				break;
		}

		return solicitud;
	}

}

export class PedidoListaVista {
	id: number;
	fecha: Date;
	viajante: string;
	clienteId: string;
	cliente: string;
	monto: number;
	articulos: number;
	estado: number; //Puede que sea number

	constructor() {
		this.id=0;
		this.fecha= new Date();
		this.viajante="";
		this.clienteId="";
		this.cliente="";
		this.monto=0.00;
		this.articulos=0;
		this.estado=0;
	}

	asigDesdeData(item: PedidoListaData) {
		this.id= item.id;
		//this.fecha= new Date(item.fecha);
		this.fecha= this.parseFechaHoraCadena(item.fecha);
		this.viajante= item.viajante;
		this.clienteId= item.clienteId;
		this.cliente= item.cliente;
		this.monto= item.monto;
		this.articulos= item.articulos;
		this.estado= item.estado;
	}

	obtPedidoMes():string {
		const aMes= ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SET','OCT','NOV','DIC'];

		return aMes[this.fecha.getMonth()];
	}

	//formato desde MySQL: YYYY-MM-dd hh:mm:ss
	parseFechaHoraCadena(cadena: string): Date {
		//Por compatibilidad entre navegadores elformato debe ser YYYY-MM-ddThh:mm:ssZ para ser aceptado por new Date()
		return new Date(
			cadena.slice(0,10)+'T'+cadena.slice(11,19)+'Z'
		);
		//return new Date(cadena +"T00:00:00");
	}
}

export class PedidoListaData {
	id: number;
	fecha: string;
	viajante: string;
	clienteId: string;
	cliente: string;
	monto: number;
	articulos: number;
	estado: number;
}


// Solicitud de ClienteLista
export class SolPedidoLista {
  accion: string;
  desde: string;
  hasta: string;
	cliente: string;
	clienteId: string;
	estado: number;
	
	asigFiltro(filtro: PedidoFiltro): void {
		let xx= new DatePipe("es-AR");
		let hasta= filtro.hasta;

		hasta.setDate(hasta.getDate()+1);

		this.desde= xx.transform(filtro.desde,"yyyy-MM-dd HH:mm:ss");
		this.hasta= xx.transform(hasta,"yyyy-MM-dd HH:mm:ss");
		this.cliente= filtro.cliente;
		this.clienteId= filtro.clienteId;
		this.estado= filtro.estado;
	} 
}

// Respuesta recibida desde el Servidor
export class RespPedidoLista {
  bOk: boolean;
  mensaje: string;
  aLista: PedidoListaData[];
}