const fs = require('fs');
const path = require('path');
const { translateLanguage } = require('../languages/index');

function getGitHubIssueURL(errorMessage) {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const issueBaseUrl = packageJson.bugs?.url.replace(/\/choose$/, '');
    if (!issueBaseUrl) {
      console.warn(translateLanguage('githubIssue.warning'));
      return null;
    }

    const issueUrl = `${issueBaseUrl}?title=${encodeURIComponent('Error report')}&body=${encodeURIComponent(errorMessage)}`;

    return issueUrl;
  } catch (err) {
    console.error(translateLanguage('githubIssue.error'), err);
    return null;
  }
}

module.exports = { getGitHubIssueURL };
