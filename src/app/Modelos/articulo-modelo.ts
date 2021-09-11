import { PedidoVistaArticulo } from './pedido-modelo';

// Para presentar Artí­culos en el componente
export class ArticuloVista {
	id: string; //id en Calipso
	codigo: string;
	descripcion: string;
	rubro: string;
	subrubro: string;
	iva: number;
	aPrecio: ArticuloVistaPrecio[];
	aStock: ArticuloVistaStock[];

	constructor() {
		this.aPrecio = new Array<ArticuloVistaPrecio>();
		this.aStock = new Array<ArticuloVistaStock>();
		this.genVacio();
	}

	obtPrecio(tipo: string): number {
		let precio = 0;
		if (this.aPrecio != null) {
			const i = this.aPrecio.findIndex(
				(item) => item.tipo === tipo // 2: Precio de Lista
			);
			if (i >= 0) { precio = this.aPrecio[i].monto; }
		}
		return precio;
	}

	obtIVA(tipo: string): number {
		let iva = 0;
		if (this.aPrecio.length > 0) {
			const i = this.aPrecio.findIndex(
				(item) => item.tipo === tipo // 2: Precio de Lista
			);
			if (i >= 0) { iva = this.aPrecio[i].monto * this.iva / 100; }
		}
		return iva;
	}

	obtPrecioConIVA(tipo: string): number {
		let precio = 0;
		if (this.aPrecio.length > 0) {
			const i = this.aPrecio.findIndex(
				(item) => item.tipo === tipo // 2: Precio de Lista
			);

			if (i >= 0) {
				precio = this.aPrecio[i].monto + this.aPrecio[i].monto * this.iva / 100;
			}
		}
		return precio;
	}

	obtStock(): number {
		let cantidad = 0;
		if (this.aStock.length > 0) {
			const x = this.aStock.reduce(
					(a: ArticuloVistaStock, b: ArticuloVistaStock) => {
							const res = new ArticuloVistaStock();
							res.deposito = 'final';
							res.cantidad = a.cantidad + b.cantidad;
						 return res;
					}
			);
			cantidad = x.cantidad;
		}
		return cantidad;
	}

	genPedidoArticulo(): PedidoVistaArticulo {
		const pa = new PedidoVistaArticulo();
		pa.id = 0;
		pa.articuloId = this.id;
		pa.codigo = this.codigo;
		pa.descripcion = this.descripcion;
		pa.iva = this.iva;
		pa.precio = this.obtPrecio("2"); // Precio de Venta (Lista)

		return pa;
	}

	genVacio() {
		this.id = '';
		this.codigo = '<no disponible>';
		this.descripcion =  '<no disponible>';
		this.rubro =  '<no disponible>';
		this.subrubro =  '<no disponible>';
		this.iva = 0.00;
		this.aPrecio.length = 0;
		// this.aPrecio= new Array<ArticuloVistaPrecio>();
		this.aPrecio.push(new ArticuloVistaPrecio());
		this.aStock.length = 0;
		// this.aStock= new Array<ArticuloVistaStock>();
		this.aStock.push(new ArticuloVistaStock());
	}

	parseData(data: ArticuloData) {
		//console.log(data);
		this.id = data.id;
		this.codigo = data.codigo;
		this.descripcion = data.descripcion;
		this.rubro = data.rubro;
		this.subrubro = data.subrubro;
		this.iva = data.iva;
		this.aPrecio = new Array<ArticuloVistaPrecio>();
		data.aPrecio.forEach(
			(item: ArticuloPrecioData) => {
				const avp = new ArticuloVistaPrecio();
				avp.parseData(item);
				this.aPrecio.push(avp);
			}
		);
		this.aStock = new Array<ArticuloVistaStock>();
		data.aStock.forEach(
			(item: ArticuloStockData) => {
				const avs = new ArticuloVistaStock();
				avs.parseData(item);
				this.aStock.push(avs);
			}
		);
	}

}

export class ArticuloVistaPrecio {
	id: number;
	tipo: string; // 2: Venta (Lista)
	monto: number;

	constructor() {
		this.id = 0;
		this.tipo = "2";
		this.monto = 0;
	}

	parseData(data: ArticuloPrecioData) {
		this.id = data.id;
		this.tipo = data.tipo;
		this.monto = data.monto;
	}

	obtNombreLista(): string {
		/* Tipo
		1 Costo, 2 Venta', 3 Dsto1
		4 Desto2, 5 Catalogo, 6 Especial
		7 CarStation
		*/

		const aLista: string[] =['', 'Costo','De Lista','Dsto1','Dsto2','Catálogo','Especial','CarStation'];

		return aLista[this.tipo];
	}

	obtPrecioConIVA(iva: number): number {
		return this.monto + this.obtIvaMonto(iva);
	}

	obtIvaMonto(iva: number): number {
		return this.monto * iva/100;
	}
}

export class ArticuloVistaStock {
	id: number;
	codigo: string;
	deposito: string;
	cantidad: number;

	constructor() {
		this.id = 0;
		this.codigo = '<no disponible>';
		this.deposito = '<no disponible>';
		this.cantidad = 0;
	}

	parseData(data: ArticuloStockData) {
		this.id = data.id;
		this.codigo = data.codigo;
		this.deposito = data.deposito;
		this.cantidad = data.cantidad;
	}
}

// Solicitud del Registro de un Artículo
export class SolArticulo {
	accion: string;
	rol: number;
	entidadId: string;
	id: string;
	//codigo: string;
}

// Respuesta a Solicitud Accion=Registro
export class RespArticulo {
	bOk: boolean;
	mensaje: string;
	oRegistro: ArticuloData;
}

// Devolución cruda desde la DB
export class ArticuloData {
	id: string; //id en Calipso
	codigo: string;
	descripcion: string;
	rubro: string;
	subrubro: string;
	iva: number;
	aPrecio: ArticuloPrecioData[];
	aStock: ArticuloStockData[];

	genArticuloVista(): ArticuloVista {
		const av = new ArticuloVista();
		av.id = this.id;
		av.codigo = this.codigo;
		av.descripcion = this.descripcion;
		av.iva = this.iva;
		av.rubro = this.rubro;
		av.subrubro = this.subrubro;

		console.log(av.descripcion);

		av.aPrecio = new Array<ArticuloVistaPrecio>();
		this.aPrecio.forEach(
			(item: ArticuloPrecioData) => {
				av.aPrecio.push(item.genArticuloVistaPrecio());
			});

		av.aStock = new Array<ArticuloVistaStock>();
		this.aStock.forEach(
			(item: ArticuloStockData) => {
				av.aStock.push(item.genArticuloVistaStock());
			});

		return av;
	}
}

export class ArticuloPrecioData {
	id: number;
	tipo: string; // 2: Venta (Lista)
	monto: number;

	genArticuloVistaPrecio(): ArticuloVistaPrecio {
		const avp = new ArticuloVistaPrecio();
		avp.id = this.id;
		avp.tipo = this.tipo;
		avp.monto = this.monto;

		return avp;
	}
}

export class ArticuloStockData {
	id: number;
	codigo: string;
	deposito: string;
	cantidad: number;

	genArticuloVistaStock(): ArticuloVistaStock {
		const avp = new ArticuloVistaStock();
		avp.id = this.id;
		avp.codigo = this.codigo;
		avp.deposito = this.deposito;
		avp.cantidad = this.cantidad;
		return avp;
	}
}
