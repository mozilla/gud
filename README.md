# Growth and Usage Dashboard

This is a light, server-powered dashboard showing the smoot growth metrics. It's meant to be a proof of concept for now. The frontend talks to a tiny node server by passing it the segments / usage criteria / etc. necessary for the query, and in theory the tiny web server sends the query to be run by BigQuery (subject to an API key, etc.).

The basic interactions are on-track, but there is much to the frontend design I _haven't_ actually done yet, so if something seems a bit amiss / inaccurate, it will probably be fixed / implemented. All the same, feel free to file an issue in this repository w/ questions / concerns.

Dependencies:

– Node 11.5.0 / current NPM version

To install:

- Make sure you nave Node / npm.
- run `npm install` in the directory where you cloned this repository.

To run locally:

The GCP commands in these instructions will not work unless you work under Katie Parlante. If you want to run this project and you don't work under Katie Parlante, please contact Jason Thomas or Blake Imsland.

- Run `gcloud auth application-default login`
- Run `gcloud config set project moz-fx-data-derived-datasets`
- To run the server, run `node server` which starts a tiny web server on port 3000 (go to `localhost:3000` in your browser).
- To build / update the frontend, type `npm run dev`, which spins up another web server (that we're not going to use, sorry for the redundancy here) and builds the little dev version of the frontend.
– I'll make it so you don't have to run two servers like this at some point, but this works for now!



Ping me @hamilton on Slack for any other questions.
