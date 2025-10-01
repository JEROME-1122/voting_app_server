import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    place: { type: String, required: true },
    candidate: { type: String, required: true },
    voterId: { type: String, unique: true },
  },
  { timestamps: true }
);

// auto-generate voterId
voteSchema.pre("save", function (next) {
  if (!this.voterId) {
    this.voterId = "VOTE-" + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

export default mongoose.model("Vote", voteSchema);
