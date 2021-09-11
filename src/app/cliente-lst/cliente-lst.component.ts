import { FormGroup, FormControl } from '@angular/forms';
import { ClienteFiltro } from './../Modelos/cliente-modelo';
import { Component, OnInit } from '@angular/core';
// import {ClienteFiltro} from '../Modelos';
import {Router, ActivatedRoute} from '@angular/router';
import {DataService} from '../data.service';
// import { ClienteVista } from '../Modelos/cliente-modelo';
import { ClienteListaVista } from '../Modelos/cliente-lista-modelo';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'app-cliente-lst',
	templateUrl: './cliente-lst.component.html',
	styleUrls: ['./cliente-lst.component.css']
})
export class ClienteLstComponent implements OnInit {

	cliLista: ClienteListaVista[];
	cliListando: boolean
	cliListaMensaje: string;
	frm = new FormGroup({
		txtBusqueda: new FormControl(''),
	});


	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private dataServicio: DataService
	) {
		this.cliLista = new Array<ClienteListaVista>();
		this.cliListando= false;
		this.cliListaMensaje= "";
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(parameter => {
			let filtro: ClienteFiltro;
			let accion: string;
			let obtCache= false;

				//console.log(parameter);
			if(parameter.codigo===undefined && parameter.domicilio===undefined) {
				accion= "Lista";
				filtro= new ClienteFiltro(false,
					'',
					parameter.nombre,
					'');
				
				if(parameter.nombre===undefined) {
					obtCache= true;
					filtro.nombre="%";
				} else {
					filtro.nombre= filtro.agrComodines(filtro.nombre);
				}
			} else {
				accion= "ListaPorFiltro";
				filtro= new ClienteFiltro(true,
					parameter.codigo,
					parameter.nombre,
					parameter.domicilio);
			}

			//console.log('ngOnInit');
			//console.log(filtro);
			
			accion= (this.dataServicio.esViajante() ? 'ListaDeViajante' : 'Lista');
			this.cliListaMensaje="Esperando respuesta... ";
			this.cliListando= true;
			this.dataServicio.obtClientes(accion, filtro, obtCache)
			.subscribe((data: ClienteListaVista[]) => {
				//console.log(data);
				//console.log('ngOnInit - dentro subscribe!');
				this.cliListando= false;
				this.cliLista.length = 0;
				data.forEach(
					(item: ClienteListaVista) => {this.cliLista.push(item);
				});
				if(this.cliLista.length==100) {
					this.cliListaMensaje= "Solo se muestran los primeros 100 Clientes coincidentes";
				} else {
					this.cliListaMensaje= this.cliLista.length.toString() +' Clientes/s encontrados!';
				}	
				},
				error => {
					this.cliListando= false;
					this.cliListaMensaje+= 'Ocurrió un error!<br>' +(typeof(error)==='string' ? error : JSON.stringify(error));
					//console.log(error);
				}
			);		
		});
	}

	cliAgregar(id: string): void {
		// ejecutar algun chequeo sobre el cliente por ejemplo su estado.
		// this.dataServicio.pedCliAgregar(this.cliLista[i].codigo);
		this.dataServicio.pedCliAgregar(id, null, null);
		this.router.navigate(['/Articulos']);
	}

	esListaVacia(): boolean {
		return this.cliLista.length==0;
	}

	busqRapida(): void {
		//this.tResBusqueda = 'Esperando respuesta (Lista)....';
		let nombre= this.frm.get("txtBusqueda").value;
		let filtro= new ClienteFiltro(false,"",nombre,"");	
		filtro.nombre= filtro.agrComodines(filtro.nombre);
	
		//console.log(filtro);
		this.cliListaMensaje="Buscando... ";
		this.cliListando= true;
		this.dataServicio.obtClientes((this.dataServicio.esViajante() ? 'ListaDeViajante' : 'Lista'), filtro, false)
		.subscribe( (data: ClienteListaVista[]) => {
			//console.log('busqRapida - dentro subscribe!');
			this.cliListando= false;
			this.cliLista.length = 0;
			data.forEach(
				(item: ClienteListaVista) => {this.cliLista.push(item);
			});
			if(this.cliLista.length===100) {
				//this.tResBusqueda= 'Mas de 100 Clientes encontrados, redefina la búsqueda para obtener menos filas';
				this.cliListaMensaje= "Solo se muestran los primeros 100 artículos coincidentes";
			} else {
				//this.tResBusqueda= this.cliLista.length.toString() +' Clientes encontrados!';
				this.cliListaMensaje= this.cliLista.length.toString() +' Clientes encontrados!';
			}
		},
		error => {
			//console.log(error);
			this.cliListando= false;
			//this.tResBusqueda= 'Ocurrió un error!\n No se pudieron recuperar datos!';
			//this.cliListaMensaje= "Ocurrió un error: " +(typeof(error)==='string' ? error : JSON.stringify(error));
			this.cliListaMensaje+= 'Ocurrió un error!<br>' +(typeof(error)==='string' ? error : JSON.stringify(error));
		}
		);
	}

}
