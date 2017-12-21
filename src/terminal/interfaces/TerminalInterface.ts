export interface TerminalCommand {
    doc?: string;
    usage?: string;
    action: (parameters: string[], socket: SocketIO.Socket, io: SocketIO.Server, fullparams: string, fullcmd: string) => void;
}

export interface TerminalCommands {
    [key: string]: TerminalCommand;
}

export interface TerminalConfig {
    commands?: TerminalCommands;
}