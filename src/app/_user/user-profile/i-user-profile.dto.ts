import { IObservationCount } from "src/app/_analysis/observation-count/i-observation-count.dto";
import { INetworkUser } from "src/app/_network/i-network-user.dto";

export interface IUserProfile {
    user: INetworkUser;
    registrationDate: Date | string;
    observationCount: IObservationCount;
    followersCount: number;
    followingCount: number;
}
