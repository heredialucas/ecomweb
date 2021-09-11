import { FiltroPedidoLista, FiltroVisitaEx } from './Modelos/filtro-base';
import { DlgGenericoComponent } from './Dialogos/dlg-generico/dlg-generico.component';
// import { AppComponent } from './app.component';
import { Injectable } from '@angular/core';
// import { ClienteEdicionMod, ClienteListaMod, RespPedido} from './modelos';
import { ViajanteData, ViajanteVista, RespViajanteLista } from './Modelos/viajante-modelo';
import { ClienteVista, SolCliente, RespCliente, ClienteFiltro } from './Modelos/cliente-modelo';
import { ClienteListaVista, SolClienteLista, RespClienteLista } from './Modelos/cliente-lista-modelo';
import { ArticuloVista, SolArticulo, RespArticulo } from './Modelos/articulo-modelo';
import { ArticuloListaVista, SolArticuloLista, RespArticuloLista, ArticuloFiltro } from './Modelos/articulo-lista-modelo';
import { PedidoVista, PedidoVistaArticulo, RespPedido } from './Modelos/pedido-modelo';
import { PedidoFiltro, PedidoListaVista, SolPedidoLista, RespPedidoLista } from './Modelos/pedido-modelo';
// import {SolPedidoRegistrar}  from './Modelos/pedido-modelo';
// import { PedidoArticuloEdicionMod} from './modelos';
// import { PedidoEdicionMod as PedidoVista } from './modelos';
import { SesionUsuario, RespSesion } from './Modelos/sesion-modelo';
import { DepositoData } from './Modelos/deposito-modelo';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DocumentoVista, DocListaVista, RespDocLista, DocListaData, DocumentoFiltro, DocDetalleVista } from './Modelos/documento';
import { GeoData } from './Modelos/data-modelo';
import { RespVisitaRegistro, RespVisitaLista, VisitaVista } from './Modelos/visita-modelo';
import { visitAll } from '@angular/compiler';


@Injectable({
	providedIn: 'root'
})

export class DataService {

	autenticado = false;
	usuario = '';
	//0: Invitado, 1: Cliente, 2: Viajante
	private rol: number; 
	// private rutaBase = 'http://localhost:8080/eComm';
	private rutaBase = 'http://localhost/ecomerce/php'; // 'http://sd-1586933-h00004.ferozo.net';
	//private rutaBase = '';

	artFiltro: ArticuloFiltro;
	artFiltrado: ArticuloListaVista[];

	cliFiltro: ClienteFiltro;
	cliFiltrado: ClienteListaVista[];

	pedCliFiltro: PedidoFiltro;
	pedCliFiltrado: PedidoListaVista[];

	pedViaFiltro: PedidoFiltro;
	pedViaFiltrado: PedidoListaVista[];

	pedido: PedidoVista;
	aViajante: ViajanteData[]; // Viajante no tiene vista (por ahora)
	aDeposito: DepositoData[]; //Deposito no tiene vista por ahora
	oDepositoDefecto: DepositoData; //Deposito que se utiliza por defecto
	esDepositoEditable: boolean;	//Indica si el usuario puede cambiar el depósito por defecto

	//Documento
	aViaDoc: DocListaVista[];
	oViaDoc: DocListaVista;

	constructor(private http: HttpClient) {
		this.rol = 0; // Invitado
		this.aViajante = new Array<ViajanteData>();
		// Articulo - Filtro
		this.artFiltro = new ArticuloFiltro(false,"","","","");
		this.artFiltrado = Array<ArticuloListaVista>();
		// Articulo - Filtro
		this.cliFiltro = new ClienteFiltro(false,"","","");
		this.cliFiltrado = Array<ClienteListaVista>();
		//Pedidos rol Cliente - Filtro
		this.pedCliFiltro= new PedidoFiltro(false,"","","",null,null);
		this.pedCliFiltrado= Array<PedidoListaVista>();
		//Pedidos rol Viajante - Filtro
		this.pedViaFiltro= new PedidoFiltro(false,"","","",null,null);
		this.pedViaFiltrado= Array<PedidoListaVista>();

		// this.rol="Viajante";
		this.pedido = new PedidoVista();
		this.pedido.oCliente = new ClienteVista();
		this.pedido.aArt = new Array<PedidoVistaArticulo>();
		// this.pedido.oDeposito= new DepositoVista();
		// this.pedido.oViajante= new ViajanteVista();
		this.pedido.estado = 0; // 0: Abierto (En Confección/ Editable), 1: Cerrado (No Editable)
		this.pedido.operador = 1; // 0:Solo Visualizar, 1:Agregar, 2:Actualizar

		this.aDeposito= Array<DepositoData>();
		this.oDepositoDefecto= new DepositoData();
		this.oDepositoDefecto.id= -1;
		this.oDepositoDefecto.nombre="<No definido>";
		this.aDeposito.push(this.oDepositoDefecto);
		this.esDepositoEditable= true;
		// this.http= new HttpClient();

		//Documento
		this.aViaDoc= Array<DocListaVista>();
		this.oViaDoc= null;
	}

	/*
	esRol(rol: string): boolean {
		return this.rol === (rol === 'Cliente' ? 1 : (rol === 'Viajante' ? 2 : 0));
	}
	*/

	esInvitado(): boolean {
		return this.rol === 0;
	}

	esCliente(): boolean {
		return this.rol === 1;
	}

	esViajante(): boolean {
		return this.rol === 2 || this.rol === 3;
	}

	esGestion(): boolean {
		//Logística
		return this.rol == 8;
	}

	agrComodines(cadena: string): string {
		if (!(cadena == null)) {
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

	iniSesion(usuario: string, clave: string): Observable<boolean> {
		const body = new HttpParams()
			.set('accion', 'abrir')
			.set('usuario', usuario)
			.set('clave', clave);

		return this.http.post<RespSesion>(
			this.rutaBase + '/api/Acciones/Sesion.php',
			body.toString(),
			{headers: new HttpHeaders()
				.set('Content-Type', 'application/x-www-form-urlencoded')
			}
			)
			.pipe(
				map((data: RespSesion) => {
					//console.log("Respuesta inicio de Sesion")
					//console.log(data);
					this.autenticado = data.bOk;
					if (this.autenticado) {
						// Establecer sesión:
						// Rol Cliente: cargar datos del cliente y viajantes asociados, si hay solo un viajante cargarlo al pedido.
						// Rol Viajante: blanquear dato del cliente y como viajante asociado solo este cliente.
						this.establecerSesion(usuario, data.usuario, data.aViajante, data.aDeposito);
						// this.pedCliAgregarSesion(data.usuario);
					}
					// console.log(data);
					return data.bOk;
				}
			)
			);
	}

	pedNuevo():void {
		this.pedido.id= 0;
		this.pedido.estado=0; //sin cambios
		this.pedido.estadoDB= 0; //sin cambios
		this.pedido.operador= 1; //Se inicia con un Pedido Nuevo
		if(this.pedido.oDeposito.id !== this.oDepositoDefecto.id) 
			this.pedido.oDeposito.parseData(this.oDepositoDefecto);
		this.pedido.obs='';
		this.pedido.hayCambios= false;

		this.pedido.aArt.length=0;
		if(this.rol== 1) {
			//Cliente: Limpiar solo los artículos
		} else if(this.rol==2) {
			//Viajante
			this.pedido.oCliente.id = '';
			this.pedido.oCliente.codigo = 'ND';
			this.pedido.oCliente.nombre = '<No Disponible>';
			this.pedido.oCliente.domicilio = '<No Disponible>';
		} else {
			//Invitado
			this.pedido.oCliente.id = '';
			this.pedido.oCliente.codigo = 'invitado';
			this.pedido.oCliente.nombre = 'Invitado';
			this.pedido.oCliente.domicilio = '<No Disponible>';
		}
	}

	establecerSesion(usuario: string, data: SesionUsuario, aVia: ViajanteData[], aDep: DepositoData[]): void {
		this.usuario= usuario;
		this.rol = data.rol;

		this.pedido.id= 0;
		this.pedido.obs="";
		this.pedido.estado=0;
		this.pedido.estadoDB= 0;
		this.pedido.operador= 1; //Se inicia con un Pedido Nuevo

		this.pedido.oCliente.id = '';
		this.pedido.oCliente.codigo = 'invitado';
		this.pedido.oCliente.nombre = 'Invitado';
		this.pedido.oCliente.domicilio = '<No Disponible>';

		this.aViajante.length= 0;

		if(this.aDeposito.length >0) {
			this.aDeposito.length=0;
			aDep.forEach((item:DepositoData)=>{
				if(item.id== data.depositoId) {
					this.oDepositoDefecto= item;
				}
				this.aDeposito.push(item);
			});
		}

		//El viajante siempre puede cambiar el Depósito
		this.esDepositoEditable= this.esViajante() || data.depositoId==-1;
		this.pedido.oDeposito.parseData(this.oDepositoDefecto);
		
		if (this.rol === 1) {
			//Es Cliente
			this.pedido.oCliente.id = data.entidadId;
			this.pedido.oCliente.codigo = data.codigo;
			this.pedido.oCliente.nombre = data.nombre;
			this.pedido.oCliente.domicilio = data.domicilio;
			//this.aViajante= new Array<ViajanteData>();
			aVia.forEach((item: ViajanteData) => {
				this.aViajante.push(item);
			});

			if (aVia.length > 0 ) {
				this.pedido.oViajante.id = aVia[0].id;
				this.pedido.oViajante.codigo = aVia[0].codigo;
				this.pedido.oViajante.nombre = aVia[0].nombre;
			} else {
				this.pedido.oViajante.id = '';
				this.pedido.oViajante.codigo = 'ND';
				this.pedido.oViajante.nombre = '<Sin Viajante>';
			}

		} else if (this.esViajante() || this.esGestion()) {
			//Es Viajante
			const via = new ViajanteData();
			via.id = data.entidadId;
			via.codigo = data.codigo;
			via.nombre = data.nombre;
			this.aViajante.push(via);
			this.pedido.oViajante.parseData(via);
		}

		this.pedViaFiltrado.length=0;
		this.pedCliFiltrado.length=0;
		this.artFiltrado.length=0;

		this.artFiltro.blanquear();
		this.cliFiltro.blanquear();
		
		this.pedido.hayCambios= false;
	}

	finSesion(): Observable<boolean> {
		const body = new HttpParams()
			.set('accion', 'cerrar');

		this.cliFiltrado.length=0;
		this.artFiltrado.length=0;
		this.pedViaFiltrado.length=0;
		this.pedCliFiltrado.length=0;
		this.aViaDoc.length=0;

		this.cliFiltro.blanquear();
		this.artFiltro.blanquear();


		this.usuario='';
		this.rol=0; //Invitado

		// Pedido
		this.pedido.id=0;
		this.pedido.estado=0;
		this.pedido.operador=0;
		// Cliente blanquear
		this.pedido.oCliente.id= '';
		this.pedido.oCliente.codigo = '<N/D>';
		this.pedido.oCliente.nombre = '<N/D>';
		this.pedido.oCliente.domicilio = '<N/D>';
		// Viajante blanquear
		this.pedido.oViajante.id = '';
		this.pedido.oViajante.codigo = '<N/D>';
		this.pedido.oViajante.nombre = '<N/D>';
		// Arts blanquear
		this.pedido.aArt.length = 0;
		// Otros datos
		this.aViajante.length= 0;
		// this.pedido.oViajante= null;
		// this.pedido.oDeposito= null;
	
		return this.http.post<RespSesion>(
			this.rutaBase + '/api/Acciones/Sesion.php',
			body.toString(),
			{headers: new HttpHeaders()
				.set('Content-Type', 'application/x-www-form-urlencoded')
			}
			)
			.pipe(
				map((data: RespSesion) => {
					//console.log(data);
					//Blanquear datos de conexión, aun cuando el pedido de cierre falle.
					/*
					if ( data.bOk) {
						this.usuario='';
						this.rol=0; //Invitado

						// Pedido
						this.pedido.id=0;
						this.pedido.estado=0;
						this.pedido.operador=0;
						// Cliente blanquear
						this.pedido.oCliente.id= '';
						this.pedido.oCliente.codigo = '<N/D>';
						this.pedido.oCliente.nombre = '<N/D>';
						this.pedido.oCliente.domicilio = '<N/D>';
						// Viajante blanquear
						this.pedido.oViajante.id = '';
						this.pedido.oViajante.codigo = '<N/D>';
						this.pedido.oViajante.nombre = '<N/D>';
						// Arts blanquear
						this.pedido.aArt.length = 0;
						// Otros datos
						this.aViajante.length= 0;
						// this.pedido.oViajante= null;
						// this.pedido.oDeposito= null;
					}
					*/
					return data.bOk;
				}
			)
			);
	}

	pedAsigAtributos(iDeposito: number, bCerrado: boolean, tObs: string): boolean {
		//Deposito de valida con un deposito correcto
		//Estado
		if(bCerrado && this.pedido.estadoDB==0) {
			if(this.pedido.operador==0) this.pedido.operador=2; //Modificar
			this.pedido.estado= 1;
			this.pedido.hayCambios= true;
		} else 
			if(!bCerrado) this.pedido.estado=0;

		//console.log("observacion");
		//console.log(this.pedido.obs);
		//Observacion
		if(tObs !== this.pedido.obs) {
			if(this.pedido.operador==0) this.pedido.operador=2; //Modificar
			this.pedido.obs= tObs;
			this.pedido.hayCambios= true;
		}

		return true;
	}

	pedHayCliente(): boolean {
		return this.pedido.oCliente.id >'';
	}

	pedHayArticulos(): boolean {
		return this.pedido.aArt.length > 0;
	}

	pedContarArticulos(opcion: number): number {
		/*Opcion
		0: Articulos contenidos en el pedido, los que se ven como artículos (estén o no volcados a la DB)
		1: Articulos con modificación
		*/
		let n: number;
		
		n=0;
		n= this.pedido.aArt
		.map((item:PedidoVistaArticulo):number => {
			let cuenta:number = 
				opcion==0 && (item.operador== 0 || item.operador ==1 || item.operador == 2)
				|| opcion==1 && (item.operador==1 || item.operador == 2 || item.operador == 3)
				? 1 : 0;

			return cuenta;
		})
		.reduce( (a:number, b:number) => {
			return a+b;
		},0);

		//console.log(n);
		return n;
	}

	pedHayCambios(): boolean {
		/*
		//Se pide cerrar el pedido
		let hayCierre= false;
		if(bCerrado && this.pedido.estadoDB==0) {
			if(this.pedido.operador==0) this.pedido.operador=2; //Modificar
			this.pedido.estado= 1;
			hayCierre= true;	
		}

		if(iDeposito !== this.pedido.oDeposito.id) {
			let oDeposito= this.aDeposito.find((item:DepositoData) => item.id=== iDeposito);
			if(this.pedido.operador==0) this.pedido.operador=2; //Modificar
			if(oDeposito!== undefined) {
				this.pedido.oDeposito= oDeposito;
				this.pedido.hayCambios= true;
			}
		}
		*/

		return this.pedido.hayCambios;
	}

	pedCliAgregar(id: string, cliVista: ClienteVista, cliLista: ClienteListaVista) {

		if(cliVista !== null) {
			this.pedido.oCliente.id= cliVista.id;
			this.pedido.oCliente.codigo= cliVista.codigo;
			this.pedido.oCliente.nombre= cliVista.nombre;
			this.pedido.oCliente.domicilio= cliVista.domicilio;
			this.pedido.hayCambios= true;
		} else if(cliLista!==null) {
			this.pedido.oCliente.id= cliLista.id
			this.pedido.oCliente.codigo= cliLista.codigo;
			this.pedido.oCliente.nombre= cliLista.nombre;
			this.pedido.oCliente.domicilio= cliLista.domicilio;
			this.pedido.hayCambios= true;
		} else {
			this.obtCliente(id).subscribe(
				((data: ClienteVista) => {
					this.pedido.oCliente = data;
					this.pedido.hayCambios= true;
				})
			);
		}
	}

	pedCliAgregarSesion(rol: number, usu: SesionUsuario) {
		if (rol === 1) {
			//El usuario es Cliente, el pedido se asigna solo a él (no puede cambiar el Cliente del Pedido)
			this.pedido.oCliente.codigo = usu.codigo;
			this.pedido.oCliente.domicilio = usu.domicilio;
			this.pedido.oCliente.id = usu.entidadId;
		} else {
			//El usuario es Viajante, se establece 
			this.pedido.oCliente = new ClienteVista();
		}
	}

	/** OJO: no puede haber ArticuloId repetido */
	/** Devuelve la cantidad, en caso que el articulo ya exista en el pedido */
	pedArtAgregar(art: ArticuloVista, cantidad: number, bForzar: boolean): number {
		const artPed = art.genPedidoArticulo();
		const i = this.pedido.aArt.findIndex((item: PedidoVistaArticulo) => item.articuloId === artPed.articuloId);
		let CantidadPrevia: number =0;

		if ( i < 0) {
			artPed.id= 0;
			artPed.cantidad= cantidad;
			artPed.operador= 1; // agregar;
			this.pedido.aArt.push(artPed);
			this.pedido.hayCambios= true;
		} else {
			//El articulo existe
			//El articulo fue quitado o se fuerza modificar la cantidad previamente existente o la cantidad indicada sigue siendo la misma
			if(this.pedido.aArt[i].operador==3 || bForzar || this.pedido.aArt[i].cantidad== cantidad ) {
				//Si fue quita, se reactiva
				//Si la cantidad es la misma no se toma como un error
				this.pedido.aArt[i].operador= (this.pedido.aArt[i].id >0 ? 2 : 1);
				//this.pedido.aArt[i].cantidad= (bAdicionar? this.pedido.aArt[i].cantidad +cantidad : cantidad);
				this.pedido.aArt[i].cantidad= cantidad;
				this.pedido.hayCambios= true;
			} else {
				//El articulo ya existe en el pedido, preguntar si hay que reemplazar con el valor nuevo
				CantidadPrevia= this.pedido.aArt[i].cantidad;
			}
		}

		return CantidadPrevia;
	}

	pedArtQuitar(articuloId: string): boolean {
		const i = this.pedido.aArt.findIndex((item: PedidoVistaArticulo) => item.articuloId === articuloId);

		if(i>=0) {
			//this.pedido.aArt[i].id >0 => fue registrado en la DB
			this.pedido.aArt[i].cantidad= 0; //Para permitir volver a agregar
			this.pedido.aArt[i].operador= 3; //quitar
			this.pedido.hayCambios= true;
		}
		return i>=0;
	}

	pedRegistro(pedidoId: number, clienteId: string):Observable<boolean> {
		const headers = new HttpHeaders()
			.append('Content-Type', 'application/json');

		const entidadId= (this.rol==1? this.pedido.oCliente.id : (this.rol==2 || this.rol==8 ? this.pedido.oViajante.id : ""));

		const oSol = this.pedido.genSolRegistro(this.rol, this.usuario, pedidoId, entidadId);
		console.log(oSol);

		return this.http.post<RespPedido>(
			this.rutaBase + '/api/Acciones/Pedido.php',
			JSON.stringify(oSol),
			{headers})
			.pipe(
				map((data: RespPedido) => {
					console.log(data);
					if (data.bOk) {
						data.bOk = this.pedido.parseRespuesta(data, this.rol);
						this.pedido.hayCambios= false;
					} else {
						// algo hay que hacer con el pedido cargado!
					}
					return data.bOk;
				})
				/*,
				catchError(err => {
					console.log('caught mapping error and rethrowing', err);
					return throwError(err);
				}),
				catchError(err => {
					console.log('caught retrow error, providing fallback value', err);
					return err;
				})
				*/
			);

	}

	pedValDeposito(iDep: number):boolean {
		let bOk= true;

		if(this.pedido.oDeposito.id !== iDep) {
			this.pedido.hayCambios= true;
			let oDeposito= this.aDeposito.find((item:DepositoData) => item.id=== iDep);
			if(oDeposito!== undefined) {
				this.pedido.oDeposito.parseData(oDeposito);
				if(this.pedido.operador==0) this.pedido.operador=2; //Modificar
			} else {
				bOk=false;
			}
		}
		return bOk;
	}

	pedValCantPrecio(): boolean {
		//Solo se validan los articulos que se van a agregar o modificar
		//recordar que los pedidos que se quitan, se ponen en cantidad cero
		return !this.pedido.aArt.some((item:PedidoVistaArticulo)=>{ 
			return 
				(item.operador==1 || item.operador== 2) //agregar o modificar
				&& (item.cantidad==0 || item.precio==0)
		});
	}

	pedRegistrar(bCerrar: boolean): Observable<string> {
		const headers = new HttpHeaders()
			.append('Content-Type', 'application/json');

		if (bCerrar) { this.pedido.estado = 1; } // Cerrar el pedido

		const oSol = this.pedido.genSolRegistrar();
		oSol.accion = 'Registrar';
		oSol.rol = this.rol;
		oSol.usuario = this.usuario;
		console.log(JSON.stringify(oSol));
		//console.log(JSON.stringify(this.pedido));
		return this.http.post<RespPedido>(
				this.rutaBase + '/api/Acciones/Pedido.php',
				JSON.stringify(oSol),
				{headers})
				.pipe(
				map( (data: RespPedido) => {
						// let bOk: boolean;
						if (data.bOk) {
							data.mensaje="";
							data.bOk = this.pedido.parseRespuesta(data, this.rol);
							if(!data.bOk) {
								data.mensaje=
									'El pedido fue registrado con una advertencia cuando se recuperaron sus datos<br>'
									+'Por favor, vuelva a cargar el pedido y verifique que los datos sean correctos.';
							}
							this.pedido.hayCambios= false;							
						} else {
							if(data.mensaje==='') data.mensaje="";
						}
						return data.mensaje;
				})
				);
					/*
					,
          catchError( (err:any) => {
            console.log('caught mapping error and rethrowing', err);
            return false;
					})
          catchError(err => {
            console.log('caught retrow error, providing fallback value', err);
            return err;
          })
          */

	}

	asigArtFiltro(filtro: ArticuloFiltro): boolean {
		let bDistinto = false;

		this.artFiltro.asignar(filtro);

		return bDistinto;
	}

	obtArts(accion: string, filtro: ArticuloFiltro, bCache: boolean): Observable<ArticuloListaVista[]> {
		//this.artFiltro.asignar(filtro);
		if(!bCache && this.artFiltro.asignar(filtro)) {
			const sol = new SolArticuloLista();
			const encabezado = new HttpHeaders()
				.append('Content-Type', 'application/json');
			//console.log("Recuperando nuevos datos");
			sol.accion = accion;
			sol.rol= this.rol;
			sol.entidadId= this.obtEntidadId();
			sol.asigFiltro(filtro)
			//console.log(sol);
			return this.http.post<RespArticuloLista>(
				this.rutaBase + '/api/Acciones/Articulo.php',
				JSON.stringify(sol),
				{headers: encabezado}
				).pipe(
					map((data: RespArticuloLista) => {
						//console.log(data);
						this.artFiltrado.length = 0;
						if(data.bOk) {
							this.artFiltrado= data.aLista;
						}
						return this.artFiltrado;
					}
			));	
		} else {
			//console.log("Filtro cacheado");
			return new Observable<ArticuloListaVista[]>(observer => {
				observer.next(this.artFiltrado);
			});
		}
	}

	obtEntidadId(): string {
		let entidadId='';

		if(this.rol!==0) {
			entidadId= 
				this.rol==1 ? this.pedido.oCliente.id :
				this.rol==2 || this.rol==3 ? this.pedido.oViajante.id :
				'';
		}

		return entidadId;
	}

	obtArticulo(id: string): Observable<ArticuloVista> {
		const encabezado = new HttpHeaders()
			.append('Content-Type', 'application/json');
		const oSol = new SolArticulo();
		oSol.accion = 'Registro';
		oSol.rol= this.rol;
		oSol.entidadId= this.obtEntidadId();
		oSol.id = id;
		//console.log(oSol);
		return this.http.post<RespArticulo>(
			this.rutaBase + '/api/Acciones/Articulo.php',
			JSON.stringify(oSol),
			{headers: encabezado}
			)
		.pipe(map((data: RespArticulo) => {
			const av = new ArticuloVista();
			if (data.bOk) {
				av.parseData(data.oRegistro);
			} else {
				alert('Respuesta Error: ' + data.mensaje);
			}
			return av;
		}));
	}

	obtCliente(id: string): Observable<ClienteVista> {
		const encabezado = new HttpHeaders()
			.append('Content-Type', 'application/json');
		const oSol = new SolCliente();
		oSol.accion = 'Registro';
		oSol.rol= this.rol;
		oSol.entidadId= this.obtEntidadId();
		oSol.id = id;
		//oSol.codigo = codigo;

		return this.http.post<RespCliente>(
			this.rutaBase + '/api/Acciones/Cliente.php',
			JSON.stringify(oSol),
			{headers: encabezado})
		.pipe(
			map((data: RespCliente) => {
				const cv = new ClienteVista();
				if (data.bOk) {
					//console.log(data);
					cv.parseData(data.oRegistro);
				} else {
					alert(data.mensaje);
				}
				return cv;
			})
		);
	}

	obtClientes(accion: string, filtro: ClienteFiltro, bCache: boolean): Observable<ClienteListaVista[]> {
		if(!bCache && this.cliFiltro.asignar(filtro)) {
			const sol = new SolClienteLista();
			const encabezado = new HttpHeaders()
				.append('Content-Type', 'application/json');
			
			//console.log("Recuperando nuevos datos");
			sol.accion = accion;
			sol.rol= this.rol;
			sol.entidadId= this.obtEntidadId();
			sol.asigFiltro(filtro);
			return this.http.post<RespClienteLista>(
				this.rutaBase + '/api/Acciones/Cliente.php',
				JSON.stringify(sol),
				{headers: encabezado}
				).pipe(
					map((data: RespClienteLista) => {
						//console.log(data);
						this.cliFiltrado.length = 0;
						if(data.bOk) {
							this.cliFiltrado= data.aLista;
						} else {
							if(data.mensaje=="Acceso Denegado!") {
								this.finSesion();
							}
						}
						return this.cliFiltrado;
					}
			));
		} else {
			//console.log("Filtro cacheado");
			return new Observable<ClienteListaVista[]>(observer => {
				observer.next(this.cliFiltrado);
			});

		}

		/*
		const encabezado = new HttpHeaders()
			.append('Content-Type', 'application/json');
		const oSol = new SolClienteLista();
		oSol.accion = 'Lista';
		oSol.codigo = this.agrComodines(cliFiltro.codigo);
		oSol.nombre = this.agrComodines(cliFiltro.nombre);
		oSol.domicilio = this.agrComodines(cliFiltro.domicilio);

		return this.http.post<RespClienteLista>(
			this.rutaBase + '/api/Acciones/Cliente.php',
			JSON.stringify(oSol),
			{headers: encabezado})
		.pipe(
			map((data: RespClienteLista) => {
				return data.aLista;
			})
		);
		*/
	}

	obtSesion():Observable<any[]> {
		const sol = new SolPedidoLista();
		const encabezado = new HttpHeaders()
			.append('Content-Type', 'application/json');

		return this.http.post<any[]>(
				this.rutaBase + '/api/Acciones/VerSesion.php',
				'',
				{headers: encabezado}
				)
				map((data:any[])=> {
					return data;
				});
	}

	pedObtLista(filtro: FiltroPedidoLista, bCache:boolean):Observable<PedidoListaVista[]> {		
		//Si el filtro es distinto al asignado
		//if(!bCache && this.pedViaFiltro.asignar(filtro)) {
			//const sol = new SolPedidoLista();
			const encabezado = new HttpHeaders()
				.append('Content-Type', 'application/json');
			
			//sol.accion = "Lista";
			//sol.asigFiltro(filtro)
			//console.log(sol);
			return this.http.post<RespPedidoLista>(
				this.rutaBase + '/api/Acciones/Pedido.php',
				filtro.genSolicitud("Lista"),
				{headers: encabezado}
				).pipe(
					map((data: RespPedidoLista) => {
						console.log(data);
						if(data.bOk) {
							this.pedCliFiltrado.length = 0;
							data.aLista.forEach(iData => {
								let item= new PedidoListaVista();
								item.asigDesdeData(iData);
								this.pedCliFiltrado.push(item);
							});
						} else {
							if (data.mensaje=="Acceso Denegado" || data.mensaje=="Acceso Denegado!") {
								//Asume que se realiza una tarea no permitida,
								//cierra la sesión.						
								this.finSesion().subscribe(
									(data:boolean) => {}
								);
							}
						}
						return this.pedCliFiltrado;
					}
			));
		/*
		} 
		else {
			//console.log("Filtro cacheado");
			return new Observable<PedidoListaVista[]>(observer => {
				observer.next(this.pedViaFiltrado);
			});
		}
		*/
	}

	obtPedidosVia(filtro: PedidoFiltro, bCache:boolean):Observable<PedidoListaVista[]> {
		//Si el filtro es distinto al asignado
		if(!bCache && this.pedViaFiltro.asignar(filtro)) {
			//const sol = new SolPedidoLista();
			const encabezado = new HttpHeaders()
				.append('Content-Type', 'application/json');
			
			//sol.accion = "Lista";
			//sol.asigFiltro(filtro)
			//console.log(sol);
			return this.http.post<RespPedidoLista>(
				this.rutaBase + '/api/Acciones/Pedido.php',
				filtro.genSolicitud("Lista"),
				{headers: encabezado}
				).pipe(
					map((data: RespPedidoLista) => {
						//console.log(data);
						if(data.bOk) {
							this.pedCliFiltrado.length = 0;
							data.aLista.forEach(iData => {
								let item= new PedidoListaVista();
								item.asigDesdeData(iData);
								this.pedCliFiltrado.push(item);
							});
						}
						return this.pedCliFiltrado;
					}
			));
		} else {
			//console.log("Filtro cacheado");
			return new Observable<PedidoListaVista[]>(observer => {
				observer.next(this.pedViaFiltrado);
			});
		}
	}

	obtPedidosCli(filtro: PedidoFiltro, bCache:boolean):Observable<PedidoListaVista[]> {
		//Si el filtro es distinto al asignado
		if(!bCache && this.pedCliFiltro.asignar(filtro)) {
			//const sol = new SolPedidoLista();
			const encabezado = new HttpHeaders()
				.append('Content-Type', 'application/json');
			
			//sol.accion = "Lista";
			//sol.asigFiltro(filtro)
			//console.log(sol);
			return this.http.post<RespPedidoLista>(
				this.rutaBase + '/api/Acciones/Pedido.php',
				filtro.genSolicitud("Lista"),
				{headers: encabezado}
				).pipe(
					map((data: RespPedidoLista) => {
						//console.log(data);
						if(data.bOk) {
							this.pedCliFiltrado.length = 0;
							data.aLista.forEach(iData => {
								let item= new PedidoListaVista();
								item.asigDesdeData(iData);
								this.pedCliFiltrado.push(item);
							});
						}
						return this.pedCliFiltrado;
					}
			));
		} else {
			//console.log("Filtro cacheado");
			return new Observable<PedidoListaVista[]>(observer => {
				observer.next(this.pedCliFiltrado);
			});
		}
	}

	obtStatus() {
		return JSON.stringify(this.pedido);
	}

	/** Obtiene la lista de documento con sus respectivos detalles */
	docObtSegunCliente(clienteId: string, docTipo: string, docNumero: string, docEsFiscal: number):Observable<DocumentoVista> {
		const fil= new DocumentoFiltro(false, clienteId,"","","");
		fil.docTipo= docTipo;
		fil.docNumero= docNumero;
		fil.docEsFiscal= docEsFiscal;
		console.log(fil);
		console.log(fil.genSolicitud("DocSegunCliente"));
		/* RespDocLista se genera con detalle */
		const encabezado = new HttpHeaders()
			.append('Content-Type', 'application/json');
		return this.http.post<RespDocLista>(
				this.rutaBase + '/api/Acciones/Documento.php',
				fil.genSolicitud("DocSegunCliente"),
				{headers: encabezado}
				).pipe(
					map( (data: RespDocLista) => {
						let res= new DocumentoVista();
						//console.log(data);
						if(data.bOk) {
							data.aDoc.forEach( (e: DocListaData) => {
								let v= new DocListaVista();
								v.obtDesdeData(e);
								res.aDoc.push(v);
								if(e.tipo== docTipo && e.numero== docNumero && e.esFiscal== docEsFiscal) {
									res.oDoc= v;
								}
							});
							
						}
						//console.log(vdv);
						return res;
					})
				);

	}

	geoLocalizar(): Observable<GeoData> {
    return Observable.create(observer => {
				let data= new GeoData();
				data.fecha= new Date();
        if(window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                (position) => {
										data.bOk= true;
										data.latitud= position.coords.latitude;
										data.longitud= position.coords.longitude;
                    observer.next(data);
										observer.complete();
                },
                (error) => {
									observer.error(data);
								}
            );
        } else {
            observer.error(data);
        }
    });
	}



	/** Lista sin detalles */
	docObtSegunViajante(cliente: string):Observable<DocListaVista[]> {
		const fil= new DocumentoFiltro(true,"",cliente,"","");
		const encabezado = new HttpHeaders()
			.append('Content-Type', 'application/json');

		return this.http.post<RespDocLista>(
				this.rutaBase + '/api/Acciones/Documento.php',
				fil.genSolicitud("DocSegunViajante"),
				{headers: encabezado}
				).pipe(
					map( (data: RespDocLista) => {
						this.aViaDoc.length=0;						
						if(data.bOk) {
							data.aDoc.forEach( (e: DocListaData) => {
								let v= new DocListaVista();
								v.obtDesdeData(e);
								this.aViaDoc.push(v);
							});
						}
						return this.aViaDoc;
					})
				);

	}

	viaObtLista(): Observable<ViajanteVista[]> {
		return this.http.post<RespViajanteLista>(
			this.rutaBase + '/api/Acciones/Viajante.php',
			JSON.stringify( {
				accion: "Lista",
			}),
			{headers: new HttpHeaders().append('Content-Type', 'application/json')}
		).pipe(
			map((data: RespViajanteLista)=>{
				let vista=  new Array<ViajanteVista>();
				if(data.bOk) {
					data.aLista.forEach((i: ViajanteData) =>{
						let neo= new ViajanteVista();
						neo.parseData(i);
						vista.push(neo);
					})
				} else {
					console.log(data.mensaje);
				}

				return vista;
			})
		);

	}

	visObtLista(filtro: FiltroVisitaEx): Observable<VisitaVista[]> {
		console.log("Llamada a visObtLista");
		console.log(filtro);
		return this.http.post<RespVisitaLista>(
			this.rutaBase + '/api/Acciones/Visita.php',
			filtro.genSolicitud("Lista"),
			{headers: new HttpHeaders().append('Content-Type', 'application/json')}
		).pipe(
			map((data: RespVisitaLista)=>{
				let vista=  new Array<VisitaVista>();
				if(data.bOk) {
					data.aLista.forEach((i: VisitaVista) =>{
						let neo= new VisitaVista();
						neo.parseData(i);
						vista.push(neo);
					})
				} else {
					if (data.mensaje.includes("Denegado")) {
						//Asume que se realiza una tarea no permitida,
						//cierra la sesión.
						console.log("fin de sesion!");
						this.finSesion().subscribe(
							(data:boolean) => {}
						);
					}
				}
				return vista;
			})
		);

	}

	visFiltrar(viajanteId: string, clienteId: string, cliente: string, desde: string, hasta: string):Observable<RespVisitaLista> {
		if(viajanteId==null) viajanteId= this.pedido.oViajante.id;
		if(clienteId==null) clienteId= this.pedido.oCliente.id;

		return this.http.post<RespVisitaLista>(
			this.rutaBase + '/api/Acciones/Visita.php',
			JSON.stringify( {
				accion: "Lista",
				viajanteId: viajanteId,
				clienteId: clienteId,
				cliente: cliente,
				desde: desde,
				hasta: hasta
			}),
			{headers: new HttpHeaders().append('Content-Type', 'application/json')}
		);

	}

	visAgregar(clienteId: string, obs: string, geoFecha: string, geoLatitud: number, geoLongitud: number):Observable<RespVisitaRegistro> {
		return this.http.post<RespVisitaRegistro>(
			this.rutaBase + '/api/Acciones/Visita.php',
			JSON.stringify( {
				accion: "Registrar",
				clienteId: clienteId,
				viajanteId: this.pedido.oViajante.id,
				observacion: obs,
				geoFecha: geoFecha,
				geoLatitud: geoLatitud,
				geoLongitud: geoLongitud
			}),
			{headers: new HttpHeaders().append('Content-Type', 'application/json')}
			);

	}

}
