import Project from "./project.model.js";


export const createHandler = async (req, res, next) => {
  try {
    const {
      name,
      project_number,
      start_date,
      end_date,
      location,
      assigned_location,
      company_id,
      contractor_id,
      status, // إضافة حالة المشروع
    } = req.body;

    // إنشاء المشروع
    const newProject = new Project({
      name,
      project_number,
      start_date,
      end_date,
      location,
      assigned_location,
      company_id,
      contractor_id,
      status, // إضافة حالة المشروع
    });

    await newProject.save();
    res.json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    next(error);
  }
};
// تعديل مشروع
export const updateHandler = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    next(error);
  }
};

// حذف مشروع
export const deleteHandler = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// جلب جميع المشاريع
export const getHandler = async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    next(error);
  }
};
