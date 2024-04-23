"use server"

import { RedirectType, redirect } from 'next/navigation'

export default async function() {
    await redirect("./", RedirectType.replace);
}