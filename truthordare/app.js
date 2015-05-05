var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};

var dares = [];
dares.push("Peel a banana using your feet");
dares.push("Say the alphabet backwards as fast as you can");
dares.push("Prank call your Mom.");

var truths = [];
truths.push("If you were marooned on an island with just a single person, who would you like it to be?");
truths.push("Would you rather have a pet, or a sibling?");
truths.push("If you could have anything in the world, what would it be?");

function getRandomDares() {
    return dares[Math.floor(Math.random() * dares.length)];
}
function getRandomTruths() {
    return truths[Math.floor(Math.random() * truths.length)];
}

https.createServer(options, function(req, res) {
    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            console.dir(jsonString, {
                depth: 5
            });
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};


            echoResponse.response.outputSpeech.type = "PlainText"
            echoResponse.response.outputSpeech.text = "Do you want truth or dare?"
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            console.log('JSON', theRequest.request);
            if (typeof theRequest.request.intent !== 'undefined') {
                choice = theRequest.request.intent.slots.Choice.value;
                if (choice === "dare"){
                dare = getRandomDares();
                echoResponse.response.outputSpeech.text = dare;
                //echoResponse.response.outputSpeech.text = "you said " + choice;
                 //echoResponse.response.card = {}
                 //echoResponse.response.card.type = "PlainText";
                 //echoResponse.response.card.title = "truth or dare";
                 //echoResponse.response.card.subtitle = choice;
                 //echoResponse.response.card.content = "dare";
                echoResponse.response.shouldEndSession = "false";
            }
            if (choice === "truth"){
                truth = getRandomTruths();
                echoResponse.response.outputSpeech.text = truth;
                //echoResponse.response.outputSpeech.text = "you said " + choice;
                // echoResponse.response.card = {}
                // echoResponse.response.card.type = "PlainText";
                // echoResponse.response.card.title = choice;
                // echoResponse.response.card.subtitle = choice;
                // echoResponse.response.card.content = choice;
                echoResponse.response.shouldEndSession = "false";
            }

            }
            myResponse = JSON.stringify(echoResponse);
            res.setHeader('Content-Length', myResponse.length);
            res.writeHead(200);
            res.end(myResponse);
            console.log('from post', myResponse);

        });
    } else {
        myResponse = JSON.stringify(echoResponse);
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }
}).listen(3007); //Put number in the 3000 range for testing and 443 for production
