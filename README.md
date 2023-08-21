# MEAN Stack TradingDashboard

This project uses the MEAN stack (MongoDB, Express.js, Angular, Node.js) to build a crypto trading simulation dashboard. It implements data analytics, trading, trading strategy, and user feedback page. Users will be able to log in with their accounts or external APIs. Then they can inspect the data, try various price prediction algorithms on previous trading history, and make trades with different options. 

This project uses the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)):
* [**M**ongoose.js](http://www.mongoosejs.com) ([MongoDB](https://www.mongodb.com)): database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**ngular 2+](https://angular.io): frontend framework
* [**N**ode.js](https://nodejs.org): runtime environment

Other tools and technologies used:
* [Angular CLI](https://cli.angular.io): frontend scaffolding
* [Bootstrap](http://www.getbootstrap.com): layout and styles
* [Auth0](https://github.com/auth0/auth0-angular): user authentication
* [D3.js](https://d3js.org/): data visualization 
* [Redis](https://redis.io/): data caching
* [Machinelearn.js](https://github.com/machinelearnjs/machinelearnjs): price prediction machine learning algorithms

## Prerequisites
1. Install [Node.js](https://nodejs.org) and [MongoDB](https://www.mongodb.com)
2. Install Angular CLI: `npm i -g @angular/cli`
3. From project root folder install all the dependencies: `npm i`

## Run
1. `cd client`: enter client folder 
2. `ng serve -o`
3. `cd server`: enter server folder
4. `npx ts-node src/server.ts`

A window will automatically open at [localhost:4200](http://localhost:4200). Angular and Express files are being watched. Any change automatically creates a new bundle, restart Express server and reload your browser.

## Preview
![Preview](https://github.com/Xiaowen2024/FoundDashboard/blob/main/assets/home.gif)
![Preview](https://github.com/Xiaowen2024/MEAN-StackTradingDashboard/blob/main/strategy.gif)
![Preview](https://github.com/Xiaowen2024/MEAN-StackTradingDashboard/blob/main/trade.gif)
