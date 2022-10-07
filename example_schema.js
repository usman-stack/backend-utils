const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    authorName: { type: String },
    category: {
      type: String,
      enum: [
        "Nutrition",
        "Recipies",
        "Workouts",
        "Reviews",
        "Podcasts",
        "Music",
        "News",
      ],
    },
    featuredImageOne: { type: String, default: "" },
    featuredImageTwo: { type: String, default: "" },
    authorImage: { type: String, default: "" },
    videoLink: { type: String, default: "" },
    details: { type: String, default: "" },
    active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

const Blog = mongoose.model("Blogs", blogSchema);

module.exports = Blog;
