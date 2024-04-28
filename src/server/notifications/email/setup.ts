import 'server-only'
import nodemailer from "nodemailer"
import { TRANSPORT_OPTIONS } from './ConfigVars';
import SMTPPool from 'nodemailer/lib/smtp-pool';

let transporterCache: nodemailer.Transporter<SMTPPool.SentMessageInfo> | null = null;
let resolveTransporter: (value?: unknown) => void = () => {};
const waitForTransporter = new Promise((resolve) => resolveTransporter = resolve);

let testAccountCache: nodemailer.TestAccount | null = null;

// Test account for development
export async function getTestAccount(): Promise<nodemailer.TestAccount> {
    if (process.env.NODE_ENV === "production") throw new Error("This function should only be called in development")

    if (testAccountCache) {
        return testAccountCache
    }

    await waitForTransporter

    if (!testAccountCache) {
        throw new Error("The test account should exists by now. Something unexpected happend")
    }

    return testAccountCache
}

// Transporter setup
export async function getTransporter(firsttime?: boolean): Promise<nodemailer.Transporter<SMTPPool.SentMessageInfo>> {
    
    if (transporterCache) {
        return transporterCache
    }

    
    if (process.env.NODE_ENV === "production") {
        transporterCache = nodemailer.createTransport(TRANSPORT_OPTIONS)
        return transporterCache;
    }
    
    // Otherwise use ethereal
    if (!firsttime) {
        await waitForTransporter
        if (!transporterCache) {
            throw new Error("Transporter is not set, and it should be by now")
        }
        return transporterCache
    }

    testAccountCache = await nodemailer.createTestAccount()

    transporterCache =  nodemailer.createTransport({
        pool: true,
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccountCache.user, // generated ethereal user
            pass: testAccountCache.pass  // generated ethereal password
        }
    })

    console.log("Email setup in development mode. Test account details")
    console.log(testAccountCache)

    resolveTransporter();

    return transporterCache
}

getTransporter(true);