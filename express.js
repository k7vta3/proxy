var express = require('express'),
    app = express();

var auth = require('auth');

var apiUrl = 'http://127.0.0.1:12345';

    app.use(auth());

    app.use('/*', function(req, res) {
	    console.log('server port: 3000 client ip: ' + req.connection.remoteAddress + ":"
            + req.connection.remotePort + '; connection - open ->')
        var url = apiUrl + req.originalUrl;
        var request = require('request');
        var reqTo = request(url);

        req.pipe(reqTo).pipe(res);
        
        res.on('close', function() {
    	    reqTo.write('ok');
    	    reqTo.end();
        });

        req.on('close', function() {
    	    console.log('server port: 3000; client ip: ' + req.connection.remoteAddress + ":"
                + req.connection.remotePort + '; connection - close ->');

            res.end("ok\n");
            reqTo.write('ok');
            reqTo.abort();
            reqTo.end();
        });

        reqTo.on('end', function(){
            console.log('server port: 3000; client ip: ' + req.connection.remoteAddress
                + ":" + req.connection.remotePort + '; connection - end <-');
           // reqTo.end();
            res.end("ok.\n");
        });

        reqTo.on('close', function(){
            console.log('server port: 3000; client ip: ' + req.connection.remoteAddress
                + ":" + req.connection.remotePort + '; connection - close <-');
            // reqTo.end();
            res.end("ok.\n");
        });

    });
    app.listen(3000);

var appTrans = express();
var apiUrlTrans = 'http://max:1@127.0.0.1:3000';

    appTrans.use(auth());
    appTrans.use('/*', function(req, res) {
        console.log('server port: 8080 client ip: ' + req.connection.remoteAddress
            + ":" + req.connection.remotePort + '; connection - open ->');
        var url = apiUrlTrans + req.originalUrl;
        var request = require('request');
        var reqTo3000 = request(url);
        
        req.pipe(reqTo3000).pipe(res);
        //console.log(' to 3000 from 8080 ' , reqTo.connection);

	res.on('close', function(){
	    reqTo3000.write("ok");
	    reqTo3000.end();
	});

        req.on('close', function(){
    	    console.log('server port: 8080; client ip: ' + req.connection.remoteAddress
                + ":" + req.connection.remotePort + '; connection - close ->');

            res.end("ok.\n");
            reqTo3000.write("ok"); // магия, без этой хуйни не закрываеться двухсторонний тонель/ там может быть похуй шо хоть "hello world"
            reqTo3000.end();
        });

        reqTo3000.on('end', function(){
            console.log('server port: 8080; client ip: ' + req.connection.remoteAddress
                + ":" + req.connection.remotePort + '; connection - end <-');
            res.end("ok.\n");
        });

        reqTo3000.on('close', function(){
            console.log('server port: 8080; client ip: ' + req.connection.remoteAddress
                + ":" + req.connection.remotePort + '; connection - close <-');
            res.end("ok.\n");
        });


    });
    appTrans.listen(8080);