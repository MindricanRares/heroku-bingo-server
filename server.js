var sessions=[]

var express = require("express"),
  app = express(),
  server = require("http").createServer(app),
  io = require("socket.io")({
    transports: ["xhr-polling"],
    "polling duration": 10
  }).listen(server);
let scoreResults = [];
io.on("connection", client => {
  client.on("subscribeToResults", interval => {
    console.log("client is subscribing to results with interval ", interval);
    setInterval(() => {
      client.emit("results", scoreResults.sort(compareScores));
    }, interval);
  });

  client.on("showNumberOfPlayers", interval => {
    var srvSockets = io.sockets.sockets;

    setInterval(() => {
      client.emit("numberOfPlayer", Object.keys(srvSockets).length);
    }, interval);
  });

  client.on("chat message", msg => {
    console.log(msg);
    scoreResults.push(msg);
  });

  client.on("request for default answers", msg => {
    console.log(msg);
    client.emit("default answers", pickAnswers());
  });
  
  client.on("create session with GUID", (GUID,sessionAnswers) => {
    console.log(GUID+"created"+sessionAnswers);
    sessions[GUID]=sessionAnswers;
  });

  client.on("request session with GUID",GUID=>{
    console.log(GUID+'request');
    client.emit('answers for session '+GUID,sessions[GUID]);
  })

  client.on("error", function() {});
});

server.listen(process.env.PORT || 8001);

function compareScores(a, b) {
  if (a[0] < b[0]) return 1;
  if (a[0] > b[0]) return -1;
  return 0;
}

const possibleAnswers = [
  "Know-it-all",
  "Someone is typing",
  "Misuse of words",
  "Someone snezees",
  "Innapropriate joke",
  "Foreign accent",
  "Loud talker",
  "Nothing accomplished",
  "On the same page",
  "Weather mention",
  "Sports mention",
  "Someone calling from the car",
  "Someone calling from home",
  "Dog barking",
  "Cellphone ringing",
  "Argument",
  "Dropped caller",
  "Someone enters late",
  "Some one repeats themselvs",
  "Uncontrollable cough",
  "Win win",
  "Can everyone hear me",
  "Is ____ on the call",
  "Nothing accomplished",
  "Some one has bad reception",
  "Questions avoided",
  "Is everyone here",
  "Soft talker",
  "Talk offline",
  "Can you repeat that",
  "Any updates",
  "Testing team",
  "How are things with _",
  "Working on it",
  "No updates",
  "I`ll take it as a follow up",
  "Laughing",
  "Are you still working on",
  "Talk to you later",
  "I`ll run some quick tests",
  "Sighing",
  "Can i asign this to you",
  "What`s the problem",
  "I will take a look",
  "Do you need any help",
  "Can you see my screen",
  "Backlog mention"
];

function pickAnswers() {
  let answers = [];
  while (answers.length < 25) {
    var randomnumber =
      Math.floor(Math.random() * possibleAnswers.length - 1) + 1;
    if (answers.indexOf(possibleAnswers[randomnumber]) > -1) continue;
    answers[answers.length] = possibleAnswers[randomnumber];
  }
  return answers;
}


