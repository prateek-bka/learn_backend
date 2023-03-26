const express = require("express");
const { NoteModel } = require("../model/note.model");
const noteRouter = express.Router();
const jwt = require("jsonwebtoken");

noteRouter.get("/", async (req, res) => {
  // const token=req.headers.authorization.split(" ")[1]

  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  try {
    // If find all notes then find()
    // const notes = await NoteModel.find();

    //Finding specific user notes only
    if (decoded) {
      const notes = await NoteModel.find({ userID: decoded.userID });
      res.status(200).send(notes);
    } else {
      res.status(400).send({ msg: "No note has been created by this user" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

noteRouter.post("/add", async (req, res) => {
  try {
    const new_note = new NoteModel(req.body);
    await new_note.save();
    res.status(200).send({ msg: "A new note has been added" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

noteRouter.patch("/update/:noteID", async (req, res) => {
  const payload = req.body;
  const noteID = req.params.noteID;
  try {
    await NoteModel.findByIdAndUpdate({ _id: noteID }, payload);
    res.status(200).send({ msg: "Note has been updated" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

noteRouter.delete("/delete/:noteID", async (req, res) => {
  // const token=req.headers.authorization.split(" ")[1]
  const decoded = jwt.verify(token, "masai");
  const req_id = decoded.userID;
  const note_check = NoteModel.findOne({ _id: noteID });
  const userID_in_note = note_check.userID;

  const noteID = req.params.noteID;
  try {
    if (req_id === userID_in_note) {
      await NoteModel.findByIdAndDelete({ _id: noteID });
      res.status(200).send({ msg: "Note has been deleted" });
    } else {
      res.status(400).send({ msg: "Not authorized" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = { noteRouter };
