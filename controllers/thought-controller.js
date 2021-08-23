const { User, Thought } = require('../models');

const thoughtController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then(dbThoughtData => {
        // If no thought is found, json error
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData)
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Create thought
  createThought({ body }, res) {
    Thought.create(body)
      .then(({userID, _id}) => {
        return User.findOneAndUpdate(
          { _id: userID },
          { $push: { thoughts: _id } },
          { new: true }
        )
      })
      .then(dbThoughtData => {
        // If no thought is found, json error
        if (!dbThoughtData) {
            res.status(404).json({ message: 'Thought created but no user found with this id' });
            return;
        }
        res.json({ message: 'Thought created'});
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // update thought by useer ID
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No though found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
  },

  // delete Thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(dbThoughtData => {
        // If no thought is found, json error
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
          res.json(dbThoughtData)
      })
      .catch(err => res.json(err));
  },

  // Reaction Methods
  // add reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId }, 
      { $push: { reactions: body} },
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }      
        res.json(dbThoughtData)
      })
      .catch(err => res.json(err));
  },

  // delete reaction
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: {reactions: { reactions: params.reactionID} } }, 
      { new: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }      
        res.json(dbThoughtData)
      })
      .catch(err => res.json(err));
  }
};  

module.exports = thoughtController;
