export default {
    doc: "Say something to the others",
    action: (parameters, socket, io) => {
        let message = ``;

        parameters.forEach((param) => {
            message += `${param} `;
        });

        io.emit('terminal command', `${socket.client.id} say: ${message}`);
    }
}