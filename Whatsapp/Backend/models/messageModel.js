const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoURL: {
      type: String,
      default: "",
    },
    audio: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    messageByUser: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Message", messageSchema);
