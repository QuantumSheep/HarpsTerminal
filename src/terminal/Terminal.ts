import { TerminalConfig, TerminalCommands, TerminalError, TerminalException } from './interfaces/TerminalInterface';
import * as uuidv4 from 'uuid/v4';
import * as moment from 'moment';

export default class Terminal {
    readonly id: string;
    commands: TerminalCommands;

    socketEvent?: string | symbol;

    socket?: SocketIO.Socket;
    io?: SocketIO.Server;

    messages: {
        prefix?: string;
        suffix?: string;

        color?: string;
    }

    errors: {
        cmdNotExists?: TerminalError;
        cmdNoUsage?: TerminalError;
    }

    constructor(config?: TerminalConfig) {
        this.id = uuidv4();

        this.checkConfig(config);
    }

    checkConfig(config?: TerminalConfig) {
        if (!config) {
            this.generateConfig(config = {
                commands: {},
                messages: {},
                errors: {}
            });
        } else {
            this.generateConfig(config);
        }
    }

    generateConfig(config: TerminalConfig) {
        let errorModel: TerminalError = {
            usePrefix: false,
            useSuffix: false,

            message: ""
        };

        this.commands = config.commands ? config.commands : {};

        this.socketEvent = config.socketEvent;
        this.socket = config.socket;
        this.io = config.io;

        // Verify messages validity
        this.messages = config.messages ? config.messages : {};

        this.messages.prefix = config.messages.prefix ? config.messages.prefix : "";
        this.messages.suffix = config.messages.suffix ? config.messages.suffix : "";
        this.messages.color = config.messages.color ? config.messages.color : "";

        this.errors = config.errors ? config.errors : {};

        // Verify errors.cmdNotExists validity
        this.errors.cmdNotExists = config.errors.cmdNotExists ? config.errors.cmdNotExists : {};
        
        this.errors.cmdNotExists.usePrefix = config.errors.cmdNotExists.usePrefix ? config.errors.cmdNotExists.usePrefix : false;
        this.errors.cmdNotExists.useSuffix = config.errors.cmdNotExists.usePrefix ? config.errors.cmdNotExists.usePrefix : false;
        this.errors.cmdNotExists.message = config.errors.cmdNotExists.message ? config.errors.cmdNotExists.message : "";

        // Verify errors.cmdNoUsage validity
        this.errors.cmdNoUsage = config.errors.cmdNoUsage ? config.errors.cmdNoUsage : {};

        this.errors.cmdNoUsage.usePrefix = config.errors.cmdNoUsage.usePrefix ? config.errors.cmdNoUsage.usePrefix : false;
        this.errors.cmdNoUsage.useSuffix = config.errors.cmdNoUsage.usePrefix ? config.errors.cmdNoUsage.usePrefix : false;
        this.errors.cmdNoUsage.message = config.errors.cmdNoUsage.message ? config.errors.cmdNoUsage.message : "";
    }

    useSocket(event: string | symbol, socket: SocketIO.Socket, io: SocketIO.Server): void {
        this.socketEvent = event;
        this.socket = socket;
        this.io = io;
    }

    handleCommand(cmd: string): void {
        if(this.socket && this.io) {
            if (cmd.length > 0) {
                let parameters = cmd.split(' ');
                let userCommand = parameters.shift();
    
                let fullparams = parameters.join(' ');
                let fullcmd = cmd;
    
                if (this.commands && this.commands[userCommand]) {
                    this.commands[userCommand].action(parameters, this.socket, this.io, fullparams, fullcmd);
                } else {
                    this.emit(cmd);
                    this.socket.emit(this.socketEvent, `Sorry but this command doesn't exists '${cmd}'`);
                }
            }
        } else {
            
        }
    }

    emit(message: string): void {
        this.socket.emit(this.socketEvent, `${this.messages.prefix}${message}${this.messages.suffix}`);
    }
}