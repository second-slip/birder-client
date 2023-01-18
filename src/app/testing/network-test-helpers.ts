import { INetworkUser } from "../_network/i-network-user.dto";



export const apiNetworkUserArrayResponse = [
    {
      "userName": "follower 1",
      "avatar": "https://img.icons8.com/color/96/000000/user.png",
      "isFollowing": true,
      "isOwnProfile": false
    },
    {
      "userName": "follower 2",
      "avatar": "https://img.icons8.com/color/96/000000/user.png",
      "isFollowing": true,
      "isOwnProfile": false
    }
  ];

  export const fakeNetworkUserModelArray: INetworkUser[] = [
    {
        userName: 'follower 1',
        avatar: 'https://img.icons8.com/color/96/000000/user.png',
        isFollowing: true,
        isOwnProfile: false
      },
      {
        userName: 'follower 2',
        avatar: 'https://img.icons8.com/color/96/000000/user.png',
        isFollowing: true,
        isOwnProfile: false
      }
  ];