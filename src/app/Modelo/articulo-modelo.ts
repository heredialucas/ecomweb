export class ArticuloModelo {
}

// Para presentar Artículos en el componente
export class ArticuloVistaMod {
	id: number;
	codigo: string;
	descripcion: string;
	rubro: string;
	subrubro: string;
	oPrecio: ArticuloVistaModPrecio[];
	oStock: ArticuloVistaModStock[];
}

export class ArticuloVistaModPrecio {
	id: number;
	tipo: string;
	monto: number;
}

export class ArticuloVistaModStock {
	id: number;
	codigo: number;
	deposito: string;
	cantidad: number;
}

// Solicitud de un Artículo
export class SolArticulo {
	accion: string;
	id: number;
	codigo: string;
}

// Respuesta a Solicitud de datos
export class RespArticulo {
	bOk: boolean;
	mensaje: string;
	oRegArt: ArticuloData;
	aRegPrecio: ArticuloPrecioData[];
	aRegStock: ArticuloStockData[];
}

// Devolución cruda desde la DB
export class ArticuloData {
	id: number;
	codigo: number;
	descripcion: string;
	rubro: string;
	subrubro: string;
	iva: number;
}

export class ArticuloPrecioData {
	id: number;
	tipo: string;
	monto: number;
}

export class ArticuloStockData {
	id: number;
	codigo: string;
	deposito: string;
	cantidad: number;
}
