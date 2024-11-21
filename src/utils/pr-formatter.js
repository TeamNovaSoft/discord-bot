function formatPRMessage({ title, overview, howToTest, prUrl, requester }) {
  return `
**🔍 New PR Review Request**

**Author:** ${requester.toString()}  

**🔗 PR URL**  
\`\`\`
${prUrl}
\`\`\`

**📝 Title**  
\`\`\`
${title}
\`\`\`

**📋 Description**

\`\`\`md
# Overview  
${overview}

## How to test  
${howToTest}
\`\`\`
  `;
}

module.exports = { formatPRMessage };
