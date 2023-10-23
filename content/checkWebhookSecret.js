const crypto = require('crypto');

function checkWebhookSecret(req, secret) {
    const expectedSignature = req.headers['x-hub-signature'] || '';
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha1', secret);
    const calculatedSignature = 'sha1=' + hmac.update(payload).digest('hex');

    return crypto.timingSafeEqual(Buffer.from(calculatedSignature), Buffer.from(expectedSignature));
}


exports.checkWebhookSecret = checkWebhookSecret