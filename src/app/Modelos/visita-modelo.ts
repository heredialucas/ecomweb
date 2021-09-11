import { DatePipe } from '@angular/common';

export class VisitaFiltro {
	cliente: string;
	desde: Date;
	hasta: Date;

	constructor(desde: string, hasta: string) {
		let fecRef= new Date();
		fecRef.setHours(0,0,0);

		this.hasta= this.obtFechaDesdeCadena(hasta, fecRef);

		fecRef= new Date()
		fecRef.setHours(0,0,0);
		fecRef.setMonth(fecRef.getMonth()-3);
		fecRef.setDate(fecRef.getDate()+1);

		this.desde= this.obtFechaDesdeCadena(desde, fecRef);
	}

	public asigFechaDesde(cadena: string ) {
		this.desde= this.obtFechaDesdeCadena(cadena, new Date(2000,0,1));
	}
	public asigFechaHasta(cadena: string ) {
		this.hasta= this.obtFechaDesdeCadena(cadena, new Date());
	}

	obtFechaDesdeCadena(cadena: string, porDefecto: Date): Date {
		//cadena en formato: dd/MM/yyyy
		let fecha= porDefecto;
		if(!(cadena=== undefined || cadena===null)) {
			fecha= new Date(
				parseInt(cadena.slice(6,10),10),
				parseInt(cadena.slice(3,5),10)-1,
				parseInt(cadena.slice(0,2),10)
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


}

export class VisitaVista {
	id: number;
	fecha: string; // Desde mysql, vuelve como una fecha ejemplo "2020-07-20 06:44:51"
	cliente: string;
	clienteId: string;
	viajanteId: string;
	viajante: string;
	observacion: string;

	parseData(i: VisitaVista) {
		this.id= i.id;
		this.fecha= i.fecha;
		this.cliente= i.cliente;
		this.clienteId= i.clienteId;
		this.viajanteId= i.viajanteId;
		this.viajante= i.viajante;
		this.observacion= i.observacion;
	}

	obtDia(): string {
		return this.fecha.slice(8,10);
	}

	obtMes(): string {
		const aMes= [];
		aMes["01"]="ENE";
		aMes["02"]="FEB";
		aMes["03"]="MAR";
		aMes["04"]="ABR";
		aMes["05"]="MAY";
		aMes["06"]="JUN";
		aMes["07"]="JUL";
		aMes["08"]="AGO";
		aMes["09"]="SET";
		aMes["10"]="OCT";
		aMes["11"]="NOV";
		aMes["12"]="DIC";
		return aMes[this.fecha.slice(5,7)];
	}
}

export class RespVisitaRegistro {
	bOk: boolean;
	mensaje: string;
	oVisita: VisitaVista;
}

export class RespVisitaLista {
	bOk: boolean;
	mensaje: string;
	aLista: VisitaVista[];
}