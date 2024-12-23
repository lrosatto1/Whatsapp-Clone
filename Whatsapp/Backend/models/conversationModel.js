const { Schema, model } = require("mongoose");

const conversationSchema = new Schema(
  {
    sender: {
      type: Schema.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.ObjectId,
      ref: "User",
    },
    messages: [
      {
        type: Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Conversation", conversationSchema);
