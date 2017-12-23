export interface TerminalCommand {
    doc?: string;
    usage?: string[];
    action: (parameters: string[], socket: SocketIO.Socket, io: SocketIO.Server, fullparams: string, fullcmd: string) => void;
}

export interface TerminalCommands {
    [key: string]: TerminalCommand;
}

export interface TerminalError {
    usePrefix?: boolean;
    useSuffix?: boolean;

    message?: string;
}

export interface TerminalConfig {
    commands: TerminalCommands;

    socketEvent?: string | symbol;

    socket?: SocketIO.Socket;
    io?: SocketIO.Server;
    
    messages: {
        prefix?: string;
        suffix?: string;
    }

    errors: {
        cmdNotExists?: TerminalError;
        cmdNoUsage?: TerminalError;
    }
}

export interface TerminalException extends Error {
    
}