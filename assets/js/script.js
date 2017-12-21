document.getElementById("terminal1").terminal({
    placeholder: "Enter commands here, to have a list of available commands type 'help'",
    commands: {
        "help": function(parameters) {
            console.log(parameters);
        }
    }
});