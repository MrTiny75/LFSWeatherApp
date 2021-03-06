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
    dayt?: '09:00' | '15:00' | '21:00' | '03:00';
    weather?: IWeather;
    index?: number;
}

export interface IWeather {
    temperature: string;
    wind: string;
    rain?: string;
    description: string;
    icon?: string;
}
