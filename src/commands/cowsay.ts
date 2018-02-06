export default {
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
}