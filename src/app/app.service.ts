import { Injectable, APP_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import * as forecast from './forecast.model';
import * as moment from 'moment';
import 'moment/locale/de';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Moment } from 'moment';


@Injectable()
export class AppService {
    forecast: forecast.Forecast = new forecast.Forecast();

    httpParams = new HttpParams()
        .set('q', 'Bonn,de')
        .set('APPID', '80b7b40897527c2a526a3b86b726d63c')
        .set('units', 'metric');

    seconds = (x) => {
        return x * 1000;
    }

    constructor(private http: HttpClient) {
        this.forecast.day = new Array();
    }

    getWeatherJSON(): Observable<forecast.Forecast> {
        const params = this.httpParams.toString();
        return IntervalObservable.create(this.seconds(3)).mergeMap(
            () => this.http
                    .get('http://api.openweathermap.org/data/2.5/forecast?' + params)
                    .map( data => {
                        this.mapToRelevantFields(data);
                        return this.forecast;
                    })
        );
    }

    mapToRelevantFields(rawData: any): void {
        console.log(rawData);

        let mnt: Moment;
        let dayfrc: 'heute'|'morgen'|'übermorgen'|'in drei Tagen';

        let i = 0;
        for ( const element of rawData.list ) {
            mnt = moment(element.dt_txt);

            // get the day - today tomorrow in two or three days
            if ( moment().isSame(mnt.format(), 'day') ) {
                dayfrc = 'heute';
            } if ( moment().add(1, 'day').isSame(mnt.format(), 'day') ) {
                dayfrc = 'morgen';
            } if ( moment().add(2, 'day').isSame(mnt.format(), 'day') ) {
                dayfrc = 'übermorgen';
            } if ( moment().add(3, 'day').isSame(mnt.format(), 'day') ) {
                dayfrc = 'in drei Tagen';
            }

            // get the section of the day - morning or afternoon

            const sct: forecast.ISection = {
                daytime: 'vormittags',
                weather: {
                    temperature: element.main.temp,
                    wind: element.wind.speed,
                    rain: (element.rain) ? element.rain['3h'] : '0',
                    description: element.weather[0].description
                }
            };

            const day: forecast.IDay = {
                dt: mnt.locale('de').format('dddd, Do MMMM YYYY'),
                dayForecast: dayfrc,
                section: new Array()
            };

            day.section.push(sct);

            this.forecast.day.push(day);

            if ( i === 4 ) {
                break;
            }
            i++;
        }
    }
}
