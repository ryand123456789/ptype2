var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountData = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true 
        },
        health: {
            type: Number,
            required: true
        },
        damage: { 
            type: Number,
            required: true
        },
        speed: {
            type: Number,
            required: true
        },
        levels_unlocked: {
            type: Number,
            required: true            
        },
        current_skin: {
            type: String,
            required: true
        },
        playerId: {
            type: Number
        },
        itemIDs:
        {
            type: [Number],
            default: []
        },
        currencyAmount:
        {
            type: Number
        }

    },{timestamps: true}
)

var Account = mongoose.model('Account', accountData);
module.exports = Account;