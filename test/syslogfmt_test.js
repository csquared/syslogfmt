var assert = require('assert');
var syslogfmt = require('../index.js');
var stream = require('stream');
var through = require('through');

suite("syslogfmt", function(){
  var line     = '2013-07-27T06:36:33.949032+00:00 heroku[router]: at=info method=PUT';
  var expected = 'timestamp=2013-07-27T06:36:33.949032+00:00 host=heroku[router] at=info method=PUT';

  test('converts simple line', function(){
    var actual = syslogfmt.transform(line);
    assert.equal(expected, actual)
  })

  test('converts stream', function(){
    var s = new stream.PassThrough();
    s.push(line);
    s.push(null);

    s.pipe(syslogfmt.stream()).pipe(through(function(actual){
      assert.equal(expected + "\n", actual)
    }))
  })

  test('multiple lines', function(){
    var s = new stream.PassThrough();
    s.push(line + "\n");
    s.push(line + "\n");
    s.push(line + "\n");
    s.push(null);

    s.pipe(syslogfmt.stream()).pipe(through(function(actual){
      assert.equal(expected + "\n", actual)
    }))
  })
})
