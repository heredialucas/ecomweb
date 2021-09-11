import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ArticuloListaVista, ArticuloFiltro} from '../Modelos/articulo-lista-modelo';
// import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../data.service';

@Component({
	selector: 'app-articulo-lista',
	templateUrl: './articulo-lista.component.html',
	styleUrls: ['./articulo-lista.component.css']
})
export class ArticuloListaComponent implements OnInit {
	artLista: ArticuloListaVista[];
	artListando: boolean
	artListaMensaje: string;

	//tResBusqueda: string;
	frm = new FormGroup({
		txtBusqueda: new FormControl(''),
	});

	constructor(
		private route: ActivatedRoute,
		// private router: Router,
		private dataServicio: DataService
	) {
		this.artLista = new Array<ArticuloListaVista>();
		}

	ngOnInit(): void {
		// let filtro: ArticuloFiltro;
		// console.log(this.route);

		//this.route.params.subscribe(parameter => {
		this.route.queryParams.subscribe(parameter => {
			let filtro: ArticuloFiltro;
			let accion: string;
			let obtCache= false;

			//console.log(parameter);
			if(parameter.rubro===undefined && parameter.subrubro===undefined && parameter.codigo===undefined) {
				accion= "Lista";
				filtro= new ArticuloFiltro(false,
					parameter.rubro,
					parameter.subrubro,
					parameter.descrip,
					parameter.codigo);
				
				if(parameter.descrip===undefined) {
					console.log("con cache!");
					obtCache= true;
					filtro.descrip="%";
				} else {
					filtro.descrip= filtro.agrComodines(filtro.descrip);
				}
			} else {
				accion= "ListaPorFiltro";
				filtro= new ArticuloFiltro(true,
					parameter.rubro,
					parameter.subrubro,
					parameter.descrip,
					parameter.codigo)
			}

			//console.log('ngOnInit');
			//console.log(filtro);
			this.artListaMensaje="Esperando respuesta... ";
			this.artListando= true;
			this.dataServicio.obtArts(accion, filtro, obtCache)
			.subscribe( (data: ArticuloListaVista[]) => {
				this.artListando= false;
				//console.log('ngOnInit - dentro subscribe!');
				this.artLista.length = 0;
				data.forEach(
					(item: ArticuloListaVista) => {this.artLista.push(item);
				});
				if(0< this.artLista.length && this.artLista.length < 100) {
					this.artListaMensaje= this.artLista.length.toString() +' artículos encontrados!';
				} else if(this.artLista.length == 100) {
					this.artListaMensaje= "Solo se muestran los primeros 100 artículos coincidentes";
				} else {
					this.artListaMensaje= "No se encontraron resultados coincidentes!";
				}
			},
			error => {
				this.artListando= false;
				this.artListaMensaje+= 'Ocurrió un error!<br>' +(typeof(error)==='string' ? error : JSON.stringify(error));
				//console.log(error);
				//alert('Ocurrió un error!\n No se pudieron recuperar datos!');
			}
		);
	});

}

hayArticulos():boolean {
	return this.artLista.length >0;
}

busqRapida(accion: string): void {
	//this.tResBusqueda = 'Esperando respuesta (Lista)....';
	let descrip= this.frm.get("txtBusqueda").value;
	let filtro= new ArticuloFiltro(false,"","","","");

	filtro.codigo= filtro.agrComodines(descrip);
	filtro.descrip= filtro.agrComodines(descrip);

	//console.log(filtro);
	this.artListaMensaje="Esperando respuesta... ";
	this.artListando= true;
	this.dataServicio.obtArts(accion, filtro, false)
	.subscribe( 
		(data: ArticuloListaVista[]) => {
			this.artListando= false;
			this.artLista.length = 0;
			data.forEach(
				(item: ArticuloListaVista) => {this.artLista.push(item);
			});
			if(0< this.artLista.length && this.artLista.length < 100) {
				this.artListaMensaje= this.artLista.length.toString() +' artículos encontrados!';
			} else if(this.artLista.length == 100) {
				this.artListaMensaje= "Solo se muestran los primeros 100 artículos coincidentes";
			} else {
				this.artListaMensaje= "No se encontraron resultados coincidentes!";
			}
		},
		error => {
			//console.log(error);
			this.artListaMensaje+= 'Ocurrió un error!<br>' +(typeof(error)==='string' ? error : JSON.stringify(error));
		}
	);
}
}