const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Article = require('./../models/articles');

const NoteSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now,
        required: true
    }
});

NoteSchema.statics.deleteWithReferences = function(id, callback) {
    Article.update({}, {$pull: {notes: id}}, {multi: true})
    .then(updated => {
        Note.remove({_id: id})
        .then(deleted => {
            callback(deleted);
        })
        .catch(error => {
            callback(error);
        });
    })
    .catch(error => {
        callback(error);
    });
}

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;