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
 
## Getting Started
* Fork this repository
* Develop the single page app
* When complete please send us a pull request
