let express = require("express");
let app = express();

let http = require("http");
const { networkInterfaces } = require("os");
let server = http.Server(app);

app.use(express.static("client"));
let io = require("socket.io")(server);

let messageArhive = [];

const isQuestion = (msg) => {
  return msg.match(/\?$/);
};

const askingTime = (msg) => {
  return msg.match(/time/i);
};

const askingWeather = (msg) => {
  return msg.match(/weather/i);
};

const isGreating = (msg) => {
  if (msg.match(/hi/i) || msg.match(/hello/i)) {
    return true;
  } else {
    return false;
  }
};

const getWeather = (callback) => {
  let request = require("request");
  request.get(
    "https://www.metaweather.com/api/location/4118/",
    function (error, response) {
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(response.body);
        callback(data.consolidated_weather[0].weather_state_name);
      }
    }
  );
};
let botAnswer = "Jinn says: ";

io.on("connection", function (socket) {
  messageArhive.map((message) => {
    socket.send(message);
  });

  socket.on("message", function (msg) {
    messageArhive.push(msg);

    if (!isQuestion(msg)) {
      if (isGreating(msg)) {
        io.emit("message", msg);
        setTimeout(() => {
          let userName = msg.split(" ");
          io.emit(
            "message",
            botAnswer + "hello " + userName[0] + "! ask me about weather ot time!!!"
          );
        }, 800);
      } else {
        io.emit("message", msg);
      }
    } else if (askingTime(msg)) {
      io.emit("message", msg);
      setTimeout(() => {
        io.emit("message", botAnswer + new Date().toLocaleTimeString() + " on my iWatch.");
      }, 800);
    } else if (askingWeather(msg)) {
      io.emit("message", msg);
      getWeather(function (weather) {
        io.emit(
          "message",
          botAnswer + " seems it\'s going to be " + weather.toLowerCase() + "."
        );
      });
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}

server.listen(port, function () {
  console.log("Chat server running on port: http://localhost:8080");
});
