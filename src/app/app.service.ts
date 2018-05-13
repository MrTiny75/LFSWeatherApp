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
        return IntervalObservable.create(this.seconds(10)).mergeMap(
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

        // get the section of the day - morning or afternoon
        const day: forecast.IDay = {
            section: new Array()
        };

        for ( const element of rawData.list ) {
            let mnt: Moment = moment(element.dt_txt);
            day.dt = mnt.locale('de').format('dddd, Do MMMM YYYY');
            const section = this.getSectionSegment(element, mnt);

            // get the day - today tomorrow in two or three days
            if ( moment().isSame(mnt.format(), 'day') ) { // heute
                console.log('heute');
                if ( section !== null ) {
                    day.section.push(section);
                    if ( section.daytime === 'abends' ) {
                        day.dayForecast = 'heute';
                        this.forecast.day.push(day);
                    }
                }
            } else if ( moment().add(1, 'day').isSame(mnt.format(), 'day') ) { // morgen
                console.log('morgen');
                if ( section !== null ) {
                    day.section.push(section);
                    if ( section.daytime === 'abends' ) {
                        day.dayForecast = 'morgen';
                        this.forecast.day.push(day);
                    }
                }
            } else if ( moment().add(2, 'day').isSame(mnt.format(), 'day') ) { // übermorgen
                console.log('übermorgen');
                if ( section !== null ) {
                    day.section.push(section);
                    if ( section.daytime === 'abends' ) {
                        day.dayForecast = 'übermorgen';
                        this.forecast.day.push(day);
                    }
                }
            } else if ( moment().add(3, 'day').isSame(mnt.format(), 'day') ) { // in drei tagen
                console.log('in drei tagen');
                if ( section !== null ) {
                    day.section.push(section);
                    if ( section.daytime === 'abends' ) {
                        day.dayForecast = 'in drei Tagen';
                        this.forecast.day.push(day);
                    }
                }
            } else {
                break;
            }
        }
    }

    getSectionSegment(element: any, mnt: Moment): forecast.ISection {
        let sct: forecast.ISection = {
            weather: {
                temperature: element.main.temp,
                wind: element.wind.speed,
                rain: (element.rain) ? element.rain['3h'] : '0',
                description: element.weather[0].description
            }
        };

        if ( mnt.hour() === 3 ) {
            sct.daytime = 'nachts';
        } else if ( mnt.hour() === 9 ) {
            sct.daytime = 'morgens';
        } else if ( mnt.hour() === 15 ) {
            sct.daytime = 'mittags';
        } else if ( mnt.hour() === 21 ) {
            sct.daytime = 'abends';
        } else {
            sct = null;
        }

        return sct;
    }
}
