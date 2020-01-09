const fs = require("fs");
const utils = require("loader-utils");
const path = require("path");
const jsonc = require("jsonc-parser");


module.exports = function json2ClassKeys(source) {
    const query = utils.getOptions(this) || {};
    const config = {
        className: "LocalizationKeys",
        output: "./LocalizationKeys.ts"
    };

    Object.keys(query).forEach((attr) => {
        config[attr] = query[attr];
    });
    let json = source;
    if (typeof source === "string") {
        try {
            json = jsonc.parse(json);
        } catch (error) {
            console.error(error);
            return JSON.stringify({});
        }
    };
    var result = `export default class ${config.className}`;
    var getSpaces = function (depth) {
        var result = "\n";
        while (depth > 0) {
            result += "    ";
            depth--;
        }
        return result;
    }

    var iteratee = function (obj, result, objPath, depth) {
        var spaces = getSpaces(depth);
        var bracketsSpaces = getSpaces(depth - 1);
        result += bracketsSpaces + "{";
        if (objPath) {
            result += spaces + "AllKeys" + ': "' + objPath.replace(/\.$/gi, "") + '",';
        }
        for (var objKey in obj) {
            if (!obj.hasOwnProperty(objKey)) continue;
            if (obj[objKey] != null && typeof obj[objKey] === "object") {
                if (objPath) {
                    result += iteratee(obj[objKey], spaces + "" + objKey + ": ", objPath + objKey + ".", depth + 1);
                } else {
                    result += iteratee(obj[objKey], spaces + "public static " + objKey + " = ", objPath + objKey + ".", depth + 1);
                }
            } else if (objPath) {
                result += spaces + objKey + ': "' + objPath + objKey + '",';
            } else {
                result += spaces + objKey + '= "' + objPath + objKey + '";';
            }
        }
        result += bracketsSpaces + "}";
        if (objPath && depth > 2) {
            result += ",";
        }
        return result;
    }

    result = iteratee(json, result, "", 1);

    let filepath = path.resolve(
        path.join(this.context, config.output)
    );

    fs.writeFileSync(filepath, result);

    console.log("Localization keys have been extracted");
    return JSON.stringify(json);
}