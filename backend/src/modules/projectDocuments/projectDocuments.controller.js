import * as service from "./projectDocuments.service.js";

export const getDocuments = async (req, res) => {
  try {
    const docs = await service.listDocuments(
      req.params.projectId,
      req.user
    );
    res.json(docs);
  } catch (e) {
    res.status(403).json({ message: e.message });
  }
};

export const upload = async (req, res) => {
  try {
    const doc = await service.uploadDocument(
      req.body.projectId,
      req.file,
      req.user
    );
    res.status(201).json(doc);
  } catch (e) {
    res.status(403).json({ message: e.message });
  }
};
