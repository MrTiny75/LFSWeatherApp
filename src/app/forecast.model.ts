export class Forecast {
//     day: {
//         dayForecast: number;
//         daySection: {
//             section: string;
//             weather: {
//                 temperature: string;
//                 wind: string;
//                 rain: string;
//             }
//         }[];
//     }[];

    day: {
        dayNumber: number;
        section: {
            type: string;
            weather: {
                temperature: string;
                wind: string;
                rain: string;
                description: string;
            }
        }[]
    }[];

}


