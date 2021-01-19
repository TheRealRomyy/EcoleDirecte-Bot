// Create and export a function to translate
module.exports = async (path, option) => {

    // Create some variables
    let directory = "";
    let stop = false;

    // Get path
    for(let i = 0; i < path.length; i++) {
        if(path[i] == ":") stop = true;
        if(stop == false) directory += path[i]
    }

    let toSay = path.slice(path.indexOf(":")+1);

    // Resolve path
    let file = new require("../languages/" + directory);

    // Get message
    let message = file[toSay];
    if(message === undefined) message = "Message non trouvé !"; 

    // Get settings
    for(const [key, value] of Object.entries(option)) {
        message = message.replace("{{" + key + "}}", value);
    };

    // Return the message translated
    return message;
};