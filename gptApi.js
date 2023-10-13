const axios = require('axios');
const { OPENAI_API_KEY } = require('./env.js');  // 请确保这个是安全的

async function requestOpenAIApi(code) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": "As a senior code review analyst, you need to help me review the code." },
                { "role": "user", "content": `Review the following commit and its diff:: \n\n${code}\n\nReview:` }
            ],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error while requesting OpenAI API:", error);
        // 可以选择在此处返回一个默认消息，或者将错误向上抛出，由调用函数进一步处理
        return "Error while reviewing the code. Please try again later.";
    }
}

exports.requestOpenAIApi = requestOpenAIApi;
