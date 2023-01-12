// Encryption : E[x] = x + n % m
function encrypt(text, s) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char.toUpperCase(text[i])) {
      let ch = String.fromCharCode(
        ((char.charCodeAt(0) + shift - 65) % 26) + 65
      );
      result += ch;
    } else {
      let ch = String.fromCharCode(
        ((char.charCodeAt(0) + shift - 97) % 26) + 97
      );
      result += ch;
    }
  }
  return result;
}

let text = "ATTACKATONCE";

let shift = 4;
console.log("Text  : " + text);
console.log("Shift : " + shift);
console.log("Cipher: " + encrypt(text, shift));
