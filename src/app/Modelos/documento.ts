
export class DocListaData {
	id: string;
	cliId: string
	cliCodigo: string;
	cliente: string;
	fecha: string;
	tipo: string;
	numero: string;
	esFiscal: number;
	ultModif: string;
	total: number;
	saldo: number;
	aDetalle: DocDetalleData[];
}

export class DocListaVista {
	id: string;
	cliCodigo: string;
	clienteId: string;
	cliente: string;
	fecha: Date;
	docTipo: string;
	docNumero: string;
	docEsFiscal: number;
	ultModif: Date;
	total: number;
	saldo: number;

	aDetalle: DocDetalleVista[];

	constructor() {
		this.id="";
		this.cliCodigo="";
		this.clienteId="";
		this.cliente="";
		this.fecha= new Date(2000,1,1);
		this.docTipo="";
		this.docNumero="";
		this.docEsFiscal= 0;
		this.ultModif= new Date(2000,1,1);
		this.total= 0;
		this.saldo= 0;

		this.aDetalle= new Array<DocDetalleVista>();
	}


	obtNumeracion() {
		return this.docTipo +(this.docEsFiscal? "-" : "*")+this.docNumero;
	}

	obtDesdeData(data: DocListaData) {
		this.id= data.id;
		this.clienteId= data.cliId;
		this.cliCodigo= data.cliCodigo;
		this.cliente= data.cliente;
		this.docTipo= data.tipo;
		this.docNumero= data.numero;
		this.docEsFiscal= data.esFiscal;
		this.fecha= this.parseFechaCadena(data.fecha);
		this.ultModif= this.parseFechaCadena(data.fecha);
		this.total= data.total;
		this.saldo= data.saldo;

		if(data.aDetalle != null && data.aDetalle != undefined) {
			this.aDetalle= Array<DocDetalleVista>();
			data.aDetalle.forEach( (e:DocDetalleData)=>{
				let eDet= new DocDetalleVista();
				eDet.obtDesdeData(e);
				this.aDetalle.push(eDet);
			});
		} else {
			this.aDetalle= null;
		}
		
	}

	parseFechaCadena(cadena: string): Date {
		return new Date(cadena +"T00:00:00");
	}

	obtDocMes(): string {
		const aMes= ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SET','OCT','NOV','DIC'];
		return aMes[this.fecha.getMonth()];		
	}

	obtPorcionPago(): string {
		return '' +(100*(this.total-this.saldo)/this.total) +'%';
	}
}

export class DocDetalleData {
	codigo: string;
	detalle: string;
	importe: number;
	cantidad: number;
	bonificado: number

	constructor() {
		this.codigo= '';
		this.detalle= '';
		this.importe= 0;
		this.cantidad= 0;
		this.bonificado= 0;
	}
}

export class DocDetalleVista {
	codigo: string;
	detalle: string;
	importe: number;
	cantidad: number;
	bonificado: number

	constructor() {
		this.codigo= '';
		this.detalle= '';
		this.importe= 0;
		this.cantidad= 0;
		this.bonificado= 0;
	}

	obtDesdeData(i: DocDetalleData) {
		this.codigo= i.codigo;
		this.detalle= i.detalle;
		this.importe= i.importe;
		this.cantidad= i.cantidad;
		this.bonificado= i.bonificado;
	}
}


export class DocumentoVista {
	oDoc: DocListaVista;
	aDoc: DocListaVista[];

	constructor() {
		this.oDoc= new DocListaVista();
		this.aDoc= new Array<DocListaVista>();
	}
}

export class DocumentoFiltro {
	clienteId: string;
	cliente: string;
	viajaneId: string;
	viajante: string;
	docTipo: string;
	docNumero: string;
	docEsFiscal: number;

	constructor(bAgrComodin: boolean, clienteId: string, cliente: string, viajanteId: string, viajante:string) {
		this.clienteId=clienteId;
		this.viajaneId= viajanteId;
		if(bAgrComodin) {
			this.cliente= this.agrComodines(cliente);
			this.viajante= this.agrComodines(viajante);
		} else {
			this.cliente= cliente;
			this.viajante= viajante;
		}
		this.docTipo= "";
		this.docNumero= "";
		this.docEsFiscal= 0;
	
	}

	genSolicitud(accion: string): string {
		let sol: string;

		switch(accion) {
			case "DocSegunViajante":
				sol= JSON.stringify({accion: accion, cliente: this.cliente});
				break;
			case "DocSegunCliente":
				sol= JSON.stringify({
					accion: accion, 
					clienteId: this.clienteId,
					docTipo: this.docTipo,
					docNumero: this.docNumero,
					docEsFiscal: this.docEsFiscal
				});
				break;
		}

		return sol;
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
}

export class RespDocLista {
	bOk: boolean;
	mensaje: string;
	aDoc: DocListaData[];
}

/*
export class RespDocumento {
	bOk: boolean;
	mensaje: string;
	doc: DocDetalleData;
	aLista: DocListaData[]
}
*/
