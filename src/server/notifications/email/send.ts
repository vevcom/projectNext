import 'server-only'
import nodemailer from "nodemailer"
import { SendEmailValidation, sendEmailValidation } from './validation';
import { ombulBroadcast } from './ombulBroadcast';
import Mail from 'nodemailer/lib/mailer';

export async function sendMail(rawdata: Mail.Options) {

    await ombulBroadcast.sendSingleMail(rawdata);
}

export async function sendBulkMail(rawdata: Mail.Options[]) {

    await ombulBroadcast.sendBulkMail(rawdata);
}