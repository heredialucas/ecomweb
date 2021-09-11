import { DlgMensajeComponent, DlgMensajeData } from './../Dialogos/dlg-mensaje/dlg-mensaje.component';
import { DlgRespuestaComponent } from './../Dialogos/dlg-respuesta/dlg-respuesta.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DepositoData } from './../Modelos/deposito-modelo';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
//import { ArticuloModelo } from '../modelos';
import { DataService } from '../data.service';
import { PedidoVista, PedidoVistaArticulo } from '../Modelos/pedido-modelo';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

	respuesta: string;
	mensRegistrado: string;

	aDeposito: DepositoData[];

	frm = new FormGroup({
		txtCerrar: new FormControl({value:false, disabled: !this.esPedidoAbierto()}, Validators.required),
		txtDeposito: new FormControl({value:"3", disabled: !this.esPedidoAbierto() || !this.esDepositoEditable() }, Validators.required),
		txtObs: new FormControl({value:"", disabled: !this.esPedidoAbierto() }),
	});
	
	iRegistrando: number;

  constructor(
		private data: DataService, 
		private router: Router,
		private dlg: MatDialog
		) {
		this.iRegistrando= 0;
		this.mensRegistrado="";
		this.aDeposito= Array<DepositoData>();
	 }

  ngOnInit(): void {
		this.respuesta="Aun sin respuesta";
		this.data.aDeposito.forEach((item: DepositoData) =>{
			if(item.id==0 || item.id==3 || item.id==-1) {
				this.aDeposito.push(item);
			}
		})

		this.frm.controls['txtCerrar'].setValue(this.data.pedido.estado>0);
		this.frm.controls['txtDeposito'].setValue(this.data.pedido.oDeposito.id)
		this.frm.controls['txtObs'].setValue(this.data.pedido.obs)
		if(!this.esPedidoAbierto()) {
			this.mensRegistrado="Pedido Cerrado, no es posible modificar!";
		}
	}
	
	esDepositoEditable(): boolean {
		return this.data.esDepositoEditable;
	}

  hayArticulos():boolean {
    return this.data.pedHayArticulos();
  }

  obtArticulos(): PedidoVistaArticulo[] {
    return this.data.pedido.aArt;
  }

  obtPedId(): string {
    let id= this.data.pedido.id;
    return (id >0? id.toLocaleString('es-AR') : '<N/D>');
	}
	
	obtViaCodigo():string {
		return this.data.pedido.oViajante.codigo;
	}

	obtViaNombre():string {
		return this.data.pedido.oViajante.nombre;
	}

  obtCliCodigo():string {
    return this.data.pedido.oCliente.codigo;
  }

  obtCliNombre():string {
    return this.data.pedido.oCliente.nombre;
  }

  obtCliDomicilio():string {
    return this.data.pedido.oCliente.domicilio;
  }

  obtArtsResumenCantidad():string {
    let cantidad:number=0;
    this.data.pedido.aArt.forEach(
      (i:PedidoVistaArticulo)=> {
        cantidad+= i.cantidad;
      });
    return cantidad.toLocaleString('es-AR') + ' (' + this.data.pedido.aArt.length.toLocaleString('es-AR') + ' distintos)';
  }

  obtArtsResumenMonto():number {
    let monto:number=0;
    this.data.pedido.aArt.forEach(
      (i:PedidoVistaArticulo)=> {
        monto+= i.obtPrecioTotal();
      });
    return monto;
  }

  esViajante(): boolean {
    return this.data.esViajante();
	}

	esInvitado(): boolean {
		return this.data.esInvitado();
	}
	
	esEditable(): boolean {
		return this.data.pedido.estadoDB==0;
	}

	artQuitar(articuloId: string): void {
		//Ocultar de la lista
		//Marcar para quitar en la lista
		//Poner cantidad a 0 (para no tener problemas en caso de volver a adicionar)
		//Si id (el id ane PedArticulo.id) >0, es artículo ya fue volcado en la DB
		if(this.data.pedido.estadoDB==0) {
			if(this.data.pedArtQuitar(articuloId)) {
			
			}				
		}

	}

	esPedidoAbierto():boolean {
		return this.data.pedido.estadoDB==0;
	}

	genNuevo() {
		if(this.data.pedHayCambios()) {
			const dialogConfig = new MatDialogConfig();

			dialogConfig.disableClose = true;
			dialogConfig.autoFocus = true;
			dialogConfig.data= {
				titulo: "Confirmar", 
				mensaje:"Los datos de Cliente/Articulos del Pedido actual se van a perder. ¿Está seguro de continuar?",
				iBoton: 1
			}

			const dlgRef= this.dlg.open(DlgRespuestaComponent, dialogConfig);		

			dlgRef.afterClosed().subscribe(result => {

				if(result==='Si') {
					this.data.pedNuevo();
					this.router.navigate(["/Clientes"]);
				}
			});
		} else {
			this.data.pedNuevo();
			this.router.navigate(["/Clientes"]);
	
		}
	}

	deshacer() {
		this.iRegistrando=2;
		alert("aun no implementado")!
		this.iRegistrando=0;
	}

	mostrarMensaje(tipo: number) {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data= {
			titGrafico: tipo, 
			titTexto: (tipo==1?"Exito":"Error"),
			mensaje:(tipo==1?"Pedido Registrado":"¡El Pedido NO FUE REGISTRADO"),
			botRotulo:"Entendido", 

		}

		const dlgRef= this.dlg.open(DlgMensajeComponent, dialogConfig);		
		/*
		dlgRef.afterClosed().subscribe(result => {

			if(result) {
				//if(result==='Si') {
			}
		});
		*/
	}


  registrar():void {
		let bCerrar= false;
		let iDeposito= -1;
		let tObs="";

		let iAvance=0
		let bContinuar= true;
		let mensRegistrado='';

		//console.log(this.data.pedido);


		this.iRegistrando= 1;
		do {
			iAvance++;
			switch(iAvance) {
				case 1:
					bContinuar= this.data.esViajante() || this.data.esCliente();
					mensRegistrado= "Solo los clientes registrados pueden generar un pedido, por favor Inicie Sesión";
					break;
				case 2:
					iDeposito= parseInt(this.frm.get('txtDeposito').value,10);
					bContinuar= this.data.pedValDeposito(iDeposito);
				case 3:
					bCerrar= this.frm.get('txtCerrar').value
					tObs= this.frm.get('txtObs').value
					bContinuar= this.data.pedAsigAtributos(iDeposito, bCerrar, tObs);
					mensRegistrado= "Imposible establecer Depósito";
					break;
				case 4:
					bContinuar= this.data.pedHayCambios();
					mensRegistrado= "No hay cambios que registrar";
					break;
				case 5:
					bContinuar= this.data.pedContarArticulos(0) > 0;
					mensRegistrado= "El pedido no contiene artículos";
					break;
				case 6:
					//Se evaluan solo los articulos que se van a agregar o modificar
					bContinuar= this.data.pedValCantPrecio();
					mensRegistrado= "El pedido contiene artículos con Cantidad 'cero' y/o Precio 'cero'";
					break;
						/*
				case 4:
					bContinuar= !(this.data.pedido.id==0 && this.data.pedContarArticulos(0) ==0);
					mensRegistrado= "El pedido no contiene artículos";
				case 5:
					//No cerrar un pedido sin artículos
					bContinuar= !(this.data.pedido.id > 0 && this.data.pedContarArticulos(1) ==0);
					mensRegistrado= "No se puede registrar, el pedido quedaría sin artículos";
					break;
						
				case 5:
					bContinuar= this.data.pedido.aArt.length >0;
					this.mensRegistrado= "El pedido no contiene artículos";
					break;
					*/
				case 10:
					//mensRegistrado= "entra en guardar";
					console.log("Request!");
					/* Mostrar spin */
					this.data.pedRegistrar(bCerrar)
					.subscribe(
						(mensRespuesta:string) => {
							this.iRegistrando= 0;
							if(mensRespuesta==='') {						
								this.mensRegistrado=  mensRespuesta;
								this.frm.controls['txtCerrar'].updateValueAndValidity()
								this.mostrarMensaje(1);
							} else {
								this.mensRegistrado= mensRespuesta;
								this.mostrarMensaje(0);
							}
						}
						,
						(err) => {
							this.iRegistrando= 0;
							this.mensRegistrado= 'Ocurrió un error!<br>' +(typeof(err)==='string' ? err : JSON.stringify(err));
							this.mostrarMensaje(0);
						}
					);
					break;
			}
		} while(bContinuar && iAvance <10);
		if(!bContinuar) {
			this.iRegistrando= 0;
			this.mensRegistrado= mensRegistrado;
		}
	}

}
