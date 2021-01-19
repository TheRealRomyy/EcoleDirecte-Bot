// Create class ready
class Ready {

    // Add the client
    constructor(client) {
        this.client = client;
    };

    // Create a function run
    async run() {

        // Log a message
        this.client.logger.log("Bot is ready !")
        
    };
};

module.exports = Ready; // Export module