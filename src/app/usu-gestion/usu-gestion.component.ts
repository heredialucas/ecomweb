import { VisitaVista } from './../Modelos/visita-modelo';
import { PedidoVista, PedidoListaVista } from './../Modelos/pedido-modelo';
import { DataService } from './../data.service';
//import { MatInputModule }  from '@angular/material/input';
//import { MatDatepickerModule} from '@angular/material/datepicker';

import { FiltroVisitaEx, FiltroPedidoLista } from './../Modelos/filtro-base';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Transicion } from '../Modelos/transicion';
import { ViajanteVista } from '../Modelos/viajante-modelo';

import { Router} from '@angular/router';

@Component({
  selector: 'app-usu-gestion',
  templateUrl: './usu-gestion.component.html',
  styleUrls: ['./usu-gestion.component.scss']
})
export class UsuGestionComponent implements OnInit {
	aViajante: Array<ViajanteVista>;

	//vista
	traVisita: Transicion;
	frmVisita: FormGroup;
	filVisita: FiltroVisitaEx;
	lisVisita: VisitaVista[];

	//pedido
	traPedido: Transicion;
	frmPedido: FormGroup;
	filPedido: FiltroPedidoLista;
	lisPedido: PedidoListaVista[];

	//Documento
	traDocumento: Transicion;
	frmDocumento: FormGroup;
	filDocumento: FiltroVisitaEx;

	public dayPickerConfig = {
    firstDayOfWeek: 'su',
    monthFormat: 'MMM, YYYY',
    disableKeypress: true,
    allowMultiSelect: false,
    closeOnSelect: undefined,
    closeOnSelectDelay: 100,
    onOpenDelay: 0,
    weekDayFormat: 'dd',
    appendTo: document.body,
    drops: 'down',
    opens: 'right',
    showNearMonthDays: true,
    showWeekNumbers: false,
    enableMonthSelector: true,
    format: "DD/MM/YYYY",
    yearFormat: 'YYYY',
    showGoToCurrent: false,
    dayBtnFormat: 'DD',
    monthBtnFormat: 'MMM',
    hours12Format: 'hh',
    hours24Format: 'HH',
    meridiemFormat: 'A',
    minutesFormat: 'mm',
    minutesInterval: 1,
    secondsFormat: 'ss',
    secondsInterval: 1,
    showSeconds: false,
    showTwentyFourHours: true,
    timeSeparator: ':',
    multipleYearsNavigateBy: 10,
    showMultipleYearsNavigation: false,
    locale: 'es-ar',
  }

  constructor(public router: Router, public data: DataService) { 
		this.aViajante= new Array<ViajanteVista>();
		this.data.viaObtLista()
		.subscribe( (data: ViajanteVista[]) =>{
			let neoVia= new ViajanteVista();
			neoVia.nombre= "(Todos)";
			neoVia.id="";
			this.aViajante.push(neoVia);
			data.forEach( (i:ViajanteVista) =>{
				this.aViajante.push(i);
				console.log(i);
			});
		});

		let desde= new Date();
		let hasta= new Date();
		//visitas
		this.lisVisita= new Array<VisitaVista>();
		this.filVisita= new FiltroVisitaEx();
		this.filVisita.agrMesAFecha(desde, -3);
		this.filVisita.agrDiasAFecha(desde, 1);
		this.filVisita.desde= desde;
		this.filVisita.hasta= hasta;
		
		this.traVisita= new Transicion();
		this.frmVisita = new FormGroup({
			txtVisViajanteId: new FormControl(''),
			txtVisCliente: new FormControl(''),
			txtVisDesde: new FormControl(
				this.filVisita.obtFechaFormateada(this.filVisita.desde,'dd/MM/yyyy')
			),
			txtVisHasta: new FormControl(
				this.filVisita.obtFechaFormateada(this.filVisita.hasta,'dd/MM/yyyy'),
			),
		});

		//Pedidos
		this.lisPedido= new Array<PedidoListaVista>();
		this.filPedido= new FiltroPedidoLista();
		this.filPedido.desde= desde;
		this.filPedido.hasta= hasta;

		this.traPedido= new Transicion();
		this.frmPedido = new FormGroup({
			txtPedViajanteId: new FormControl(''),
			txtPedCliente: new FormControl(''),
			txtPedDesde: new FormControl(
				this.filVisita.obtFechaFormateada(this.filVisita.desde,'dd/MM/yyyy')
			),
			txtPedHasta: new FormControl(
				this.filVisita.obtFechaFormateada(this.filVisita.hasta,'dd/MM/yyyy'),
			),
			txtPedEstado: new FormControl("-1"),
		});

		//Documentos
		this.filDocumento= new FiltroVisitaEx();
		this.filDocumento.desde= desde;
		this.filDocumento.hasta= hasta;

		this.traDocumento= new Transicion();
		this.frmDocumento= new FormGroup({
			txtDocViajanteId: new FormControl(''),
			txtDocCliente: new FormControl(''),
			txtDocDesde: new FormControl(
				this.filDocumento.obtFechaFormateada(this.filVisita.desde,'dd/MM/yyyy')
			),
			txtDocHasta: new FormControl(
				this.filDocumento.obtFechaFormateada(this.filVisita.hasta,'dd/MM/yyyy'),
			),
		});
	}

  ngOnInit(): void {
	}

	visFiltrar(): void {
		this.traVisita.iniciar('Obteniendo datos...');
		this.lisVisita.length=0;

		//ViajanteID
		this.filVisita.viajanteId= this.frmVisita.controls['txtVisViajanteId'].value;
		//Cliente
		this.filVisita.clienteId= '';
		this.filVisita.cliente= this.frmVisita.controls['txtVisCliente'].value;
		if(this.filVisita.cliente >'')
			this.filVisita.cliente= this.filVisita.agrComodines(this.filVisita.cliente);
		//Desde
		this.filVisita.desde= this.filVisita.parseFecha(
			this.frmVisita.controls['txtVisDesde'].value
			,'dd/MM/yyyy');
		//Hasta
		this.filVisita.hasta= this.filVisita.parseFecha(
			this.frmVisita.controls['txtVisHasta'].value,
			'dd/MM/yyyy');

		this.data.visObtLista(this.filVisita)
		.subscribe((data: VisitaVista[]) => {
				console.log(data);
				this.traVisita.finalizarOk();
				if(data.length==0) {
					this.traVisita.mensaje= 
						!this.data.esInvitado() ? 
							" No hay Visitas coincidentes!"
							:
							" Su sesión a finalizado";
				}
				this.lisVisita= data;
			},
			(err: any) => {
				this.traVisita.finalizarConError(
					"Ocurrió un error, revise su conexión",
					typeof(err)=="string"? err : JSON.stringify(err)
				);
			}
		);

	}
	
	docFiltrar(): void {
		console.log(this.frmVisita);
	}

	obtVisitaDesde(): string {
		return this.filVisita.obtFechaFormateada(this.filVisita.desde,"dd/MM/yyyy");
	}
	obtVisitaHasta(): string {
		return this.filVisita.obtFechaFormateada(this.filVisita.hasta,"dd/MM/yyyy");
	}

	pedCargar(id: number): void {
		this.data.pedRegistro(id, "")
		.subscribe(
			(bOk: boolean) =>{
				if(bOk) {
					this.router.navigate(["/Pedido"]);
				} else {
					alert("ocurrió un error, no se pudo obtener el pedido");
				}
			}
		);
	}

	pedFiltrar() {
		this.traPedido.iniciar('Obteniendo datos...');
		this.lisPedido.length=0;

		//ViajanteID
		this.filPedido.viajanteId= this.frmPedido.controls['txtPedViajanteId'].value;
		//Cliente
		this.filPedido.clienteId= '';
		this.filPedido.cliente= this.frmPedido.controls['txtPedCliente'].value;
		if(this.filPedido.cliente >'')
			this.filPedido.cliente= this.filPedido.agrComodines(this.filPedido.cliente);
		//Desde
		this.filPedido.desde= this.filPedido.parseFecha(
			this.frmPedido.controls['txtPedDesde'].value
			,'dd/MM/yyyy');
		//Hasta
		this.filPedido.hasta= this.filPedido.parseFecha(
			this.frmPedido.controls['txtPedHasta'].value,
			'dd/MM/yyyy');
		//Estado
		this.filPedido.estado= parseInt(this.frmPedido.get('txtPedEstado').value);

		this.data.pedObtLista(this.filPedido, false)
		.subscribe((data: PedidoListaVista[]) => {
				this.traPedido.finalizarOk();
				if(data.length==0) {
					this.traVisita.mensaje= 
						!this.data.esInvitado ? 
							" No hay Visitas coincidentes!"
							:
							" Su sesión a finalizado";

				}
				this.lisPedido= data;
			},
			(err) => {
				this.traPedido.finalizarConError(
					"Ocurrió un error, revise su conexión",
					typeof(err)=="string"? err : JSON.stringify(err)
				);
			}
		);
	}


}
