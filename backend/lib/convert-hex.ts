export function convertTo24CharHex(s: String) {
    var result = '';
    for (var i = 0; i < s.length; i++) {
        result += s.charCodeAt(i).toString(16).padStart(2, '0');
    }
    if (result.length < 0) {
        result = result.padEnd(24, '0');
    }
    return result.substring(0, Math.min(result.length, 24));
}