import { ITweetDay } from "../i-tweet-day.dto";

export interface ITweetDayArchive {
    totalItems: number;
    items: ITweetDay[];
}
