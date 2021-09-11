import { Router } from '@angular/router';
import { DataService } from './data.service';
import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'eCom';
	constructor(private data: DataService, private router: Router) {}

	esInvitado(): boolean {
		return this.data.esInvitado();
	}
	esCliente(): boolean {
		return this.data.esCliente();
	}
	esViajante(): boolean {
		return this.data.esViajante();
	}

	esGestion(): boolean {
		return this.data.esGestion();
	}

	obtPedidoCliente(): string {
		return this.data.pedido.oCliente.id;
	}

	obtPedidoViajante(): string {
		return this.data.pedido.oViajante.id;
	}

	finSesion(): void {
		this.data.finSesion()
		.subscribe(
			(data: boolean) => {
			this.router.navigate(['/Sesion']);
			},
			(error: any) => {
				//console.log(error);
			}
		);

	}
}
