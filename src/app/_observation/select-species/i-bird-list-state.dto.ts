import { IBirdSummary } from "src/app/_bird/i-bird-summary.dto";

export interface IBirdListState {
    speciesList: IBirdSummary[];
    // loaded: boolean;
    error: boolean;
}
