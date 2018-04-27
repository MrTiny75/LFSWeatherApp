import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  weatherObservable: Observable<JSON>;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.weatherObservable = this.appService.getWeatherJSON();
    this.weatherObservable.subscribe( data => console.log(data) );
  }

}
