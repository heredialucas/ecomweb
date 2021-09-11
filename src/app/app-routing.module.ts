import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';

import { ArticuloComponent } from './articulo/articulo.component';
import { ArticuloListaComponent} from './articulo-lista/articulo-lista.component';
import { ArticuloFiltroComponent} from './articulo-filtro/articulo-filtro.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ClienteLstComponent } from './cliente-lst/cliente-lst.component';
import { ClienteFiltroComponent } from './cliente-filtro/cliente-filtro.component';
import { PedidoComponent } from './pedido/pedido.component';
import { SesionComponent } from './sesion/sesion.component';
import { ViajanteComponent } from './viajante/viajante.component';
import { VerSesionComponent } from './ver-sesion/ver-sesion.component'
import { ViaDocInfoComponent } from './via-doc-info/via-doc-info.component';
import { UsuGestionComponent } from './usu-gestion/usu-gestion.component';


const routes: Routes = [
	//{ path: '', redirectTo: 'Gestion', pathMatch: 'full'},
	{ path: '', redirectTo: 'Sesion', pathMatch: 'full'},
	{ path: 'Inicio', component: InicioComponent},
	{ path: 'Gestion', component: UsuGestionComponent},
	{ path: 'Cliente/:codigo', component: ClienteComponent },
	{ path: 'Clientes', component: ClienteLstComponent},
	{ path: 'ClienteFiltro', component: ClienteFiltroComponent},
	//{ path: 'ArticuloLista', component: ArticuloListaComponent },
	//{ path: 'ArticuloLista/:rubro/:subrubro/:descrip/:codigo', component: ArticuloListaComponent },
	{ path: 'Articulos', component: ArticuloListaComponent },
	{ path: 'Articulo/:codigo', component: ArticuloComponent },
	{ path: 'ArticuloFiltro', component: ArticuloFiltroComponent},
	{ path: 'Pedido', component: PedidoComponent},
	{ path: 'Sesion', component: SesionComponent},
	{ path: 'Viajante/:idDoc', component: ViajanteComponent},
	{ path: 'Viajante', component: ViajanteComponent},
	{ path: 'ViaDocumento', component: ViaDocInfoComponent},
	{ path: 'VerSesion', component: VerSesionComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
