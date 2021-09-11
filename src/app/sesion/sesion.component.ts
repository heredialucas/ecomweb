import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
	selector: 'app-sesion',
	templateUrl: './sesion.component.html',
	styleUrls: ['./sesion.component.css']
})
export class SesionComponent implements OnInit {
	iIntentos = 0;
	bCargando: boolean;
	bError= false;

	frm: FormGroup = new FormGroup({
		usuario: new FormControl('', [Validators.required]),
		clave: new FormControl('', [Validators.required])
	});

	constructor(private router: Router, private dataServicio: DataService) { }

	ngOnInit(): void {
		this.bCargando = false;
		this.iIntentos = 0;
	}

	obtMensaje(): string {
		return (!this.bError ? (this.iIntentos >0? "Usuario y/o Contraseña incorrectos" : "Sesión iniciada exitosamente") : "Ocurrió un error!");
	}

	onCancelar(): void {
		this.router.navigate(['/Articulos']);
	}

	iniSesion(): void {
		const usuario = this.frm.get('usuario').value;
		const clave = this.frm.get('clave').value;

		if (!this.bCargando) {
			this.bError= false;
			this.bCargando = true;
			this.iIntentos = 0;
			this.dataServicio.iniSesion(usuario, clave)
			.subscribe( 
			(data: boolean) => {
				//console.log(data);
				this.bCargando = false;
				if (data) {
					this.iIntentos = 0;
					this.router.navigate([
						this.dataServicio.esCliente()?
							'/Articulos':
							this.dataServicio.esViajante()?'/Viajante':
								'/Gestion'
					]);
				} else {
					this.iIntentos++;
				}
			},
			(error:any) => {
				this.bCargando= false;
				this.bError= true;
			}
			);
		}
	}
}



