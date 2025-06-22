const formatConversation = (conversation) => {
  return conversation.map((entry, index) =>
      `Q${index + 1}: ${entry.question}\nA${index + 1}: ${entry.answer}\nResponse Time: ${entry.responseTime}`
    ).join('\n');   
};
module.exports = formatConversation;
