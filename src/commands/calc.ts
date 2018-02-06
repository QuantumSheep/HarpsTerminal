export default {
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