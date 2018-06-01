import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs/Observable';
import { Forecast, IDay, ISection } from './forecast.model';
import { JsonPipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // weather$: Observable<Forecast>;
  day$: Observable<IDay[]>;
  weather: Forecast;
  dateTimeNow: string;

  constructor(private appService: AppService) {
    this.dateTimeNow = moment().format('dddd, Do MMMM YYYY');
  }

  ngOnInit() {
    this.day$ = this.appService.getWeatherObservable();

    this.day$.toPromise().then( data => {
          console.log('Vorhersage: ', data);
          // data.forEach( x => console.log(x) );
        });
  }

  /**
   * Fill up the array for having elements to loop over with *ngFor
   * @param s
   */
  getSections(s: ISection[]): ISection[] {
    const secArr: ISection[] = new Array<ISection>();
    for ( let i = 0; i < 4 - s.length; i++ ) {
      secArr.push({});
    }
    s.forEach( element =>
      secArr.push(element)
    );
    return secArr;
  }
}
