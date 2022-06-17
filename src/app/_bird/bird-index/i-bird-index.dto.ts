import { IBirdSummary } from "../i-bird-summary.dto";

export interface IBirdIndex {
    totalItems: number;
    items: IBirdSummary[];
}
