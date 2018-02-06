import * as express from 'express';
import { Express } from 'express-serve-static-core';
import { Server } from 'http';
import * as socketio from 'socket.io';
import * as path from 'path';
import Terminal from './terminal/Terminal';
import { TerminalCommand, TerminalConfig } from './terminal/interfaces/TerminalInterface';
import * as commands from './commands';

const app: Express = express(),
    http: Server = new Server(app),
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
terminal.commands = commands.list;

io.on('connection', (socket) => {
    socket.on('terminal command', (cmd) => {
        terminal.useSocket('terminal command', socket, io);
        terminal.handleCommand(cmd);
    });
});

http.listen(2000);