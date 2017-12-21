const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    moment = require('moment');

app.use(express.static('assets'));

app.get('/', (req, res, next) => {
    res.sendFile(`${__dirname}/index.html`);
});

const commands = {
    "help": {
        "doc": "Get a list of all availables commands you can do",
        "action": (parameters, socket, io) => {
            let answer = "";

            Object.keys(commands).forEach((index) => {
                answer += `<li>${index} - ${commands[index].doc}`;
            });

            socket.emit('terminal command', `Here is a list of availables commands you can do : [<ul>${answer}</ul>]`);
        }
    },
    "say": {
        "doc": "Say something to the others",
        "action": (parameters, socket, io) => {
            let message = ``;

            parameters.forEach((param) => {
                message += `${param} `;
            });

            io.emit('terminal command', `${socket.client.id} say: ${message}`);
        }
    },
    "cowsay": {
        "doc": "",
        "action": (parameters, socket, io) => {
            let message = ``;

            parameters.forEach((param) => {
                message += `${param} `;
            });

            io.emit('terminal command', ` _________________\n` +
                `< ${message} >\n` +
                ` -----------------\n` +
                `          \\   ^__^\n` +
                `           \\  (♥♥)\\_______\n` +
                `              (__)\\                )\\/\\\n` +
                `                  ||---------w   |\n` +
                `                  ||                 ||\n`);
        }
    },
    "calc": {
        "doc": "",
        "action": (parameters, socket, io) => {
            let calc = parameters[0];
            for (let i = 1; i < parameters.length; i++) {
                if (parameters[i + 1] && parameters[i]) {
                    switch(parameters[i]) {
                        case "+":
                            calc += parseInt(parameters[i + 1]);
                            break;
                        case "-":
                            calc -= parseInt(parameters[i + 1]);
                            break;
                        case "*":
                            calc *= parseInt(parameters[i + 1]);
                            break;
                        case "/":
                            calc /= parseInt(parameters[i + 1]);
                            break;
                        case "^":
                            calc = Math.pow(calc, parseInt(parameters[i + 1]));
                            break;
                    }
                }

                i++;
            }

            socket.emit('terminal command', (calc != null && calc != "" ? calc : 0));
        }
    }
};

function emitCmd(socket, cmd) {
    socket.emit('terminal command', `[${moment().format('YYYY/MM/DD HH:mm:ss')}]> $ ${cmd}`);
}

io.on('connection', (socket) => {
    socket.on('terminal command', (cmd) => {
        if (cmd.length > 0) {
            let parameters = cmd.split(' ');
            let userCommand = parameters.shift();

            if (commands[userCommand]) {
                commands[userCommand].action(parameters, socket, io);
            } else {
                emitCmd(socket, cmd);
                socket.emit('terminal command', `Sorry but this command doesn't exists '${cmd}'`);
            }
        }
    });
});

http.listen(2000);