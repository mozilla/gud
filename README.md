# Smoot Growth Dashboard

This is a light, server-powered dashboard showing the smoot growth metrics. It's meant to be a proof of concept for now. The frontend talks to a tiny node server by passing it the segments / usage criteria / etc. necessary for the query, and in theory the tiny web server sends the query to be run by BigQuery (subject to an API key, etc.). **For now, this prototype randomly creates the data and sends it back.** We will soon figure out the backend communication.

The basic interactions are on-track, but there is much to the frontend design I _haven't_ actually done yet, so if something seems a bit amiss / inaccurate, it will probably be fixed / implemented. All the same, feel free to file an issue in this repository w/ questions / concerns.

Dependencies:

– Node 11.5.0 / current NPM version

To install / run:

- Make sure you nave Node / npm.
- run `npm install` in the directory where you cloned this repository.
- to run the server, run `node server.js` which starts a tiny web server on port 3000 (go to `localhost:3000` in your browser)
- to build / update the frontend, type `npm run dev`, which spins up another web server (that we're not going to use, sorry for the redundancy) and builds the little dev version of the frontend.

Ping me @hamilton on Slack for any other questions.
