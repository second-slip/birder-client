# birder-client
Angular 15 client app for the Birder website. 

<!-- [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/) -->

[![Node.js CI](https://github.com/WinthorpeCross/birder-client/actions/workflows/node.js.yml/badge.svg)](https://github.com/WinthorpeCross/birder-client/actions/workflows/node.js.yml)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/WinthorpeCross/birder-client/node.js.yml)
[![codecov](https://codecov.io/gh/WinthorpeCross/birder-client/branch/master/graph/badge.svg?token=LIA3YIDXX2)](https://codecov.io/gh/WinthorpeCross/birder-client)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/WinthorpeCross/birder-client)


## Codespace demonstration

Run a working version in a fully-configured dev environment with Codespaces.

<details>
  <summary>Step 1 - Start the fake server (click for details)</summary>
  
  #### Start the fake server
  A fake REST API is provided by <a href="https://dotnetnorth.org.uk/](https://github.com/typicode/json-server">json-server</a>.  Start the fake server in the terminal with `npm run api`.  The data server will start on http://localhost:3000.  It will respond with fake data to enable users to sample the website.

  #### Some Code
  ```
  npm run api
  ```
</details>

<details>
  <summary>Step 2 - Serve the website (click for details)</summary>
  
  #### Serve the website
  After starting data server, open a second terminal window and type `npm start` to serve the website.  Then access the website in the browser on `http://localhost:4200`.

  #### Some Code
  ```
  npm start
  ```
</details>


<details>
  <summary>Step 3 - Explore the website (click for details)</summary>
  
  #### Explore the website
  The website will open at the login screen.  Type a fake email address (e.g. 'a@b.com') and a fake password and click the 'Login' button.  The website will open the main home screen for logged in users, which is the 'observations feed'.  

</details>

---

  
  #### Screenshot showing user starting the fake server
  
![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](https://myoctocat.com/assets/images/base-octocat.svg)
  



