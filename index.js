const timber = require('timber');
const winston = require('winston');
const express = require('express');

// Initialize our express app
const app = express();

// Setup the default port to listen on
const port = process.env.PORT || 8080

// Initialize our timber transport stream
const stream = new timber.transports.HTTPS('Your-Timber-API-Key');

// Add the timber tranport to winston and attach our stream
winston.add(timber.transports.Winston, { stream });
// Remove the default transport so our logs are only displayed in timber
winston.remove(winston.transports.Console);

// In order to properly log exceptions to timber,
// we need to attach the timber stream to stderr.
// If you want exceptions to still be displayed in
// stdout, attach `[stream, process.stdout]` instead
timber.attach([stream], process.stderr);

// Add the express middleware to log HTTP events
app.use(timber.middlewares.express);


// Configure timber...
// The timber logger must be set so that the express middleware
// uses the correct logger. The middleware logs to console by default
timber.config.logger = winston;
// Enable logging of the request/response body (defaults to false)
timber.config.capture_request_body = true;


// Create the index route
app.get('/', (req, res) => {
  res.send('Welcome to the index route :)');
});

// try POSTing some JSON data to this route
app.post('/post', (req, res) => {
  res.send('Now check your logs, the request log line should be augmented with the json data')
});

app.get('/exception', (req, res) => {
  throw new Error('This is a sample exception');
});

// Start our express server
app.listen(port, () => {
  winston.log('info', `Server started on port ${port}`);
});
