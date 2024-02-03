import read from "@/actions/images/read";
import BackdropImage from "@/components/BackdropImage/BackdropImage";
import { notDeepEqual } from "assert";

export default async function committees() {
    const im = await read("logo_simple")
    if (!im.success) {
        throw Error("):")
    }
    return (
        <div>
            <h1>jkhkjh</h1>
            {
 //            <BackdropImage>jfjfjfjfjfjj</BackdropImage> 
            }
            <BackdropImage image={im.data}>meow</BackdropImage>
        </div>
    );
}
