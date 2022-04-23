const { ObjectId } = require("mongoose").Types;
const { Thought, User } = require("../models");

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then(async (thoughts) => {
                const userObj = {
                    thoughts,
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Get a single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select("-__v")
            .lean()
            .then(async (thought) => (!thought ? res.status(404).json({ message: "No thought with that ID" }) : res.json({ thought })))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // create a new thought
    createThought(req, res) {
        Thought.create({ thoughtText: req.body.thoughtText, username: req.body.username })
            .then((thought) => {
                console.log(thought._id.toString());
                User.findOneAndUpdate({ _id: req.body.userId }, { $addToSet: { thoughts: { _id: thought._id } } }, { runValidators: true, new: true });
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    },
    // Update a user
    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
            .then((thought) => (!thought ? res.status(404).json({ message: "No thought with this id!" }) : res.json(thought)))
            .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then(() => res.json("Successfully deleted a thought!"))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
};
