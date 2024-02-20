import type { User } from "@prisma/client";

export function parseToFormData(rawdata : FormData | User) : FormData {
    if (rawdata instanceof FormData) {
        return rawdata;
    }

    const ret = new FormData();

    const keys = Object.keys(rawdata)
    for (let i = 0; i < keys.length; i++) {
        ret.append(keys[i], String(rawdata[keys[i] as keyof typeof rawdata]));
    }

    return ret;
}