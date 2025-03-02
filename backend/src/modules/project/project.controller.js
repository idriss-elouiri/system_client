import Project from "./project.model.js";
  import mongoose from "mongoose";

  
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
        status,
      } = req.body;
  
      // تحويل company_id و contractor_id إلى ObjectId إذا كانت صالحة
      const companyObjectId = mongoose.Types.ObjectId.isValid(company_id)
        ? new mongoose.Types.ObjectId(company_id)
        : null;
  
      const contractorObjectId = mongoose.Types.ObjectId.isValid(contractor_id)
        ? new mongoose.Types.ObjectId(contractor_id)
        : null;
  
      if (!companyObjectId) {
        return res.status(400).json({ message: "Invalid company_id format" });
      }
      if (!contractorObjectId) {
        return res.status(400).json({ message: "Invalid contractor_id format" });
      }
  
      // إنشاء المشروع
      const newProject = new Project({
        name,
        project_number,
        start_date,
        end_date,
        location,
        assigned_location,
        company_id: companyObjectId,
        contractor_id: contractorObjectId,
        status,
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
