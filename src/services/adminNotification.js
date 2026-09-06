import API from "./api";

/**
 * Send Admin Notification Campaign
 * POST /api/admin/notifications/send
 * payload: { audience, recipient, title, message, type, data }
 */
export const sendAdminNotification = async (payload) => {
  const response = await API.post("/admin/notifications/send", payload);
  return response.data;
};

/**
 * Get Overall Admin Notification Statistics
 * GET /api/admin/notifications/stats
 * returns { success: true, data: { totalCampaigns, totalRecipients, totalSent, totalFailed, totalRead, totalPending, readRate } }
 */
export const getAdminNotificationStats = async () => {
  const response = await API.get("/admin/notifications/stats");
  return response.data;
};

/**
 * Get Admin Notification Campaign History
 * GET /api/admin/notifications
 * returns { success: true, count, data: [...] }
 */
export const getAdminNotificationCampaigns = async () => {
  const response = await API.get("/admin/notifications");
  return response.data;
};

// Backward-compatible alias
export const getAdminNotificationHistory = getAdminNotificationCampaigns;

/**
 * Get Admin Notification Campaign Details by ID
 * GET /api/admin/notifications/:id
 * returns { success: true, data: { ...campaign, readRate } }
 */
export const getAdminNotificationCampaign = async (id) => {
  if (!id) return null;
  const response = await API.get(`/admin/notifications/${id}`);
  return response.data;
};

// Backward-compatible alias
export const getAdminNotificationDetails = getAdminNotificationCampaign;
