# Glow AngularJS Coding Assessment

Use this utility to view flight departures per hour and the average delay time for that hour.

You can also filter the data be selecting a destination from the list. This wil then render an interactive map showing the routes to that destination. Hover over the route on the map to show the origin and destination as well as the distance.

Hovering on a origin in the list will highlight the route on the map. Clicking on it will change the destination filter to the selected origin.

## Technologies Used
- Webpack for dev environment (packaging and live reloading)
- Babel for ES6 transpilation
- Angular 1.5
- Angular Material
- amCarts for chart
- amCarts Map for interactive map

## Installation

`run npm install`

## Running

Start the webpack dev server and then hit http://localhost:8888/

`run npm start`

## Whats not so good/could be better

- A few snippets of inline css in the component templates
- Duplication of route array to get ng-repeat working correctly
- Responsiveness of the page in general (would not look so good on mobile devices)


