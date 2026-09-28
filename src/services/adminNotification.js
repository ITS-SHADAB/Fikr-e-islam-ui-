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
 * Get Admin Notification Campaign History (with pagination)
 * GET /api/admin/notifications?page=1&limit=20
 * returns { success: true, count, total, page, limit, hasMore, data: [...] }
 */
export const getAdminNotificationCampaigns = async ({ page = 1, limit = 20 } = {}) => {
  const response = await API.get(`/admin/notifications?page=${page}&limit=${limit}`);
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

/**
 * Delete a Single Notification Campaign
 * DELETE /api/admin/notifications/:id
 */
export const deleteAdminNotificationCampaign = async (id) => {
  if (!id) return null;
  const response = await API.delete(`/admin/notifications/${id}`);
  return response.data;
};

/**
 * Bulk Delete Selected Notification Campaigns
 * DELETE /api/admin/notifications
 * body: { ids: ["id1", "id2", ...] }
 */
export const bulkDeleteAdminNotificationCampaigns = async (ids = []) => {
  const response = await API.delete("/admin/notifications", {
    data: { ids },
  });
  return response.data;
};

/**
 * Cleanup Old Notification Campaigns by Retention Period
 * DELETE /api/admin/notifications/cleanup
 * body: { olderThanDays: 30 | 60 | 90 | 180 | 365 }
 */
export const cleanupAdminNotificationHistory = async (olderThanDays = 90) => {
  const response = await API.delete("/admin/notifications/cleanup", {
    data: { olderThanDays },
  });
  return response.data;
};
