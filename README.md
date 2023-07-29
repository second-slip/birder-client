# birder-client

This is the Angular 16 client app for the Birder website. 

<!-- [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/) -->

[![Node.js CI](https://github.com/andrew-stuart-cross/birder-client/actions/workflows/node.js.yml/badge.svg)](https://github.com/andrew-stuart-cross/birder-client/actions/workflows/node.js.yml)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/andrew-stuart-cross/birder-client/node.js.yml)
[![codecov](https://codecov.io/gh/andrew-stuart-cross/birder-client/branch/master/graph/badge.svg?token=LIA3YIDXX2)](https://codecov.io/gh/andrew-stuart-cross/birder-client)
[![Known Vulnerabilities](https://snyk.io/test/github/andrew-stuart-cross/birder-client/badge.svg)](https://snyk.io/test/github/andrew-stuart-cross/birder-client)

<!-- ![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/andrew-stuart-cross/birder-client) -->

Birder is a social network-style platform for logging, sharing, and analysing bird observations. Ultimately, the aim is to feed the data to an algorithm which will help with species identification.

The complementary server respository is [birder-server](https://github.com/andrew-stuart-cross/birder-server).

## Open a demo in GitHub Codespaces

Run a working version in a fully-configured dev environment with Codespaces.

<details>
  <summary>Step 1:  start the fake API (click for details)</summary>
  
  #### Start the fake server
  A fake <a href="https://github.com/andrew-stuart-cross/birder-server">birder-server</a> REST API is provided using a <a href="https://dotnetnorth.org.uk/](https://github.com/typicode/json-server">json-server</a> implementation.  Start the fake server in the terminal with `npm run api`.  It will start on http://localhost:3000.  It will respond with fake data to enable users to sample the website.

  ##### npm command
  ```
  npm run api
  ```
  ##### Screenshot
  ![step-1-screenshot](https://user-images.githubusercontent.com/35421339/234880826-88feca4a-2cd4-496e-af76-c0a07624c2c1.png)
</details>

<details>
  <summary>Step 2:  serve the website (click for details)</summary>
  
  #### Serve the website
  After starting data server, open a second terminal window and type `npm start` to serve the website.  Then access the website in the browser on `http://localhost:4200`.

  #### Some Code
  ```
  npm start
  ```
  ##### Screenshot
  ![step-2-screenshot](https://user-images.githubusercontent.com/35421339/234881927-80ef689b-c5ac-4a27-971e-98d4274b9942.png)
</details>


<details>
  <summary>Step 3: use the website (click for details)</summary>
  
  #### Explore the website
  The website will open at the login screen.  Type a fake email address (e.g. 'a@b.com') and a fake password and click the 'Login' button.  The website will open the main home screen for logged in users, which is the 'observations feed'. 
  
  ##### Screenshot
![step-3-screenshot](https://user-images.githubusercontent.com/35421339/234882088-40209c0c-8c49-4d89-9074-2ac4cb19f92b.png)
</details>
