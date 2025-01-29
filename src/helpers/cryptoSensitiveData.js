const crypto = require('crypto');

const spliteKey = (kic) => {
    const key = Buffer.from(kic.slice(0, kic.indexOf('-') + 1), 'hex');
    const iv = Buffer.from(kic.slice(kic.indexOf('-') + 1, kic.length), 'hex');

    return { key, iv }
}

const encryptSensitiveData = (value, kic) => {
    const { key, iv } = spliteKey(kic);

    const algorithm = 'aes-256-cbc';
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    //log('Original text: ', value);
    //log('Encrypted text: ', encrypted);

    return encrypted;
}

const decryptSensitiveData = (encrypted, kic) => {
    const { key, iv } = spliteKey(kic);

    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    //log('Decrypted text: ', decrypted);

    return decrypted;
}

const hashDocument = (document) => {
    return crypto
        .createHash('sha1')
        .update(document)
        .digest('hex');
}

module.exports = { encryptSensitiveData, decryptSensitiveData, hashDocument }