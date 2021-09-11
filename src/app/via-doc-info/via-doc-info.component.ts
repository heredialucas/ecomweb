import { DocListaVista, DocumentoVista, DocDetalleVista } from './../Modelos/documento';
import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-via-doc-info',
  templateUrl: './via-doc-info.component.html',
  styleUrls: ['./via-doc-info.component.scss']
})
export class ViaDocInfoComponent implements OnInit {

	aDocDetalle: DocDetalleVista[];
	aDoc: DocListaVista[]; //otras facturas
	oDoc: DocListaVista;
	docListando: boolean;
	docListaMensaje: string;


  constructor(private data: DataService) {
		this.aDocDetalle=null;
		this.aDoc= Array<DocListaVista>();
		this.oDoc= new DocListaVista();
		this.docListando= false;
		this.docListaMensaje= "";

		if(this.data.oViaDoc != null ) {
			console.log(this.data.oViaDoc);
			if(this.data.oViaDoc.docNumero ==='') {
				//Obtener los datos del Documento
			} else {
				this.oDoc= this.data.oViaDoc;
				console.log("doc.Constructor");
				console.log(this.oDoc);
				this.obtDocSegunCliente();
			}
		}		
	 }

  ngOnInit(): void {

	}

	verDocDetalle(id: string): void {
		this.oDoc= this.aDoc.find((item:DocListaVista)=>{
			return item.id== id;
		});
	}
	
	obtDocSegunCliente():void {
		this.aDoc.length=0;
		this.docListando=true;
		this.docListaMensaje="Obteniendo datos...";
		//console.log(this.oViaDoc.clienteId);
		this.data.docObtSegunCliente(this.data.oViaDoc.clienteId, this.data.oViaDoc.docTipo, this.data.oViaDoc.docNumero, this.data.oViaDoc.docEsFiscal)
		.subscribe((data: DocumentoVista) => {
				console.log(data);
				this.docListando=false;
				this.docListaMensaje= (data.aDoc.length== 0 ? "No hay más documentos" : "");
				this.aDoc= data.aDoc;
				if(data.aDoc.length>0)
					this.oDoc= data.oDoc;
			},
			(err) => {
				this.docListando= false;
				this.docListaMensaje= (typeof(err)=='string'? err : JSON.stringify(err));
				//console.log(err);
			}
		);

		/*
		this.data.cliObtDocumentos()
		.subscribe()
		*/
	}

}
