const pollResults = async (message) => {
        const { embeds } = message;

        const userMentionField = embeds[0].fields.find(field => field.name === 'poll_question_text');
        const parts = userMentionField?.value.split('|').map(part => part.trim());
  
        const userMentioned = `<@${parts[1]}>`;
  
        const channel = await message.client.channels.fetch(message.channelId);
  
        if (channel) {
          let finalResult = 0
          if (embeds[0].fields.length > 3) {
            finalResult = embeds[0].fields
              .map(result => {
                if(result.name === 'victor_answer_text'){
                  return result.value
                }
              })
          } else {
            finalResult = embeds[0].fields
              .map(result => {
                if(result.name === 'victor_answer_votes'){
                  return result.value
                }
              })
          }
          
          await channel.send(`The poll is finished. Results ${userMentioned}:\n${finalResult}`);
          
        } else {
          return console.error('Channel not found:', message.channelId);
        }
}

module.exports = { pollResults }