function formatSendMessage({ title, description, userName }) {
  return `
    # ${title}

    ${description}

    > Anuncio: ${userName}
    `;
}

module.exports = { formatSendMessage };
