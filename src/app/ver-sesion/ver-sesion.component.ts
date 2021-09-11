import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-ver-sesion',
  templateUrl: './ver-sesion.component.html',
  styleUrls: ['./ver-sesion.component.scss']
})
export class VerSesionComponent implements OnInit {
	variables: string;
	selectedDate: string;

	fechaDesde: string;
	fechaHasta: string;

	desdePickerConfig = {
    firstDayOfWeek: 'su',
    monthFormat: 'MMM, YYYY',
    disableKeypress: true,
    allowMultiSelect: false,
    closeOnSelect: undefined,
    closeOnSelectDelay: 100,
    onOpenDelay: 0,
    weekDayFormat: 'dd',
    appendTo: undefined,  //document.body
    drops: 'down',
    opens: undefined,
    showNearMonthDays: true,
    showWeekNumbers: false,
    enableMonthSelector: true,
    format: "DD/MM/YYYY",
    yearFormat: 'YYYY',
    showGoToCurrent: false,
    dayBtnFormat: 'DD',
    monthBtnFormat: 'MMM',
    hours12Format: 'hh',
    hours24Format: 'HH',
    meridiemFormat: 'A',
    minutesFormat: 'mm',
    minutesInterval: 1,
    secondsFormat: 'ss',
    secondsInterval: 1,
    showSeconds: false,
    showTwentyFourHours: true,
    timeSeparator: ':',
    multipleYearsNavigateBy: 10,
    showMultipleYearsNavigation: false,
    locale: 'es-ar',
  }

	hastaPickerConfig = {
    firstDayOfWeek: 'su',
    monthFormat: 'MMM, YYYY',
    disableKeypress: false,
    allowMultiSelect: false,
    closeOnSelect: undefined,
    closeOnSelectDelay: 100,
    onOpenDelay: 0,
    weekDayFormat: 'ddd',
    appendTo: document.body,
    drops: 'down',
    opens: 'right',
    showNearMonthDays: true,
    showWeekNumbers: false,
    enableMonthSelector: true,
    format: "DD/MM/YYYY",
    yearFormat: 'YYYY',
    showGoToCurrent: false,
    dayBtnFormat: 'DD',
    monthBtnFormat: 'MMM',
    hours12Format: 'hh',
    hours24Format: 'HH',
    meridiemFormat: 'A',
    minutesFormat: 'mm',
    minutesInterval: 1,
    secondsFormat: 'ss',
    secondsInterval: 1,
    showSeconds: false,
    showTwentyFourHours: true,
    timeSeparator: ':',
    multipleYearsNavigateBy: 10,
    showMultipleYearsNavigation: false,
    locale: 'es-ar',
    // min:'2017-08-29 15:50',
    // minTime:'2017-08-29 15:50'
  }

  constructor(public data: DataService) {
		this.variables= "";
	 }



  ngOnInit(): void {

		this.data.obtSesion()
		.subscribe( (data:any[]) => {
			//console.log(data);
			this.variables= JSON.stringify(data);
			
			this.fechaDesde="15/01/2019";
			this.fechaHasta="24/08/2020";
		}
		);
  }

}
