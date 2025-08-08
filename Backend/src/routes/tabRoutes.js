import express from "express";
import {
  // Contact Numbers Tab
  createContactNumbersTab,
  getAllContactNumbersTab,
  getContactNumbersTab,
  updateContactNumbersTab,
  
  // Complaints Tab
  createComplaintsTab,
  getComplaintsTab,
  updateComplaintsTab,
  
  // Quick Help Tab
  createQuickHelpTab,
  getQuickHelpTab,
  updateQuickHelpTab,
  
  // Overview Tab
  createOverviewTab,
  getOverviewTab,
  updateOverviewTab,
  
  // Video Guide Tab
  createVideoGuideTab,
  getVideoGuideTab,
  updateVideoGuideTab,
  
  // Generic Delete
  deleteTab
} from "../controllers/tabControllers.js";

const router = express.Router();

// ==================== CONTACT NUMBERS TAB ROUTES ====================
router.post("/contact-numbers", createContactNumbersTab);
router.get("/contact-numbers", getAllContactNumbersTab); // New route for getting all contact numbers
router.get("/contact-numbers/:id", getContactNumbersTab);
router.put("/contact-numbers/:id", updateContactNumbersTab);

// ==================== COMPLAINTS TAB ROUTES ====================
router.post("/complaints", createComplaintsTab);
router.get("/complaints/:id", getComplaintsTab);
router.put("/complaints/:id", updateComplaintsTab);

// ==================== QUICK HELP TAB ROUTES ====================
router.post("/quick-help", createQuickHelpTab);
router.get("/quick-help/:id", getQuickHelpTab);
router.put("/quick-help/:id", updateQuickHelpTab);

// ==================== OVERVIEW TAB ROUTES ====================
router.post("/overview", createOverviewTab);
router.get("/overview/:id", getOverviewTab);
router.put("/overview/:id", updateOverviewTab);

// ==================== VIDEO GUIDE TAB ROUTES ====================
router.post("/video-guide", createVideoGuideTab);
router.get("/video-guide/:id", getVideoGuideTab);
router.put("/video-guide/:id", updateVideoGuideTab);

// ==================== GENERIC DELETE ROUTE ====================
router.delete("/:tabType/:id", deleteTab);

export default router; 