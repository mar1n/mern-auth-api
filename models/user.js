const mongoose = require("mongoose");
const crypto = require("crypto");

// user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      require: true,
      lowercase: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      require: true,
      max: 32,
    },
    salt: String,
    role: {
      type: String,
      default: "subscriber",
    },
    resetPasswordLink: {
      data: String,
      default: "subscriber",
    },
  },
  { timestamps: true }
);

// virtual
userSchema.virtual('password')
.set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password;
})

// methods
userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if(!password) return ''
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
        } catch(err) {
            return ''
        }
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
}

module.exports = mongoose.model('User', userSchema);