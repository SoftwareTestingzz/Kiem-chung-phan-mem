const fs = require('fs');

try {
    const raw = fs.readFileSync('jest_out.json', 'utf8');
    // Sometimes jest outputs warnings before the JSON structure. Find the first '{'
    const jsonStart = raw.indexOf('{');
    const data = JSON.parse(raw.substring(jsonStart));
    
    let report = '';
    data.testResults.forEach(ts => {
        if (ts.status === 'failed') {
            const relPath = ts.name.replace(__dirname, '');
            report += `\n=== Suite: ${relPath} ===\n`;
            ts.assertionResults.forEach(ast => {
                if (ast.status === 'failed') {
                    report += `\nx TEST: ${ast.title}\n`;
                    ast.failureMessages.forEach(msg => {
                        // Print the first few lines of the error message to avoid clutter
                        const excerpt = msg.split('\n').filter(l => l.trim()).slice(0, 3).join('\n');
                        report += `ERROR: ${excerpt}\n`;
                    });
                }
            });
        }
    });
    
    fs.writeFileSync('jest_errors_summary.txt', report, 'utf8');
    console.log('Summary created in jest_errors_summary.txt');
} catch(e) {
    console.error('Error parsing JSON:', e);
}
