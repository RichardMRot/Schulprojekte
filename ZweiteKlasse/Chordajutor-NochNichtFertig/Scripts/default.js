let major_scales = ["A", "B", "H", "C", "Db", "D", "Db", "E", "F", "Fb", "G", "Ab"];
let minor_scales = ["a", "a#", "h", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"];

let chord_regex = /^([A-Ha-h])([#b]?)(M|m|dim|aug|°|\+|sus2|sus4|sus)?([6-9]|11|13|add2|add4|add9|7b5|7#9)?$/;



//https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-specific-index-in-javascript
String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}