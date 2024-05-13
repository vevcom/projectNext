"use server"

import { generateOmegaIdAction } from "@/actions/omegaid/generate"
import OmegaIdElement from "./OmegaIdElement";



export default async function OmegaId() {

    const results = await generateOmegaIdAction();

    if (!results.success) {
        return <p>Failed to load OmegaId</p>
    }

    return <OmegaIdElement token={results.data} />
}