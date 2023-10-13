const axios = require('axios');

const OPENAI_API_KEY = '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';  // 请确保这个是安全的

//const code = "console.log(`server is running on http://localhost:${APP_PORT}`)"

async function requestOpenAIApi(code) {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
            { "role": "system", "content": "As a senior code review analyst, you need to help me review the code." },
            { "role": "user", "content": `Review the following code: \n\n${code}\n\nReview:` }
        ],
        max_tokens: 150
    }, {
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
    });
    return response.data.choices[0].message.content;
}
module.exports = requestOpenAIApi