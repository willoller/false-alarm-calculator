# False Alarm Calculator demo in AngualrJS

This is for demo-ing a False Alarm Billing Rules system.

It has support for several rule types including:

* The 2nd alarm in 1 month is billable: 100
* After 2 in 1 month bill 400
* (When `column`is 7000) 1 in 1 second bill 1000
* (When `column` isn't 7000) 4 in 1 year bill 300

Everything works using Javascript and is rendered in-browser, so NO
server-side configuration is needed. Just copy the files from the
`apps/` directory to a web server root and watch it go.

## Script

There is a "script" of sorts which outlines simple behaviors and canned
data to show the functionality. It is found at `apps/demo.html`.

## Nerd Stuff

If you care, unit tests are available in the `tests/` directory. They
run using Testacular (now Karma) and Jasmine. The tests are okay;
Karma + Jasmine is amazing.
