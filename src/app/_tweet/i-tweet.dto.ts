import { IBirdSummary } from "../_bird/i-bird-summary.dto";

export interface ITweet {
    tweetDayId: number;
    songUrl: string;
    displayDay: Date | string;
    creationDate: Date | string;
    lastUpdateDate: Date | string;
    bird: IBirdSummary;
}
