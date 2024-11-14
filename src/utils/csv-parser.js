function csvParser(csvString) {
    return csvString.split(';').map(entry => {
        const [cronTime, greeting] = entry.split(',');
        return { cronTime, greeting };
    });
}

module.exports = csvParser;