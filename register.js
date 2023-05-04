const fetch = require("node-fetch");


const SLAP_COMMAND = {
    name: 'image',
    description: 'Create image with GPT_IMAGE_GENERATOR',
    options: [{
        name: 'image',
        description: 'Prompt for openai',
        type: 3,
        required: true,
    }, {
        name: 'limit',
        description: 'Limit for openai',
        type: 10,
        required: true,
    }],
};

const INVITE_COMMAND = {
    name: 'invite',
    description: 'Get an invite link to add the bot to your server',
};


(async () => {
    const response = await fetch(
        `https://discord.com/api/v8/applications/1103031357128585348/commands`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot `,
            },
            method: "PUT",
            body: JSON.stringify([SLAP_COMMAND, INVITE_COMMAND]),
        }
    );

    if (response.ok) {
        console.log("Registered all commands");
    } else {
        console.error("Error registering commands");
        const text = await response.text();
        console.error(text);
    }
})()
