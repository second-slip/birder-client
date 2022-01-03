import { IBirdSummary } from "../_birds/i-bird-summary.dto";

export interface ITweetDay {
    tweetDayId: number;
    songUrl: string;
    displayDay: Date | string;
    creationDate: Date | string;
    lastUpdateDate: Date | string;
    bird: IBirdSummary;
}