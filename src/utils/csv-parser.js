/**
 * Parses a CSV string into an array of objects containing cron time and greeting message.
 *
 * @param {string} csvString - The CSV string where each entry is separated by semicolons (`;`) and contains `cronTime,greeting`.
 * @returns {Array<{cronTime: string, greeting: string}>} An array of objects, each containing `cronTime` and `greeting` properties.
 */
function csvParser(csvString) {
    return csvString.split(';').map(entry => {
        const [cronTime, greeting] = entry.split(',');
        return { cronTime, greeting };
    });
}

module.exports = csvParser;
