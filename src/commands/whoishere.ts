export default {
    doc: "Know who is here",
    usage: [
        "whoishere"
    ],
    action: (parameters, socket, io, fullparams, fullcmd) => {
        socket.emit('terminal command', `There is ${Object.keys(io.engine.clients).length} users connected.`);
    }
}