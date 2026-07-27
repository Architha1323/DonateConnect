const fs = require('fs');
const data = JSON.parse(fs.readFileSync('lint.json', 'utf8'));
const errors = [];
data.forEach(file => {
  file.messages.forEach(msg => {
    // Only capture errors (severity === 2) and skip the 'any' ones to focus on others first
    // Actually, capture all to see them
    if (msg.severity === 2) {
      errors.push({
        file: file.filePath.split('donateconnect')[1] || file.filePath,
        line: msg.line,
        ruleId: msg.ruleId,
        message: msg.message
      });
    }
  });
});
console.log(JSON.stringify(errors, null, 2));
