function formatPRMessage({ title, overview, testing, prUrl, requester }) {
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
${testing}
\`\`\`
  `;
}

module.exports = { formatPRMessage };
