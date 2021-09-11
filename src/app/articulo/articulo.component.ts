import { Component, OnInit } from '@angular/core';
// import {ArticuloEdicionMod} from '../modelos';
// import {ArticuloInterface} from '../articulo-interface';
import {ArticuloVista, SolArticulo} from '../Modelos/articulo-modelo';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {DataService} from '../data.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Transicion } from '../Modelos/transicion';
import { DlgRespuestaComponent } from './../Dialogos/dlg-respuesta/dlg-respuesta.component';
import { DlgMensajeComponent } from './../Dialogos/dlg-mensaje/dlg-mensaje.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


@Component({
	selector: 'app-articulo',
	templateUrl: './articulo.component.html',
	styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit {
	public art: ArticuloVista;
	public Aviso: any;
	public bAgregar = true;

	tra: Transicion;
	
	frm: FormGroup = new FormGroup({
		cantidad: new FormControl('1'),
		bAdicionar: new FormControl('1')
	});

	constructor(
		private route: ActivatedRoute,
		// private router: Router,
		private dataServicio: DataService,
		private dlg: MatDialog
		) {
		// this.art= new ArticuloModelo(iArt);
		this.art = new ArticuloVista();
		this.bAgregar = true;
		this.tra= new Transicion();

	}

	ngOnInit(): void {
		const codigo = this.route.snapshot.paramMap.get('codigo');
		if (codigo > '') {
			this.tra.iniciar("Recuperado datos del Artículo... ");
			this.dataServicio.obtArticulo(codigo).subscribe(
				(data: ArticuloVista) => {
					this.tra.finalizarOk();
					this.art = data;
					//console.log(this.art);
				},
				(error) => {
					//console.log(error);
					this.tra.finalizarConError(
						"Ocurrió un error!",
						(typeof(error)=='string'? error : JSON.stringify(error))
					);
					this.art.genVacio();
					alert(this.tra.mensaje +'<br>'+this.tra.masDetalle);
				}
			);
		} else {
			this.art.genVacio();
		}
	}

	cantIncrementar(i:number):void {
		if(this.bAgregar) {
			let cantidad = parseInt(this.frm.get('cantidad').value, 10);
			cantidad += i;
			if(cantidad ==0) cantidad=1;
			this.frm.controls['cantidad'].setValue(cantidad);
		}
	}

	obtIVA(): number {
		return this.art.obtIVA("2");
	}

	obtPrecio(): number {
		return this.art.obtPrecio("2");
	}

	obtPrecioConIVA(): number {
		return this.art.obtPrecioConIVA("2");
	}

	obtStock(): number {
		return this.art.obtStock();
	}

	agrArticulo(): void {
		let cantidad: number;
		//let bAdicionar: boolean;
		let CantPrevia: number= 0;

		if(this.bAgregar) {
			cantidad = parseInt(this.frm.get('cantidad').value, 10);
			if(!isNaN(cantidad)) {
				//bAdicionar = this.frm.get('bAdicionar').value === '1';
				//console.log(this.frm.get('bAdicionar').value);
				CantPrevia= this.dataServicio.pedArtAgregar(this.art, cantidad, false);
				if(CantPrevia ==0) {
					this.bAgregar = false;
				} else {
					//Solicitar confirmación para corregir la nueva cantidad
					const dialogConfig = new MatDialogConfig();

					dialogConfig.disableClose = true;
					dialogConfig.autoFocus = true;
					dialogConfig.data= {
						titulo: "Confirmar", 
						mensaje:"El artículo ya existe en el Pedido con una cantidad de " + CantPrevia +" unidades. ¿Corregir la cantidad con " +cantidad +" unidades?",
						iBoton: 1
					}

					const dlgRef= this.dlg.open(DlgRespuestaComponent, dialogConfig);		
		
					dlgRef.afterClosed().subscribe(result => {	
						if(result==='Si') {
							const cantPrevia= this.dataServicio.pedArtAgregar(this.art, cantidad, true);
							if(cantPrevia ==0) {
								this.bAgregar = false;
							} else {
								alert("El artículo no se pudo agregar!!!");
							}
						}
					});
				}
			} else {
				//Solicitar confirmación para corregir la nueva cantidad
				const dialogConfig = new MatDialogConfig();

				dialogConfig.disableClose = true;
				dialogConfig.autoFocus = true;
				dialogConfig.data= {
					titGrafico: 0,
					titTexto: "Atención",
					mensaje: "La cantidad ingresada no es correcta",
					botRotulo: "Entendido"
				}

				const dlgRef= this.dlg.open(DlgMensajeComponent, dialogConfig);

			}
		} else {
			this.bAgregar = true;
		}


		/*
		if (this.bAgregar) {
			this.bAgregar = false;
			//console.log(this.art);
			// console.log("llamada a agrArticulo");
			cantidad = parseInt(this.frm.get('cantidad').value, 10);
			bAdicionar = this.frm.get('bAdicionar').value === '1';
			//console.log(this.frm.get('bAdicionar').value);
			this.dataServicio.pedArtAgregar(this.art, cantidad, bAdicionar);
		} else {
			this.bAgregar = true;
		}
		*/
	}

	esPedidoAbierto(): boolean {
		return this.dataServicio.pedido.estadoDB==0;
	}

	esViajante(): boolean {
		return this.dataServicio.esViajante();
	}

	esCliente(): boolean {
		return this.dataServicio.esCliente();
	}
}
