import { IObservationTopFiveRecord } from './i-observation-top-five-record.dto';

export interface IObservationTopFive {
    topObservations: IObservationTopFiveRecord[];
    topMonthlyObservations: IObservationTopFiveRecord[];
}
