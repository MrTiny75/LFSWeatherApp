export class Forecast {
    day: IDay[];
}

export interface IDay {
    dt?: string;
    dayForecast?: 'heute'|'morgen'|'übermorgen'|'in 3 Tagen';
    section?: ISection[];
}

export interface ISection {
    daytime?: 'morgens'|'mittags'|'abends'|'nachts';
    weather?: IWeather;
    index?: number;
}

export interface IWeather {
    temperature: string;
    wind: string;
    rain?: string;
    description: string;
}
