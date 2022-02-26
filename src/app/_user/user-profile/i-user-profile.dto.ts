import { IObservationCount } from "src/app/_analysis/observation-count/i-observation-count.dto";

export interface IUserProfile {
    userName: string;
    avatar: string;
    registrationDate: Date | string;
    isOwnProfile: boolean;
    observationCount: IObservationCount;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
}
