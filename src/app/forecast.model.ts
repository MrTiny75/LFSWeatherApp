export class Forecast {
    day: IDay[];
}

export interface IDay {
    dt: string;
    dayForecast?: 'heute'|'morgen'|'übermorgen'|'in drei Tagen';
    section?: ISection[];
}

export interface ISection {
    daytime?: 'morgens'|'mittags'|'abends'|'nachts';
    weather: {
        temperature: string;
        wind: string;
        rain?: string;
        description: string;
    };
}
