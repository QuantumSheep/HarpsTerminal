class Terminal {
    constructor(config, object) {
        this.config = config;
        this.object = object;
        this.input = object.querySelector(".terminal-input").querySelector("input");
        this.display = object.querySelector(".terminal-display");
        this.commands = this.config.commands;

        this.input.placeholder = this.config.placeholder;

        this.installTerminal();
    }

    installTerminal() {
        var self = this;

        this.input.addEventListener('keydown', function(event) {
            if(event.key == "Enter") {
                self.launchCommand(self.input.value);
            }
        });
    }

    launchCommand(command) {
        var parameters = this.input.value.split(' ');
        var command = parameters.shift();

        var self = this;

        if(command == "help") {
            this.sendMessage("Here is a list of avaibles commands : [");

            Object.keys(this.commands).forEach(function(cmd) {
                self.sendMessage(cmd, false);
            });
            
            this.sendMessage("]", false);
        } else if(this.commands[command]) {
            this.commands[command](parameters);
        } else {
            this.sendMessage("Unknow command or parameters '" + command + "'...");
        }

        this.input.value = "";
    }

    sendMessage(message, activePrefix = true) {
        var prefix = "";

        if(activePrefix) {
            var date = new Date();
            prefix = "[" + date.getFullYear() + "/" 
                        + date.getMonth() + "/" 
                        + (date.getDate().toString().length > 1 ? date.getDate() : "0" + date.getDate()) 
                        + " " 
                        + (date.getHours().toString().length > 1 ? date.getHours() : "0" + date.getHours()) 
                        + ":" + (date.getMinutes().toString().length > 1 ? date.getMinutes() : "0" + date.getMinutes()) 
                        + ":" + (date.getSeconds().toString().length > 1 ? date.getSeconds() : "0" + date.getSeconds()) 
                        + "]> ";
        }

        this.display.innerHTML += "<span>" + prefix + message + "</span><br>";
    }
}

HTMLElement.prototype.terminal = function(config = {
    placeholder: "",
    commands: {}
}) {
    this.terminal = new Terminal(config, this);
};