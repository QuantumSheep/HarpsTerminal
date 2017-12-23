import * as express from 'express';
import { Express } from 'express-serve-static-core';
import * as httpserv from 'http';
import { Server } from 'http';
import * as socketio from 'socket.io';
import * as path from 'path';
import Terminal from './terminal/Terminal';
import { TerminalCommand, TerminalConfig } from './terminal/interfaces/TerminalInterface';
import* as moment from 'moment';

const app: Express = express(),
    http: Server = new httpserv.Server(app),
    io: SocketIO.Server = socketio(http);

app.use(express.static('assets'));

app.get('/', (req, res, next) => {
    res.sendFile(path.resolve(`views/index.html`));
});

let terminal: Terminal = new Terminal();

terminal.messages.prefix = `$root `;
terminal.errors = {
    cmdNoUsage: {
        message: "There is no usages listed for this command"
    },
    cmdNotExists: {
        message: "Sorry but this command doesn't exists"
    }
}
terminal.commands = {
    "help": {
        doc: "Get a list of all availables commands you can do",
        action: (parameters, socket, io) => {
            let answer: string = "";

            if (parameters[0]) {
                if (terminal.commands[parameters[0]].usage) {
                    terminal.commands[parameters[0]].usage.forEach((usage) => {
                        answer += `${usage}<br>`;
                    });

                    socket.emit('terminal command', `Usage${(terminal.commands[parameters[0]].usage.length > 1 ? 's' : '')} of '${parameters[0]}' : <br>${answer}`);
                } else {
                    socket.emit('terminal command', `Sorry, there is no usage documented for this command '${parameters[0]}'<br>`);
                }
            } else {
                Object.keys(terminal.commands).forEach((index) => {
                    answer += `<li>${index} - ${terminal.commands[index].doc}`;
                });

                socket.emit('terminal command', `Here is a list of availables commands you can do : [<ul>${answer}</ul>]<br>`);
            }
        }
    },
    "say": {
        doc: "Say something to the others",
        action: (parameters, socket, io) => {
            let message = ``;

            parameters.forEach((param) => {
                message += `${param} `;
            });

            io.emit('terminal command', `${socket.client.id} say: ${message}`);
        }
    },
    "cowsay": {
        doc: "Tell what the cow say",
        action: (parameters, socket, io) => {
            let message = ``;

            parameters.forEach((param) => {
                message += `${param} `;
            });

            io.emit('terminal command', ` _________________\n` +
                `< ${message} >\n` +
                ` -----------------\n` +
                `          \\   ^__^\n` +
                `           \\  (♥♥)\\_______\n` +
                `               (__)\\              )\\/\\\n` +
                `                  ||---------w   |\n` +
                `                  ||                 ||\n`);
        }
    },
    "calc": {
        doc: "Calculate some numbers",
        usage: [
            "calc [any basic mathematic expression]"
        ],
        action: (parameters, socket, io, fullparams, fullcmd) => {
            if (RegExp(/^[0-9\/\(\)\~\*\<\>&\-\+\|\^\% ]+$/, 'i').test(fullparams)) {
                socket.emit('terminal command', eval(fullparams));
            } else {
                socket.emit('terminal command', `Incorrect syntax '${fullcmd}'`);
            }
        }
    }
};

io.on('connection', (socket) => {
    terminal.useSocket('terminal command', socket, io);
    socket.on('terminal command', (cmd) => {
        terminal.handleCommand(cmd);
    });
});

http.listen(2000);