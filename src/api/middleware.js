module.exports = (req, res, next) => {
  if (req.method === "POST" && req.originalUrl === "/authentication/login") {
    // /authToken') {
    return res.jsonp({
      authenticationToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Im1vbmtleSIsImp0aSI6IjBmNDZmNWI3LWY3NGItNDU4Ni1iYmJjLTBiODY0ZTBhZWE0MSIsIkltYWdlVXJsIjoiaHR0cHM6Ly9pbWcuaWNvbnM4LmNvbS9jb2xvci85Ni8wMDAwMDAvdXNlci5wbmciLCJMYXQiOiI1NC45NzIyMzciLCJMbmciOiItMi40NjA4NTYwMDAwMDAwMzUyIiwiZXhwIjoxNzg1NTkwMjI5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjU1NzIyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1NTcyMiJ9.ijG-bbXsW4WMXlXjNc5n08GzauvENj1tDwdYfbpggKw",
      failureReason: "0",
    });
  }

  // Observation Analysis api
  if (req.method === "GET" && req.originalUrl === "/observationanalysis") {
    return res.jsonp({
      totalObservationsCount: Math.floor(Math.random() * 100) + 1,
      uniqueSpeciesCount: Math.floor(Math.random() * 40) + 1,
    });
  }

  // Observation Top api
  if (req.method === "GET" && req.originalUrl === "/list/top") {
    let data = {
      topObservations: [
        {
          birdId: 1004,
          name: "Avocet",
          count: Math.floor(Math.random() * 40) + 1,
        },
        {
          birdId: 1022,
          name: "Blue Tit",
          count: Math.floor(Math.random() * 40) + 1,
        },
        {
          birdId: 1023,
          name: "Brambling",
          count: Math.floor(Math.random() * 40) + 1,
        },
        {
          birdId: 1037,
          name: "Collared Dove",
          count: Math.floor(Math.random() * 40) + 1,
        },
        {
          birdId: 1090,
          name: "Grey Heron",
          count: Math.floor(Math.random() * 40) + 1,
        },
      ],
    };

    // sort in descending order
    data.topObservations.sort(function (a, b) {
      return b.count - a.count;
    });

    return res.jsonp(data.topObservations);
  }

  // Observation Top api (filtered) /days?=3
  if (req.method === "GET" && req.originalUrl === "/list/top-date-filter") {
    let data = {
      topObservations: [
        {
          birdId: 1004,
          name: "Avocet",
          count: Math.floor(Math.random() * 40) + 1,
        },
        {
          birdId: 1022,
          name: "Blue Tit",
          count: Math.floor(Math.random() * 40) + 1,
        },
        {
          birdId: 1023,
          name: "Brambling",
          count: Math.floor(Math.random() * 40) + 1,
        },
        {
          birdId: 1037,
          name: "Collared Dove",
          count: Math.floor(Math.random() * 40) + 1,
        },
        {
          birdId: 1090,
          name: "Grey Heron",
          count: Math.floor(Math.random() * 40) + 1,
        },
      ],
    };

    // sort in descending order
    data.topObservations.sort(function (a, b) {
      return b.count - a.count;
    });

    return res.jsonp(data.topObservations);
  }

  // observation api
  if (req.method === "GET" && req.originalUrl === "/observation") {
    return res.jsonp({
      observationId: 1,
      quantity: 1,
      observationDateTime: "2023-09-03T21:27:35.693Z",
      username: "monkey",
      bird: {
        birdId: 1006,
        species: "Tyto alba",
        englishName: "Barn Owl",
        populationSize: "1,000 - 10,000 Pairs",
        btoStatusInBritain: "Resident Breeder",
        thumbnailUrl: null,
        conservationStatus: "Green",
        conservationListColourCode: "Green",
        birderStatus: 0,
      },
      position: {
        observationPositionId: 1,
        latitude: 54.972237,
        longitude: -2.4608560000000352,
        formattedAddress: "8 Fair Hill, Haltwhistle NE49 9EE, UK",
        shortAddress: "Haltwhistle, United Kingdom",
      },
      creationDate: "2023-09-03T21:41:35.2300315Z",
      lastUpdateDate: "2023-09-03T21:41:35.2300315Z",
    });
  }

  if (req.method === "GET" && req.originalUrl === "/observationread") {
    return res.jsonp({
      observationId: 1,
      quantity: 1,
      observationDateTime: "2023-09-03T21:27:35.693Z",
      birdId: 1006,
      species: "Tyto alba",
      englishName: "Barn Owl",
      username: "monkey",
      position: {
        observationPositionId: 1,
        latitude: 54.972237,
        longitude: -2.4608560000000352,
        formattedAddress: "8 Fair Hill, Haltwhistle NE49 9EE, UK",
        shortAddress: "Haltwhistle, United Kingdom",
      },
      notes: [
        {
          id: 1,
          noteType: "General",
          note: "Hello",
        },
        {
          id: 2,
          noteType: "Vocalisation",
          note: "Noisy so-and-so",
        },
      ],
      notesCount: 2,
      creationDate: "2023-09-03T21:41:35.2300315Z",
      lastUpdateDate: "2023-09-03T21:41:35.2300315Z",
    });
  }

  if (req.method === "POST" && req.originalUrl === "/createobservation") {
    return res.jsonp({
      observationId: 10094,
    });
  }

  if (req.method === "DELETE" && req.originalUrl === "/deleteobservation") {
    return res.jsonp({
      id: 1,
    });
  }

  if (req.method === "PUT" && req.originalUrl === "/updateobservation") {
    // return res.jsonp({
    //     observationId: req.body.observationId, // an object with this id 10090 exists in 'observations'
    return res.jsonp({
      observationId: req.body.observationId,
    });
  }

  if (req.method === "POST" && req.originalUrl === "/account/register") {
    return res.jsonp({
      success: true,
    });
  }

  if (
    req.method === "POST" &&
    req.originalUrl === "/account/resend-email-confirmation"
  ) {
    return res.jsonp({ success: true });
  }

  if (
    req.method === "POST" &&
    req.originalUrl === "/account/request-password-reset"
  ) {
    return res.jsonp({ success: true });
  }

  if (req.method === "POST" && req.originalUrl === "/account/reset-password") {
    return res.jsonp({ success: true });
  }

  if (req.method === "GET" && req.originalUrl === "/account/check-username") {
    return res.jsonp({ usernameTaken: false });
  }

  if (req.method === "GET" && req.originalUrl === "/account/check-email") {
    return res.jsonp({ emailTaken: false });
  }

  // Manage

  if (req.method === "GET" && req.originalUrl === "/manage") {
    return res.jsonp({
      userName: "Andrew",
      isEmailConfirmed: false,
      email: "andrew.cross11@gmail.com",
    });
  }

  if (req.method === "POST" && req.originalUrl === "/manage/profile") {
    return res.jsonp({
      isEmailConfirmationRequired: true,
    });
  }

  if (req.method === "POST" && req.originalUrl === "/manage/location") {
    return res.jsonp({
      defaultLocationLatitude: req.body.defaultLocationLatitude,
      defaultLocationLongitude: req.body.defaultLocationLongitude,
    });
  }

  if (req.method === "POST" && req.originalUrl === "/manage/password") {
    return res.jsonp({ success: true });
  }

  // *************************************
  // Network api

  if (req.method === "GET" && req.originalUrl === "/network") {
    return res.jsonp({
      followersCount: Math.floor(Math.random() * 69) + 1,
      followingCount: Math.floor(Math.random() * 43) + 1,
    });
  }

  // follow
  if (req.method === "POST" && req.originalUrl === "/follow") {
    return res.jsonp({
      userName: req.body.userName,
      avatar: req.body.avatar,
      isFollowing: true,
      isOwnProfile: req.body.isOwnProfile,
    });
  }

  // unfollow
  if (req.method === "POST" && req.originalUrl === "/unfollow") {
    return res.jsonp({
      userName: req.body.userName,
      avatar: req.body.avatar,
      isFollowing: false,
      isOwnProfile: req.body.isOwnProfile,
    });
  }

  // followers
  if (req.method === "GET" && req.originalUrl === "/network/followers") {
    const randomInt = Math.floor(Math.random() * 10) + 1;
    const data = { followers: [] };

    for (let i = 0; i < randomInt; i++) {
      data.followers.push({
        userName: `follower ${i + 1}`,
        avatar: "https://img.icons8.com/color/96/000000/user.png",
        isFollowing: true,
        isOwnProfile: false,
      });
    }

    return res.jsonp(data.followers);
  }

  // following
  if (req.method === "GET" && req.originalUrl === "/network/following") {
    const randomInt = Math.floor(Math.random() * 10) + 1;
    const data = { following: [] };

    for (let i = 0; i < randomInt; i++) {
      data.following.push({
        userName: `follower ${i + 1}`,
        avatar: "https://img.icons8.com/color/96/000000/user.png",
        isFollowing: true,
        isOwnProfile: false,
      });
    }

    return res.jsonp(data.following);
  }

  // Tweet api

  // tweetDay
  if (req.method === "GET" && req.originalUrl === "/tweets") {
    return res.jsonp({
      tweetDayId: 1,
      songUrl:
        "https://www.xeno-canto.org/sounds/uploaded/BPSDQEOJWG/XC448690--Tofsvipa-varningsl%C3%A4te-Eneb%C3%A5gsudden%2C%20Brevik%20Vg-%282017-05-01%2012.05%29-LS140667.mp3",
      displayDay: "2021-02-18T00:00:00Z",
      creationDate: "2020-11-27T22:30:26.5866667Z",
      lastUpdateDate: "2021-01-29T14:32:24.91Z",
      birdId: "1113",
      species: "Vanellus vanellus",
      englishName: "Lapwing",
    });
  }

  // tweet archive
  if (req.method === "GET" && req.originalUrl === "/tweetArchive") {
    const randomInt = Math.floor(Math.random() * 10) + 1;
    const data = [];

    for (let i = 0; i < randomInt; i++) {
      data.push({
        tweetDayId: i,
        songUrl:
          "https://www.xeno-canto.org/sounds/uploaded/BPSDQEOJWG/XC448690--Tofsvipa-varningsl%C3%A4te-Eneb%C3%A5gsudden%2C%20Brevik%20Vg-%282017-05-01%2012.05%29-LS140667.mp3",
        displayDay: "2021-02-18T00:00:00Z",
        creationDate: "2020-11-27T22:30:26.5866667Z",
        lastUpdateDate: "2021-01-29T14:32:24.91Z",
        birdId: "1113",
        species: "Vanellus vanellus",
        englishName: "Lapwing",
      });
    }

    return res.jsonp(data);
  }

  // user profile
  if (req.method === "GET" && req.originalUrl === "/userprofile") {
    return res.jsonp({
      user: {
        userName: "monkey",
        avatar: "https://img.icons8.com/color/96/000000/user.png",
        isFollowing: false,
        isOwnProfile: true,
      },
      registrationDate: "2021-06-14T23:26:54.1974072Z",
      observationCount: {
        totalObservationsCount: Math.floor(Math.random() * 100) + 1,
        uniqueSpeciesCount: Math.floor(Math.random() * 55) + 1,
      },
      followersCount: Math.floor(Math.random() * 50) + 1,
      followingCount: Math.floor(Math.random() * 60) + 1,
    });
  }

  // Generate random data...
  // Using JS instead of a JSON file, you can create data programmatically.

  //     const data = { users: [] }
  //     // Create 1000 users
  //     for (let i = 0; i < 1000; i++) {
  //       data.users.push({ id: i, name: `user${i}` })
  //     }
  //     return data
  //   }

  next();
};
