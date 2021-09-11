import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-cliente-filtro',
	templateUrl: './cliente-filtro.component.html',
	styleUrls: ['./cliente-filtro.component.css']
})
export class ClienteFiltroComponent implements OnInit {

	frm = new FormGroup({
		txtNombre: new FormControl(''),
		txtCodigo: new FormControl(''),
		txtDomicilio: new FormControl('')
	});

	constructor(private router: Router) { }

	ngOnInit(): void {
	}

	onFiltrar(): void {
		this.router.navigate(
			['/Clientes'],
			{queryParams: {
				codigo:this.frm.get('txtCodigo').value,
				nombre:this.frm.get('txtNombre').value,
				domicilio:this.frm.get('txtDomicilio').value
			}}
		);
	}

	onCancelar(): void {

	}

}
