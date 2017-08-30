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

// Add the express middleware to log HTTP events
app.use(timber.middlewares.express);


// Configure timber...
// The timber logger must be set so that the express middleware
// uses the correct logger. The middleware logs to console by default
timber.config.logger = winston;
// Enable logging of the request/response body (defaults to false)
timber.config.capture_request_body = true;
timber.config.capture_response_body = true;


// Create the index route
app.get('/', (req, res) => {
  res.send('Welcome to the index route :)');
});

// This route returns JSON data.
// Since we enabled http body logging in the timber config,
// the contents of the JSON object will be sent to timber.
app.get('/json', (req, res) => {
  res.json({
    description: 'This is some sample JSON data',
    date: new Date(),
    get: req.params
  });
});

// Start our express server
app.listen(port, () => {
  winston.log('info', `Server started on port ${port}`);
});
