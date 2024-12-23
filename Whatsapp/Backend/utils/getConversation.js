const ConversationModel = require("../models/conversationModel");

const getConversation = async (userId) => {
  if (userId) {
    const userConversation = await ConversationModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("messages")
      .populate("sender")
      .populate("receiver")
      .sort({ updatedAt: -1 });

    const conversation = userConversation?.map((conv) => {
      const countUnseenMessage = conv.messages.reduce((prev, message) => {
        const messageByUserId = message?.messageByUser?.toString();

        if (messageByUserId !== userId) {
          return prev + (message?.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);

      return {
        _id: conversation?._id,
        sender: conversation?.sender,
        receiver: conversation?.receiver,
        unseenMessage: countUnseenMessage,
      };
    });

    return conversation;
  }
  else {
    return [];
  }
};

module.exports = getConversation;
