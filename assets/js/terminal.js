var socket = io();

class Terminal {
    constructor(config, object) {
        this.config = config;
        this.object = object;
        this.input = object.querySelector(".terminal-input").querySelector("input");
        this.display = object.querySelector(".terminal-display");

        this.input.placeholder = this.config.placeholder;

        this.initTerminal();
    }

    initTerminal() {
        var self = this;

        this.input.addEventListener('keydown', function (event) {
            if (event.key == "Enter") {
                self.launchCommand(self.input.value);
            }
        });

        socket.on('terminal command', function (answer) {
            self.display.innerHTML += "<span>" + answer + "</span><br>";;
        });
    }

    launchCommand(command) {
        socket.emit('terminal command', this.input.value);

        this.input.value = "";
    }
}

HTMLElement.prototype.terminal = function (config = {
    placeholder: "",
    commands: {}
}) {
    this.terminal = new Terminal(config, this);
};