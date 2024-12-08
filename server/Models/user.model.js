import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/.+@.+\..+/, "Please provide a valid email address"]
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [8, "Password must be at least 8 characters long"]
    },

    role: { 
      type: String, 
      enum: ["admin", "freelancer", "client"],
      default: "client"
    },

    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    },

    profile: {
      // For freelancers and clients
      bio: { type: String, trim: true },
      skills: [{ type: String, trim: true }],
      portfolio: [{ type: String, trim: true }], // Links to portfolio items
      avatar: {
        type: String,
        default:
          "https://i.pinimg.com/originals/be/61/a4/be61a49e03cb65e9c26d86b15e63e12a.jpg",
      }
    },
    
    refreshToken: {
      type: String,
    },

  },
  { timestamps: true }
);



// Exclude sensitive data from output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  return user;
};


// Middleware to set profile fields to null for admin
userSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.profile.bio = null;
    this.profile.skills = [];
    this.profile.portfolio = [];
  }
  next();
});


//Hashing the password before saving..
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});


//Checking password with the hash stored in the db.
userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

//Generate access token..
userSchema.methods.generateAccessToken = function () {
    const access_token = jwt.sign({
        _id: this._id,
        role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });

    return access_token;
}

//Generate Refresh Token..
userSchema.methods.generateRefreshToken = function () {
    const refresh_token = jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });

    return refresh_token;
}


//Export the User model
export const User = mongoose.model("User", userSchema);
