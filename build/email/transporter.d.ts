import 'dotenv/config';
import nodemailer from 'nodemailer';
declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export default transporter;
