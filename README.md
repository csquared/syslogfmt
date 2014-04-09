# syslogfmt

Convert syslog lines to logfmt

## cmd line

syslog:

    $ cat examples/r14.logfmt
    2014-03-25T18:58:13.290201+00:00 heroku[statement_builder.2]: Error R14 (Memory quota exceeded)
    2014-03-25T18:58:34.457225+00:00 heroku[statement_builder.2]: Process running mem=12288M(200.0%)

logfmt:

    $ cat examples/r14.logfmt | syslogfmt
    timestamp=2014-03-25T18:58:13.290201+00:00 host=heroku[statement_builder.2] Error R14 (Memory quota exceeded)
    timestamp=2014-03-25T18:58:34.457225+00:00 host=heroku[statement_builder.2] Process running mem=12288M(200.0%)


## streams

```javascript
  req.pipe(syslogfmt.stream())
```

Example Web Request:

```javascript
server.post('/logs', function(req, res, next){

  req.pipe(syslogfmt.stream())
     .pipe(logfmt.streamParser())

  res.send(201, 'OK');
  return next();
})
```




