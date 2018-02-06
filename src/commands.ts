import calc from './commands/calc';
import say from './commands/say';
import cowsay from './commands/cowsay';
import whoishere from './commands/whoishere';

const list = {
    calc: calc,
    say: say,
    whoishere: whoishere,
    cowsay: cowsay,
    help: {
        doc: "Get a list of all availables commands you can do",
        action: (parameters, socket, io) => {
            let answer: string = "";
    
            if (parameters[0]) {
                if (list[parameters[0]].usage) {
                    list[parameters[0]].usage.forEach((usage) => {
                        answer += `${usage}<br>`;
                    });
                    
                    socket.emit('terminal command', `Usage${(list[parameters[0]].usage.length > 1 ? 's' : '')} of '${parameters[0]}' : <br>${answer}`);
                } else {
                    socket.emit('terminal command', `Sorry, there is no usage documented for this command '${parameters[0]}'<br>`);
                }
            } else {
                Object.keys(list).forEach((index) => {
                    answer += `<li>${index} - ${list[index].doc}`;
                });
    
                socket.emit('terminal command', `Here is a list of availables commands you can do : [<ul>${answer}</ul>]<br>`);
            }
        }
    }
}

export { list };