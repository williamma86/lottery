class Utils {
    constructor() {

    }

    init() {

    }

    // upper case the first letter of a given string
    captitalize(string) {
        return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    }

    formatPhone(phoneNumber) {
        let raw = phoneNumber.replace(/[\(\)\-\s]/gi, '');
        if (raw.length < 3) return "";
        return `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
    }

    padLeft(value, length = 7) {
        var str = "" + value;
        var pad = "0".repeat(length);
        return pad.substring(0, pad.length - str.length) + str;
    }
}