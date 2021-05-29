var readline = require("readline-sync");

class Console {

    static getString(message) {
        return readline.question(message + ": ")
    }

    static getPositiveNumber(message) {
        var text = null
        do {
            text = readline.question(message + ": ")

            if (!Console.isPositiveAndNumeric(text)) {
                console.log("Value is invalid, please type a positive number")
            }
        } while (!Console.isPositiveAndNumeric(text))
        return text;
    }

    static getPositiveNumberWithOptionalPrefix(message, optionalPrefix) {
        if (optionalPrefix == null) {
            return this.getPositiveNumber(message)
        } else {
            var text = null
            var inputOk = false;
            
            do {
                text = readline.question(message + ": ")

                if (text.startsWith(optionalPrefix)) {
                    var numericSubstring = text.substr(optionalPrefix.length)
                    if (!Console.isPositiveAndNumeric(numericSubstring)) {
                        console.log("Value is invalid, please type a positive number after the prefix '" + optionalPrefix + "'")
                    } else {
                        inputOk = true;
                    }
                } else {
                   if (!Console.isPositiveAndNumeric(text)) {
                        console.log("Value is invalid, please type a positive number")
                    } else {
                        inputOk = true;
                    }
                }
            } while (!inputOk)
            
            return text;
        }
        
    }

    static getBoolean(message, defaultTrue) {
        if (defaultTrue) {
            var response = readline.question(message + " (Y/n)? ")
            return response === "n" || response === "N"
        } else {
            var response = readline.question(message + " (y/N)? ")
            return response === "y" || response === "Y"
        }
    }

    static isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    static isPositiveAndNumeric(value) {
            return /^\d+$/.test(value);
    }

    static getDate(message) {
        var done = false
        var date = null;
        
        do {
            date = this.getString(message)
            date = date.trim()
            
            if (date != "" && date.match(/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
                done = true
            } else if (date != "") {
                console.log("Not a valid ISO8601 UTC date, eg, 2030-12-31T23:59:59Z, please try again")
            } else {
                // empty string
                done = true
                date = null
            }
        } while (!done)
        
        return date
    }
}

module.exports = Console;