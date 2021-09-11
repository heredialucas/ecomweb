import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-articulo-filtro',
	templateUrl: './articulo-filtro.component.html',
	styleUrls: ['./articulo-filtro.component.css']
})
export class ArticuloFiltroComponent implements OnInit {
	bRes: boolean;
	frm = new FormGroup({
		txtCodigo: new FormControl(''),
		txtDescrip: new FormControl(''),
		txtRubro: new FormControl(''),
		txtSubRubro: new FormControl('')
	});

	constructor(private router: Router) { }

	ngOnInit(): void {
		// this.x= new FormControl('');
		this.bRes = false;
	}

	onFiltrar(): void {
		this.bRes = true;
		// this.router.navigate(['/ArticuloLista','hola']);

		//console.log("Devuelve filtro");
		/*
		this.router.navigate([
			'/ArticuloLista',
			this.frm.get('txtRubro').value,
			this.frm.get('txtSubRubro').value,
			this.frm.get('txtDescrip').value,
			this.frm.get('txtCodigo').value
		]);
		*/


		let parametros= 
			{queryParams:{
				rubro:"", 
				subrubro: "", 
				descrip:"", 
				codigo:""
			}}

		parametros.queryParams.rubro= this.frm.get('txtRubro').value;
		parametros.queryParams.subrubro= this.frm.get('txtSubRubro').value;
		parametros.queryParams.descrip= this.frm.get('txtDescrip').value;
		parametros.queryParams.codigo= this.frm.get('txtCodigo').value;

		this.router.navigate(
				['/Articulos'], 
			parametros
			);

	}

	onCancelar(): void {
		this.bRes = true;
	}

}
