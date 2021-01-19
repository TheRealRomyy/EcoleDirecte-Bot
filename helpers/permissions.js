// Import the module chalk
const chalk = require("chalk");

// Create class Permissions
class Permissions {
    // Create a static check
    static check(guild, id, cfg) {

        // If no settings
        if(!guild || !id || !cfg) throw new Error("Missing settings in permissions !)");

        // Default permLevel
        let permLevel = 1;

        /* 
        1 => Normal user
        2 => Chat moderator
        3 => Moderator
        4 => Administrator
        5 => Bot moderator
        6 => Bot owner    
        */

        // Check perm level
        if(guild.member(id).hasPermission("MANAGE_MESSAGES")) permLevel = 2;

        if(guild.member(id).hasPermission("KICK_MEMBERS")) permLevel = 3;
        
        if(guild.member(id).hasPermission("ADMINISTRATOR")) permLevel = 4;

        if(cfg.staff.supports.includes(id)) permLevel = 5;

        if(cfg.staff.owner.includes(id)) permLevel = 6;

        return permLevel;
    };

    // Create a static to convert (in french)
    static convert(permLevel) {

        // Default permName
        let permName = "Utilisateur"; // Normal User

        // Check perm name
        if(permLevel == 2) permName = "Modérateur Chat"; // Chat Moderator
        if(permLevel == 3) permName = "Modérateur"; // Moderator
        if(permLevel == 4) permName = "Administrateur"; // Administrator
        if(permLevel == 5) permName = "Bot modérateur"; // Bot Moderator
        if(permLevel == 6) permName = "Bot owner"; // Bot owner x)

        return permName;
    };
};

module.exports = Permissions; // Export our class