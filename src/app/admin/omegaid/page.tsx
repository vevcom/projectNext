"use server"

import { readOmegaIdPublicKey } from "@/actions/omegaid/read"
import OmegaIdContainer from "./container"



export default async function OmegaId() {

    const publicKey = await readOmegaIdPublicKey();

    return <OmegaIdContainer publicKey={publicKey} />
}