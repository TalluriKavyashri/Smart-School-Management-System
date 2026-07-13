import Notice from "../models/noticeModel.js";

// ➕ Add new notice
export const addNotice = async (req, res) => {
  try {
    const { title, message } = req.body;
    const notice = await Notice.create({
      title,
      message,
      postedBy: req.user?.name || "Admin",
    });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📜 Get all notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete notice
export const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
