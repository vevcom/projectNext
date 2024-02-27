import type { StoreLocations } from "./StoreLocations";

/**
 * @param destination what part of the store to delete from
 * @param fsLocation the location of the file in the store to delete
 * @returns void function that deletes the file from the store throws error 
 * if file does not exist
 */
export default async function deleteFile(destination: StoreLocations, fsLocation: string) {
    // TODO: implement this and delete images from the store
}