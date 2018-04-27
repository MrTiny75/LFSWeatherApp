import { Injectable, APP_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


@Injectable()
export class AppService {
    httpParams = new HttpParams()
        .set('q', 'Bonn,de')
        .set('APPID', '80b7b40897527c2a526a3b86b726d63c');

    seconds = (x) => {
        return x * 1000;
    }

    constructor(private http: HttpClient) {}

    getWeatherJSON(): Observable<JSON> {
        const params = this.httpParams.toString();
        return IntervalObservable.create(this.seconds(20)).mergeMap(
            () => this.http
                    .get('http://api.openweathermap.org/data/2.5/weather?' + params)
                    .map(data => <JSON>data)
        );
    }
}
