var connect = require( 'connect' );

var app = connect()
  .use(connect.static(__dirname))
  .use(connect.directory(__dirname))
  .listen(80);
