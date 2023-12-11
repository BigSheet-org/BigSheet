class Functions {
    /**
     * Function to convert number in base 10 to base 26 defined by alphabet characters
     * @param num 
     * @returns 
     */
    static intToNumColChars(num) {
        let rest = -1;
        let str = '';       
        while (num != 0) {
            num--;
            rest = num%26; 
            num = Math.floor(num/26);
            let char = String.fromCharCode(rest+65);
            str = char+str;
        }
        return str;
    }

    /**
     * Reciprocal function to intToNumColChars
     * @param str 
     * @returns 
     */
    static numColCharsToInt(str) {
        let res = 0;
        let decimal = 0;
        for (let i = 0; i < str.length; i++) {
            decimal = str.charCodeAt(i)-64;
            res += decimal*Math.pow(26, Math.abs(i+1-str.length));
        }
        return res;
    }
}

export default Functions;