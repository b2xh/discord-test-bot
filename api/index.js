const {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} = require('discord-interactions');
const getRawBody = require('raw-body');

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

const {
  Configuration,
  OpenAIApi
} = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const INVITE_COMMAND = {
  name: 'Invite',
  description: 'Get an invite link to add the bot to your server',
};

const SUPPORT_COMMAND = {
  name: 'Support',
  description: 'Like this bot? Support me!',
};

const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&scope=applications.commands`;

/**
 * Gotta see someone 'bout a trout
 * @param {VercelRequest} request
 * @param {VercelResponse} response
 */
module.exports = async (request, response) => {
  if (request.method === 'POST') {
    const signature = request.headers['x-signature-ed25519'];
    const timestamp = request.headers['x-signature-timestamp'];
    const rawBody = await getRawBody(request);

    const isValidRequest = verifyKey(
      rawBody,
      signature,
      timestamp,
      process.env.PUBLIC_KEY
    );

    if (!isValidRequest) {
      console.error('Invalid Request');
      return response.status(401).send({
        error: 'Bad request signature '
      });
    }

    const res = await openai.createImage({
      prompt: message.data.options[0].value,
      n: 1,
      size: "1024x1024",
    });

    if (message.type === InteractionType.APPLICATION_COMMAND) {

      switch (message.data.name.toLowerCase()) {
        case SLAP_COMMAND.name.toLowerCase():
          response.status(200).send({
            type: 4,
            data: {
              files: [res.data.data[0].url],
              content: `${message.data.options[0].value}`,
            },
          });
          console.log('Slap Request');
          break;
        case INVITE_COMMAND.name.toLowerCase():
          response.status(200).send({
            type: 4,
            data: {
              content: INVITE_URL,
              flags: 64,
            },
          });
          console.log('Invite request');
          break;
        case SUPPORT_COMMAND.name.toLowerCase():
          response.status(200).send({
            type: 4,
            data: {
              content: "Thanks for using my bot! Let me know what you think on twitter (@IanMitchel1). If you'd like to contribute to hosting costs, you can donate at https://github.com/sponsors/ianmitchell",
              flags: 64,
            },
          });
          console.log('Support request');
          break;
        default:
          console.error('Unknown Command');
          response.status(400).send({
            error: 'Unknown Type'
          });
          break;
      }
    } else {
      console.error('Unknown Type');
      response.status(400).send({
        error: 'Unknown Type'
      });
    }
  }
};