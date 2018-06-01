import { Injectable, APP_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import * as moment from 'moment';
import 'moment/locale/de';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Moment } from 'moment';
import { IDay, ISection } from './forecast.model';

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

    getWeatherObservable(): Observable<IDay[]> {
        const params = this.httpParams.toString();

        return this.http
            .get('http://api.openweathermap.org/data/2.5/forecast?' + params)
            .map( data => {
                return this.mapToRelevantFields(data);
            })
            .catch(
                (e) => Observable.throw(console.log('Error when loading data from weather API: ', e))
            );

    }

    mapToRelevantFields(rawData: any): IDay[] {
        console.log('Rowdaten: ', rawData);
        const dayArr: IDay[] = new Array<IDay>();
        let sectionArr: ISection[] = new Array<ISection>();
        for ( const element of rawData.list ) {
            const mnt: Moment = moment(element.dt_txt);
            const day: IDay = {};
            const section: ISection = this.getSectionSegment(element, mnt);
            day.dt = mnt.locale('de').format('dddd, Do MMMM YYYY');

            // get the day - today tomorrow in two and three days
            if ( moment().isSame(mnt.format(), 'day') ) { // heute
                // console.log('heute');
                if ( section !== null ) {
                    sectionArr.push(section);
                    if ( section.daytime === 'abends' ) {
                        day.dayForecast = 'heute';
                        day.section = sectionArr;
                        sectionArr = [];
                        dayArr.push(day);
                    }
                }
            } else if ( moment().add(1, 'day').isSame(mnt.format(), 'day') ) { // morgen
                // console.log('morgen');
                if ( section !== null ) {
                    sectionArr.push(section);
                    if ( section.daytime === 'abends' ) {
                        day.dayForecast = 'morgen';
                        day.section = sectionArr;
                        sectionArr = [];
                        dayArr.push(day);
                    }
                }
            } else if ( moment().add(2, 'day').isSame(mnt.format(), 'day') ) { // übermorgen
                // console.log('übermorgen');
                if ( section !== null ) {
                    sectionArr.push(section);
                    if ( section.daytime === 'abends' ) {
                        day.dayForecast = 'übermorgen';
                        day.section = sectionArr;
                        sectionArr = [];
                        dayArr.push(day);
                    }
                }
            } else if ( moment().add(3, 'day').isSame(mnt.format(), 'day') ) { // in drei tagen
                // console.log('in 3 tagen');
                if ( section !== null ) {
                    sectionArr.push(section);
                    if ( section.daytime === 'abends' ) {
                        day.dayForecast = 'in 3 Tagen';
                        day.section = sectionArr;
                        sectionArr = [];
                        dayArr.push(day);
                    }
                }
            } else {
                break;
            }
        }
        return dayArr;
    }

    getSectionSegment(element: any, mnt: Moment): any {
        const s: ISection = {
            weather: {
                temperature: element.main.temp,
                wind: element.wind.speed,
                rain: (element.rain) ? element.rain['3h'] : '0',
                description: element.weather[0].description,
                icon: 'http://openweathermap.org/img/w/' + element.weather[0].icon + '.png'
            }
        };
        if ( mnt.hour() === 3 ) {
            s.daytime = 'nachts';
            s.index = 0;
        } else if ( mnt.hour() === 9 ) {
            s.daytime = 'morgens';
            s.index = 1;
        } else if ( mnt.hour() === 15 ) {
            s.daytime = 'mittags';
            s.index = 2;
        } else if ( mnt.hour() === 21 ) {
            s.daytime = 'abends';
            s.index = 3;
        } else {
            return null;
        }
        return s;
    }
}
