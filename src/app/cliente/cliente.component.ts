import { VisitaVista, RespVisitaLista } from './../Modelos/visita-modelo';
import { Transicion } from '../Modelos/transicion';
import { DlgGenericoComponent } from './../Dialogos/dlg-generico/dlg-generico.component';
import { DlgMensajeComponent } from './../Dialogos/dlg-mensaje/dlg-mensaje.component';

import { PedidoFiltro, PedidoListaVista, RespPedidoLista } from './../Modelos/pedido-modelo';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DataService } from '../data.service';
import { ClienteVista } from '../Modelos/cliente-modelo';
import { DatePickerComponent} from 'ng2-date-picker';
//import { IDatePickerConfig } from 'ng2-date-picker/date-picker/date-picker-config.model';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { DatePipe } from '@angular/common';

import { GeoData } from '../Modelos/data-modelo';
import { RespVisitaRegistro, VisitaFiltro } from '../Modelos/visita-modelo';


@Component({
	selector: 'app-cliente',
	templateUrl: './cliente.component.html',
	styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
	cli: ClienteVista;
	traCli: Transicion;

	traPed: Transicion;
	pedLista: PedidoListaVista[];

	filtro: PedidoFiltro;
	//bFiltroMostrar: boolean;

	@ViewChild("fechaDesde") public fechaDesdeDP: DatePickerComponent
	@ViewChild("fechaHasta") public fechaHastaDP: DatePickerComponent
	//@ViewChild("conFiltro") public conFiltro: HTMLElement;

	frm: FormGroup;

	geo: GeoData;
	traGeo: Transicion;

	//Visita
	traVis: Transicion;
	visRegistrando: boolean;
	visLista: VisitaVista[];

	frmVisita: FormGroup;

	filVisita: VisitaFiltro;
	frmVisFiltro: FormGroup;
	@ViewChild("fechaVisDesde") public fechaVisDesdeDP: DatePickerComponent
	@ViewChild("fechaVisHasta") public fechaVisHastaDP: DatePickerComponent


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
	
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private dataServicio: DataService,
		private dlg: MatDialog
	) {
		this.cli = new ClienteVista();
		this.traCli= new Transicion();

		this.traPed= new Transicion();
		this.pedLista= new Array<PedidoListaVista>();
		this.filtro= new PedidoFiltro(
				false, 
				this.dataServicio.pedido.oCliente.id,"",
				this.dataServicio.pedido.oViajante.id,
				null,null);
		this.filtro.asignar(this.dataServicio.pedCliFiltro);

		this.frm = new FormGroup({
			txtDesde: new FormControl(
				this.filtro.obtDesdeCadena()
			),
			txtHasta: new FormControl(
				this.filtro.obtHastaCadena()
			),
			txtEstado: new FormControl(this.filtro.estado),
		});

		// Visita Nuevo
		this.traVis= new Transicion();
		this.geo= new GeoData();
		this.traGeo= new Transicion();
		this.visRegistrando= false;
		this.frmVisita = new FormGroup({
			txtObservacion: new FormControl(''),
		});

		// Visita Filtro
		this.filVisita= new VisitaFiltro(null,null);
		this.frmVisFiltro = new FormGroup({
			txtVisDesde: new FormControl(this.filVisita.obtDesdeCadena()),
			txtVisHasta: new FormControl(this.filVisita.obtHastaCadena())
		});
		this.visLista= Array<VisitaVista>();

	}

	ngOnInit(): void {
		if (this.esCliente()) {
			// Cliente y PedidoCliente siempre son los mismo
			this.cli = this.dataServicio.pedido.oCliente;
		} else {
			// Viajante: el cliente se seleccion de la lista
			const codigo = this.route.snapshot.paramMap.get('codigo');
			this.traCli.iniciar("Recuperando datos del Cliente...");
			this.dataServicio.obtCliente(codigo).subscribe(
				(data: ClienteVista) => {
					this.traCli.finalizarOk();
					this.cli = data;
					//console.log(this.cli);
				},
				(error) =>{
					this.traCli.finalizarConError(
						"Ocurrió un error!",
						(typeof(error)=='string'? error : JSON.stringify(error))
					);
				}
			);
		}
	}

	pedCargar(id: number): void {
		//let bContinuar= !this.dataServicio.pedHayCambios(false);
		//let bContinuar= !this.dataServicio.hay
		let bContinuar= true;

		if(!bContinuar) {
			alert("El pedido actual ha sido modificado, guarde los cambios")
		}
		if(bContinuar) {
			this.dataServicio.pedRegistro(id, this.cli.id)
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

	obtFiltroDesde(): string {
		return this.dataServicio.pedViaFiltro.obtDesdeCadena()
	}

	obtFiltroHasta(): string {
		return this.dataServicio.pedViaFiltro.obtHastaCadena()
	}

	pedFiltrar(): void {
		this.traPed.iniciar("Obteniendo lista de pedidos...");
		this.pedLista.length= 0;

		this.filtro.viajanteId= this.dataServicio.pedido.oViajante.id;
		this.filtro.clienteId= this.cli.id;
		this.filtro.cliente= "";
		this.filtro.asigFechaDesde(this.frm.get('txtDesde').value);
		this.filtro.asigFechaHasta(this.frm.get('txtHasta').value);
		this.filtro.estado= parseInt(this.frm.get('txtEstado').value)
	
		this.dataServicio.obtPedidosCli(this.filtro, false)
		.subscribe((data: PedidoListaVista[]) => {
				this.traPed.finalizarOk();
				if(data.length==0) this.traPed.mensaje="No hay pedidos coincidentes!";
				this.pedLista= data;
			},
			(err) => {
				this.traPed.finalizarConError(
					"Ocurrió un error, revise su conexión a internet!",
					typeof(err)=="string"? err : JSON.stringify(err)
					);
				//console.log(err);
			}
		);
	}

	esViajante(): boolean {
		return this.dataServicio.esViajante();
	}

	esCliente(): boolean {
		return this.dataServicio.esCliente();
	}

	agrAPedido(): void {

		if(this.dataServicio.pedHayCliente() ) {
			const dialogConfig = new MatDialogConfig();

			dialogConfig.disableClose = true;
			dialogConfig.autoFocus = true;
			dialogConfig.data= {iBoton: 1, titulo:"Confirmación", mensaje:"El pedido ya tiene asignado un Cliente, ¿Desea reemplazarlo?"}

			const dlgRef= this.dlg.open(DlgGenericoComponent, dialogConfig);		
			dlgRef.afterClosed().subscribe(result => {
				//console.log(result);
				if(result==='Si') {
				//if(result==='Si') {
					this.dataServicio.pedCliAgregar(this.cli.id,this.cli,null);
					this.router.navigate(["/Articulos"]);		
				}
			});
		} else {
			this.dataServicio.pedCliAgregar(this.cli.id,this.cli,null);
			this.router.navigate(["/Articulos"]);
		}

	}

	esPedidoAbierto(): boolean {
		return this.dataServicio.pedido.estadoDB==0;
	}

	visFiltrar() {
		//formato dd/mm/aaaa
		const p= new DatePipe("es-AR");
		let txtDesde: string= this.frmVisFiltro.get('txtVisDesde').value;
		let txtHasta: string= this.frmVisFiltro.get('txtVisHasta').value;

		let fecHasta= new Date(txtHasta.slice(6) +"-" +txtHasta.slice(3,5) +"-" +txtHasta.slice(0,2) +" 00:00:00");
		fecHasta.setDate(fecHasta.getDate()+1);
		//pasar a formato aaaammdd para que sea interpretado en mysql yyyyMMdd ó yyyy-MM-dd
		txtDesde= txtDesde.slice(6) +txtDesde.slice(3,5) +txtDesde.slice(0,2);
		txtHasta= p.transform(fecHasta,"yyyyMMdd");

		this.traVis.iniciar("Recuperando visitas...");
		this.visLista.length=0;
		this.dataServicio.visFiltrar(null, this.cli.id, null, txtDesde, txtHasta)
		.subscribe(
			(data: RespVisitaLista)=>{
				if(data.bOk) {
					this.traVis.finalizarOk();
					//this.visLista= data.aLista;
					data.aLista.forEach( (i:VisitaVista) => {
						let neoI= new VisitaVista();
						neoI.parseData(i);
						this.visLista.push(neoI);
					});
					//console.log(this.visLista);
				} else {
					this.traVis.finalizarConError("Ocurrió un error: " +data.mensaje,"");
				}
			},
			(error => {
				this.traVis.finalizarConError("Error de comunicación, revise su conexión",(typeof(error)=="string"?error : JSON.stringify(error)));
				//console.log(error);
			})
		)

	}

	visRegistrar() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;

		let txtObs= this.frmVisita.get('txtObservacion').value;
		this.traVis.iniciar("Registrando visita...");
		this.dataServicio.visAgregar(this.cli.id, txtObs, this.geo.obtFecha(), this.geo.latitud, this.geo.longitud)
		.subscribe(
			(data: RespVisitaRegistro) => {
				if(data.bOk) {
					this.traVis.finalizarOk();
					this.frmVisita.controls['txtObservacion'].setValue("");
					dialogConfig.data= {
						titGrafico: 1, 
						titTexto: "Exito",
						mensaje: "Aviso registrado exitosamente",
						botRotulo:"Entendido", 
					}
				} else {
					this.traVis.finalizarConError("Visita no registrada!",data.mensaje);
					dialogConfig.data= {
						titGrafico: 0, 
						titTexto: "Error",
						mensaje: "El Aviso NO fue registrado: " +data.mensaje,
						botRotulo:"Entendido", 
					}
				}
				const dlgRef= this.dlg.open(DlgMensajeComponent, dialogConfig);		
			},
			(error: any) =>{
				this.traVis.finalizarConError("Visita no registrada!",( typeof(error)=="string"? error : JSON.stringify(error)));
				dialogConfig.data= {
					titGrafico: 0, 
					titTexto: "Error",
					mensaje: "Revise su conexión a Internet, el Aviso NO fue registrado",
					botRotulo:"Entendido", 
				}
				const dlgRef= this.dlg.open(DlgMensajeComponent, dialogConfig);		

			}
		);
	}

	visGeolocalizar(): void {
		this.visRegistrando= true;
		this.traGeo.iniciar("Intentando geolocalizar...");
		this.dataServicio.geoLocalizar()
		.subscribe(
		(geo: GeoData) =>{
			this.geo= geo;
			this.traGeo.finalizarOk();
			this.traGeo.mensaje= "lat: " +geo.latitud +" long:" +geo.longitud;
		},
		(error:any) =>{
			this.traGeo.finalizarConError("Sin geolocalización", (typeof(error)=="string"? error : JSON.stringify(error)));
		});
	}

}
