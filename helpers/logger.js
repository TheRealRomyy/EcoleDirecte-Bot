// Import module chalk (write a message with color)
const chalk = require("chalk");

// Create class logger
class Logger {
    static log(type = "log", msg) {

        // If there is no type, it's a log
        if(!msg && type !== "separator") {
            msg = type; 
            type = "info";
        };

        // Color message
        switch(type) {
            case "warn":
                console.log(chalk.yellow(chalk.bold("Warn: ") + msg))
                break;
            case "error":
                console.log(chalk.red(chalk.bold("Error: ") + msg))
                break;
            case "info":
                console.log(chalk.white(msg))
                break;
            case "event":
                console.log(chalk.magenta("Event: '"+ chalk.bold(msg) +  "' was succesfully loaded !"));
                break;
            case "separator":
                console.log(chalk.white("----------------------------------------------"));
                break;
            case "command":
                console.log(chalk.cyan("Command: '" + chalk.bold(msg) + "' was successfully loaded !"));
                break;
            default:
                throw new Error("Invalid type iof log !");
        };
    };
};

module.exports = Logger; // Export module