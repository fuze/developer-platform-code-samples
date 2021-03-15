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
}

module.exports = Console;