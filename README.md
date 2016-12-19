# Glow AngularJS Coding Assessment
To validate a programmers skills in developing modern web applications we would
like you to create a small AngularJS application.

## Requirements
The task we would like you to complete is to create a basic web application that
fetches flight data and charts it in a graphical UI. The data is a subset of American
domestic flight information provided by http://www.transtats.bts.gov
Note that the date format in the data is in the form `mmddHHmm`.

* Request the data from one of these two links, the second is compressed:
  1. https://s3-ap-southeast-2.amazonaws.com/glow-dev-assets/flight-data.csv
  (5.2MB)
  1. https://s3-ap-southeast-2.amazonaws.com/glow-dev-assets/flight-data-gz.csv
  (Content-Encoding: gzip, size 1.1MB)
* Display a graphical representation of flight frequency versus time of day
* Display a graphical representation of the delay
* Display a graphical representation of the flight distance
* Allow the data to be filtered by destination airport code

## What we will be looking for
This is a deliberately open ended task and we are looking to see how you work unencumbered
and so we can understand what matters to you as a mobile and web developer. Some key elements
we will be looking for in the applicant are:
* Use of suitable design patterns
* UI interaction, data binding principles and understanding of UX best practices
* Async development principals when displaying data and making network calls

## Installation
This application is scaffolded from yeoman angular generator.
Run `npm install && bower install` to install dependencies we need.

## Running
Run `grunt serve` and hit http://localhost:9000 on your browser.

## Live demo
I deployed this project on Firebase hosting.
You can see at https://flight-data-883ed.firebaseapp.com

## Features
This application shows flight frequency vs time of day, delay and flight distance.
It use Google Maps to display flight distances to destination. (This idea is inspired from a price map of Airbnb)
It also use Google Charts to display the number of on time flights and delayed flights with an average of delayed flight time.
