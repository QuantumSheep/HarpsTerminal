import { TerminalConfig, TerminalCommands } from './interfaces/TerminalInterface';
import * as uuidv4 from 'uuid/v4';
import * as moment from 'moment';

export default class Terminal {
    readonly id: string;
    config: TerminalConfig;
    commands: TerminalCommands;

    socket: SocketIO.Socket;
    io: SocketIO.Server;

    constructor(config?: TerminalConfig) {
        this.id = uuidv4();
        this.commands = (config && config.commands ? config.commands : {});
    }

    useSocket(socket: SocketIO.Socket, io: SocketIO.Server): void {
        this.socket = socket;
        this.io = io;
    }

    handleCommand(cmd: string): void {
        if (cmd.length > 0) {
            let parameters = cmd.split(' ');
            let userCommand = parameters.shift();

            let fullparams = parameters.join(' ');
            let fullcmd = cmd;

            if (this.commands && this.commands[userCommand]) {
                this.commands[userCommand].action(parameters, this.socket, this.io, fullparams, fullcmd);
            } else {
                this.emitCmd(cmd);
                this.socket.emit('terminal command', `Sorry but this command doesn't exists '${cmd}'`);
            }
        }
    }

    emitCmd(cmd: string): void {
        this.socket.emit('terminal command', `[${moment().format('YYYY/MM/DD HH:mm:ss')}]> $ ${cmd}`);
    }
}