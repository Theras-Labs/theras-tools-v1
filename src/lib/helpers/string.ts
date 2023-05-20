export function shortenString(str, maxLength = 120) {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.substr(0, maxLength - 3) + "...";
  }
}
