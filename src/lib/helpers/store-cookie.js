import Cookies from "js-cookie";
import { parse } from "cookie";

export function setLargeCookie(key, data) {
  const MAX_COOKIE_SIZE = 4000; // maximum size of a cookie in bytes
  const dataSize = JSON.stringify(data).length;
  const numChunks = Math.ceil(dataSize / MAX_COOKIE_SIZE);

  // Remove non-Latin1 characters
  const dataString = JSON.stringify(data).replace(/[^\x00-\xFF]/g, "");

  const dataEncoded = btoa(dataString);

  for (let i = 0; i < numChunks; i++) {
    const chunkData = dataEncoded.slice(
      i * MAX_COOKIE_SIZE,
      (i + 1) * MAX_COOKIE_SIZE
    );
    Cookies.set(`${key}_chunk${i}`, chunkData);
  }

  Cookies.set(`${key}_numChunks`, numChunks);
}
// export function getLargeCookie(key) {
//   const numChunks = Cookies.get(`${key}_numChunks`);
//   if (!numChunks) {
//     return undefined;
//   }

//   let dataEncoded = "";

//   for (let i = 0; i < numChunks; i++) {
//     const chunkData = Cookies.get(`${key}_chunk${i}`);
//     if (!chunkData) {
//       return undefined;
//     }
//     dataEncoded += chunkData;
//   }

//   const dataString = atob(dataEncoded);
//   const data = JSON.parse(dataString);

//   return data;
// }

export function getServerLargeCookie(key, cookieHeader) {
  const cookies = parse(cookieHeader || "");
  const numChunks = cookies[`${key}_numChunks`];
  if (!numChunks) {
    return undefined;
  }

  let dataEncoded = "";
  for (let i = 0; i < numChunks; i++) {
    const chunkData = cookies[`${key}_chunk${i}`];
    if (!chunkData) {
      return undefined;
    }
    dataEncoded += chunkData;
  }

  const dataString = atob(dataEncoded);
  const data = JSON.parse(dataString);

  return data;
}
