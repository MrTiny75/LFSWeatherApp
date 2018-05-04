import { Injectable, APP_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Forecast } from './forecast.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


@Injectable()
export class AppService {
    httpParams = new HttpParams()
        .set('q', 'Bonn,de')
        .set('APPID', '80b7b40897527c2a526a3b86b726d63c')
        .set('units', 'metric');

    seconds = (x) => {
        return x * 1000;
    }

    constructor(private http: HttpClient) {}

    getWeatherJSON(): Observable<Forecast> {
        const params = this.httpParams.toString();
        return IntervalObservable.create(this.seconds(3)).mergeMap(
            () => this.http
                    // .get('http://api.openweathermap.org/data/2.5/weather?' + params)
                    .get('http://api.openweathermap.org/data/2.5/forecast?' + params)
                    .map( data => this.mapToRelevantFields(data) )
        );
    }

    mapToRelevantFields(rawData: any): Forecast {

        console.log(rawData);

        const forecast: Forecast = new Forecast();
        let i = 0;

        for ( const element of rawData.list ) {
            forecast.day = [{
                dayNumber: i,
                section: [{
                    type: 'morgens',
                    weather: {
                        temperature: element.main.temp,
                        wind: element.wind.speed,
                        rain: element.rain['3h'],
                        description: element.weather[0].description
                    }
                }]
            }];
            if ( i === 4 ) {
                break;
            }
            i++;
        }

        return forecast;
    }
}
