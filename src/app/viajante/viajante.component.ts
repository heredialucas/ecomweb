import { Transicion } from './../Modelos/transicion';
import { DataService } from './../data.service';
import { Router} from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ViajanteVista } from '../Modelos/viajante-modelo';
import { DatePickerComponent} from 'ng2-date-picker';
//import { IDatePickerConfig } from 'ng2-date-picker/date-picker/date-picker-config.model';
import { PedidoFiltro, PedidoListaVista } from './../Modelos/pedido-modelo';
import { FormGroup, FormControl } from '@angular/forms';
import { DocListaVista } from '../Modelos/documento';

@Component({
  selector: 'app-viajante',
  templateUrl: './viajante.component.html',
  styleUrls: ['./viajante.component.scss']
})
export class ViajanteComponent implements OnInit {
	via: ViajanteVista;

	//Pedido
	frm: FormGroup;
	filtro: PedidoFiltro;
	pedLista: PedidoListaVista[];
	traPed: Transicion;
	//pedListando: boolean;
	//pedListaMensaje: string;
	bFiltroMostrar: boolean;

	@ViewChild("fechaDesde") public fechaDesdeDP: DatePickerComponent
	@ViewChild("fechaHasta") public fechaHastaDP: DatePickerComponent
	@ViewChild("conFiltro") public conFiltro: HTMLElement;


	//Documento
	frmDoc: FormGroup;
	docLista: DocListaVista[];
	traDoc: Transicion;
	//docListando: boolean;
	//docListaMensaje: string;


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
	
  constructor(public router:Router, public data: DataService) { 
		this.via= new ViajanteVista();
		this.bFiltroMostrar= false;

		this.filtro= new PedidoFiltro(false,"","","",null,null);
		this.filtro.asignar(this.data.pedViaFiltro);

		//console.log("Viajante - Constructor");

		//Pedidos
		this.frm = new FormGroup({
			txtDesde: new FormControl(
				this.filtro.obtDesdeCadena()
			),
			txtHasta: new FormControl(
				this.filtro.obtHastaCadena()
			),
			txtCliente: new FormControl(this.filtro.cliente),
			txtEstado: new FormControl(this.filtro.estado),
		});
		this.pedLista= new Array<PedidoListaVista>();
		this.traPed= new Transicion();
		//this.pedListando= false;
		//this.pedListaMensaje= '';


		//Documentos
		this.frmDoc= new FormGroup({
			txtClienteDoc: new FormControl('')
		});
		this.docLista= new Array<DocListaVista>();
		this.traDoc= new Transicion();
		//this.docListando= false;
		//this.docListaMensaje='';
	}

	obtFiltroDesde(): string {
		return this.data.pedViaFiltro.obtDesdeCadena()
	}

	obtFiltroHasta(): string {
		return this.data.pedViaFiltro.obtHastaCadena()
	}

  ngOnInit(): void {
		if(this.data.esViajante()) {
			this.via.parseData(this.data.pedido.oViajante);
			this.docLista= this.data.aViaDoc;
		}
	}

	pedFiltrar() {
		this.traPed.iniciar('Obteniendo datos...');
		this.pedLista.length=0;

		//this.filtro.clieneId='' siempre!!!
		this.filtro.viajanteId= this.data.pedido.oViajante.id;
		this.filtro.clienteId="";
		const cliente= this.frm.get('txtCliente').value;
		this.filtro.cliente= cliente=='' ? '' :  this.filtro.agrComodines(cliente);
		this.filtro.asigFechaDesde(this.frm.get('txtDesde').value);
		this.filtro.asigFechaHasta(this.frm.get('txtHasta').value);
		this.filtro.estado= parseInt(this.frm.get('txtEstado').value)

		this.data.obtPedidosVia(this.filtro, false)
		.subscribe((data: PedidoListaVista[]) => {
				this.traPed.finalizarOk();
				if(data.length==0) this.traPed.mensaje=" No hay pedidos coincidentes!";
				this.pedLista= data;
			},
			(err) => {
				this.traPed.finalizarConError(
					"Ocurrió un error, revise su conexión",
					typeof(err)=="string"? err : JSON.stringify(err)
				);
			}
		);
	}

	pedCargar(id: number): void {
		//let bContinuar= !this.data.pedHayCambios(false);
		let bContinuar= !this.data.pedido.hayCambios;

		if(!bContinuar) {
			alert("El pedido actual ha sido modificado, los cambios se perderán")
			bContinuar= true;
		}
		if(bContinuar) {
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
	}	

	docCargar(d: DocListaVista) {
		//Cargo los datos del documento en this.data, para luego visualizarlo en ViaDocInfo
		this.data.oViaDoc= d;
		this.router.navigate(["/ViaDocumento"]);
	}

	docFiltrar() {
		let cliente=this.frmDoc.get('txtClienteDoc').value;
		this.docLista.length=0;
		this.traDoc.iniciar('');
		//this.docListando= true;
		//this.docListaMensaje= "";

		this.data.docObtSegunViajante(cliente)
		.subscribe((data: DocListaVista[]) => {
				this.traDoc.finalizarOk()
				if(data.length==0) this.traDoc.mensaje= " No se encontraron documentos";
				this.docLista= data;
			},
			(err) => {
				this.traDoc.finalizarConError(
					"Ocurrió un error, revise su conexión",
					typeof(err)=='string'? err : JSON.stringify(err)
				)
			}
		);
	}
	
}
