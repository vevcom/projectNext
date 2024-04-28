import 'server-only'
import nodemailer from "nodemailer"
import { SendEmailValidation, sendEmailValidation } from './validation';
import { ombulBroadcast } from './ombulBroadcast';

export async function sendMail(rawdata: SendEmailValidation['Detailed']) {

    ombulBroadcast.sendSingleMail(rawdata);
}

