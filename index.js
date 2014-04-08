var through     = require('through')
var split       = require('split')
var PassThrough = require('stream').PassThrough;

exports.transform = function(line){
  var tokens = line.split(' ');
  var timestamp = tokens[0];
  var host      = tokens[1];
  var tail      = tokens.slice(2)
  if(host) host = host.replace(':','')
  tail.unshift('host=' + host)
  tail.unshift('timestamp=' + timestamp)
  return tail.join(' ');
}

//returns a stream that splits and parses logfmt into objects
exports.stream = function(options){
  var options = options || {};

  var stream = new PassThrough();
  var self = this;

  var syslogToLogfmt = through(function(line){
    if(line !== '') this.queue(exports.transform(line) + "\n")
  })

  // When a source stream is piped to us, undo that pipe, and save
  // off the source stream piped into our internally managed streams.
  stream.on('pipe', function(source) {
    if(source.unpipe) source.unpipe(this);
    this.transformStream = source.pipe(split()).pipe(syslogToLogfmt);
  });

  // When we're piped to another stream, instead pipe our internal
  // transform stream to that destination.
  stream.pipe = function(destination, options) {
    return this.transformStream.pipe(destination, options);
  };

  return stream;
}
