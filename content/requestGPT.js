const axios = require('axios');
const { GPT_URL } = require('../env.js');

async function requestGPT(code, tips) {
    const content = {
        messages: [
            { "role": "user", "content": `${tips}: ${code}` }
        ],
        model: "",
        max_tokens: "",
        temperature: "",
        top_p: "",
    }
    try {
        const response = await axios.post(GPT_URL, content);
        return response.data.message;
    } catch (error) {
        console.error('Error call the API:', error);
        throw new Error('Failed to call the GPT API.');
    }
}

exports.requestGPT = requestGPT;
