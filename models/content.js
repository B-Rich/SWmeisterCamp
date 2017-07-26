var mongoose  =require("mongoose");

var boardSchema = mongoose.Schema({
    title: String,
    spec: String,
    workstyle: String,
    date: {type: Date, default: Date.now},
    writer: String
});
var contents =  mongoose.model('BoardContents', boardSchema);

module.exports = contents;