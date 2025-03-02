import Worker from "./workers.model.js";

const convertIdsToObjectId = async () => {
    try {
      const workers = await Worker.find();
  
      for (const worker of workers) {
        worker.contractor_id = new mongoose.Types.ObjectId(worker.contractor_id);
        worker.project_id = new mongoose.Types.ObjectId(worker.project_id);
        await worker.save();
      }
  
      console.log("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  
  convertIdsToObjectId();
// إنشاء عامل جديد
export const createWorker = async (req, res, next) => {
  try {
    const { name, contractor_id, project_id, contact_info, job_title, nationality } = req.body;

    const newWorker = new Worker({
      name,
      contractor_id,
      project_id,
      contact_info,
      job_title,
      nationality,
    });

    await newWorker.save();
    res.status(201).json({ message: "Worker created successfully", worker: newWorker });
  } catch (error) {
    next(error);
  }
};

// تحديث بيانات عامل
export const updateWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const worker = await Worker.findByIdAndUpdate(id, updatedData, { new: true });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ message: "Worker updated successfully", worker });
  } catch (error) {
    next(error);
  }
};

// حذف عامل
export const deleteWorker = async (req, res, next) => {
  try {
    const { id } = req.params;

    const worker = await Worker.findByIdAndDelete(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// جلب جميع العمال
export const getWorkers = async (req, res, next) => {
    try {
      const workers = await Worker.find().populate("contractor_id project_id");
      res.status(200).json(workers);
    } catch (error) {
      next(error);
    }
  };

// جلب عامل بواسطة ID
export const getWorkerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const worker = await Worker.findById(id).populate("contractor_id project_id");
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json(worker);
  } catch (error) {
    next(error);
  }
};