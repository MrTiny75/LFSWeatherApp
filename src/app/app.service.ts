import { Injectable, APP_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class AppService {

    httpParams = new HttpParams()
        .set('lat', '48.13')
        .set('lon', '17.12')
        .set('APPID', '80b7b40897527c2a526a3b86b726d63c');

    constructor(private http: HttpClient) {}

    getWeatherJSON() {
        const params = this.httpParams.toString();
        this.http.get('http://api.openweathermap.org/data/2.5/weather?' + params).
            subscribe( response => alert(JSON.stringify(response)) );
    }
}
