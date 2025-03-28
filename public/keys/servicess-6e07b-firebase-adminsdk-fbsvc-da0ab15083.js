require('dotenv').config();

module.exports = {
  "type": "service_account",
  "project_id": "servicess-6e07b",
  "private_key_id": process.env.STORAGE_PRIVATE_KEY_ID,
  "private_key": `-----BEGIN PRIVATE KEY-----\n${process.env.STORAGE_PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`,
  "client_email": "firebase-adminsdk-fbsvc@servicess-6e07b.iam.gserviceaccount.com",
  "client_id": "108863560407963818909",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40servicess-6e07b.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}