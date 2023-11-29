var mongoose= require('mongoose');

var schema = mongoose.Schema;

var postSchema = new schema({
    title:{type: String, require :true},
    body:{type: String, require:true},
    createDate:{type:Date, default:Date.now}
})

var userSchema = new schema({
    email:{type: String, require:true},
    pwd:{type: String, require:true},
    createDate:{type:Date, default:Date.now}
})

var post = mongoose.model('post', postSchema, 'post');
var user = mongoose.model('user', userSchema, 'user');

var exportSchema = {'post': post, 'user': user};

module.exports = exportSchema;