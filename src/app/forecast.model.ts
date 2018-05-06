export class Forecast {
    day: IDay[];
}

export interface IDay {
    dt: string;
    dayForecast: 'heute'|'morgen'|'übermorgen'|'in drei Tagen';
    section?: ISection[];
}

export interface ISection {
    daytime: 'vormittags'|'nachmittags';
    weather: {
        temperature: string;
        wind: string;
        rain?: string;
        description: string;
    };
}
