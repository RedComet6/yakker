const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const dateFormat = require("./../utils/dateFormat");

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            min_length: 1,
            max_length: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: (timestamp) => dateFormat(timestamp),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

// Create a virtual property reactionCount that counts number of friends
thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

// assigns Thought as a model
const Thought = model("thoughts", thoughtSchema);

module.exports = Thought;
