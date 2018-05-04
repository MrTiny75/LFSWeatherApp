import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs/Observable';
import { Forecast } from './forecast.model';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  weatherObservable: Observable<Forecast>;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.weatherObservable = this.appService.getWeatherJSON();
    this.weatherObservable.subscribe( data => console.log( data ) );
  }

}
