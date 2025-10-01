import Vote from "../models/Vote.js";

// Cast a vote
export const castVote = async (req, res) => {
  try {
    const { name, age, gender, place, candidate } = req.body;

    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const existing = await Vote.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: "You have already voted." });

    const vote = new Vote({
      user: req.user._id,
      name,
      age,
      gender,
      place,
      candidate,
    });

    await vote.save();
    res.status(201).json({ message: "Vote cast successfully!", vote });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error casting vote", error: err.message });
  }
};

// Dashboard stats
export const getStats = async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();

    const genderStats = await Vote.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]);

    const candidateStats = await Vote.aggregate([
      { $group: { _id: "$candidate", count: { $sum: 1 } } },
    ]);

    let majority = null;
    if (candidateStats.length > 0) {
      majority = candidateStats.reduce((prev, curr) =>
        curr.count > prev.count ? curr : prev
      );
    }

    res.json({
      totalVotes,
      genderStats,
      candidateStats,
      majority,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
};
