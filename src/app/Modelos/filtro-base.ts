import { DatePipe } from '@angular/common';

export class FiltroBase {

	obtFechaFormateada(fecha: Date, formato: string ): string {
		const conversor= new DatePipe('es-AR');
		//return conversor.transform(fecha,"dd/MM/yyyy");
		return conversor.transform(fecha, formato);
	}

	parseFecha(cadFecha: string, formato: string): Date {
		let fecha: Date;
		switch(formato) {
			case 'yyyy-MM-dd HH:mm:ss':
				//cadFecha: yyyy-MM-dd HH:mm:ss
				//          0123456789012345678
				fecha= new Date(
					parseInt(cadFecha.slice(0,4), 10),
					parseInt(cadFecha.slice(5,7), 10)-1,
					parseInt(cadFecha.slice(8,10), 10),
					parseInt(cadFecha.slice(11,13), 10),
					parseInt(cadFecha.slice(14,16), 10),
					parseInt(cadFecha.slice(17,19), 10)
				)
		
				break;
			case 'dd/MM/yyyy':
				//cadFecha: dd/MM/yyyy
				//          0123456789012345678
				fecha= new Date(
					parseInt(cadFecha.slice(6,10), 10),
					parseInt(cadFecha.slice(3,5), 10)-1,
					parseInt(cadFecha.slice(0,2), 10),
				)
		
				break;
	
		}
		return fecha;		
	}	

	agrMesAFecha(fecha: Date, unidades: number): Date {
		fecha.setMonth(fecha.getMonth()+ unidades);
		return fecha;
	}

	agrDiasAFecha(fecha: Date, dias: number): Date {
		fecha.setDate(fecha.getDate()+ dias);
		return fecha;
	}

	agrDiasAFechaCadena(cadFecha: string, formato: string, dias: number): string {
		let fecha= this.parseFecha(cadFecha,formato);
		fecha.setDate(fecha.getDate()+ dias);
		return this.obtFechaFormateada(fecha, formato);
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

export class FiltroVisitaEx extends FiltroBase {
	viajanteId: string;
	clienteId: string;
	cliente: string;
	desde: Date;
	hasta: Date;

	constructor() {
		super();
		this.viajanteId= '';
		this.clienteId= '';
		this.cliente= '';
		this.desde= null;
		this.hasta= null;
	}

	genSolicitud(accion: string): string {
		let solicitud: string;
		switch(accion) {
			case 'Lista':
				const fecHasta= this.hasta;
				solicitud= JSON.stringify({
					accion: 'Lista',
					viajanteId: this.viajanteId=='' ? null : this.viajanteId,
					clienteId: this.clienteId=='' ? null : this.clienteId,
					cliente: this.cliente=='' ? null : this.cliente,
					desde: this.obtFechaFormateada(this.desde, 'yyyy-MM-dd'),
					hasta: this.obtFechaFormateada(this.agrDiasAFecha(fecHasta,1), 'yyyy-MM-dd'),
				});
				break;
		}
		console.log(solicitud);

		return solicitud;
	}
}

export class FiltroPedidoLista extends FiltroBase {
	viajanteId: string;
	clienteId: string;
	cliente: string;
	desde: Date;
	hasta: Date;
	estado: number;

	constructor() {
		super();
		this.viajanteId= '';
		this.clienteId= '';
		this.cliente= '';
		this.desde= null;
		this.hasta= null;
		this.estado= -1;
	}

	genSolicitud(accion: string): string {
		let solicitud: string;
		switch(accion) {
			case 'Lista':
				const fecHasta= this.hasta;
				solicitud= JSON.stringify({
					accion: 'Lista',
					viajanteId: this.viajanteId=='' ? null : this.viajanteId,
					clienteId: this.clienteId=='' ? null : this.clienteId,
					cliente: this.cliente=='' ? null : this.cliente,
					desde: this.obtFechaFormateada(this.desde, 'yyyy-MM-dd'),
					hasta: this.obtFechaFormateada(this.agrDiasAFecha(fecHasta,1), 'yyyy-MM-dd'),
					estado: this.estado,
				});
				break;
		}

		return solicitud;
	}
}
