import { Component, OnInit } from '@angular/core';
// import {ArticuloInterface} from '../articulo-interface';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DataService} from '../data.service';
import { ArticuloVista } from '../Modelos/articulo-modelo';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	public art: ArticuloVista;
	constructor(
		private route: ActivatedRoute,
		// private router: Router,
		private dataServicio: DataService
		) {
		// this.art= new ArticuloModelo(iArt);
	}

	ngOnInit(): void {
		const pId = this.route.snapshot.paramMap.get('id');
		let id: number;

		//console.log(pId);
		id = parseInt(pId, 10);
		// this.art =
		this.dataServicio.obtArticulo(id.toString()).subscribe(
			(data: ArticuloVista) => {
				this.art = data;
			}
		);
		//console.log(this.art);

		/* usando observables
    this.art = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.dataServicio.obtArticulo(param.get('id'))
    );
    */
	}

}
