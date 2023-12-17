/**
 * Function to convert number in base 10 to base 26 defined by alphabet characters
 * @param num column id in database for the CellModel
 * @returns column number represented by capital letters
 */
export function intToNumColChars(num) {
    let rest = -1;
    let str = '';   
    while (num !== 0) {
        num--;
        rest = num % 26; 
        num = Math.floor(num / 26);
        let char = String.fromCharCode(rest + 65);
        str = char + str;
    }
    return str;
}

/**
 * Function to convert number in base 26 defined by alphabet characters to base 10
 * @param str column number represented by capital letters
 * @returns column id in database for the CellModel
 */
export function numColCharsToInt(str) {
    let res = 0;
    let decimal = 0;
    for (let i = 0; i < str.length; i++) {
        decimal = str.charCodeAt(i) - 64;
        res += decimal * Math.pow(26, Math.abs(i + 1 - str.length));
    }
    return res;
}

const regexCapitalAlpha = new RegExp('^[A-Z]+$');

/**
 * Verifies if a string contains only capital letter
 * @param str String verified.
 * @returns If a string contains only capital letter or not.
 */
export function isCapitalWord(str) {
    return regexCapitalAlpha.test(str);
}