import api from "@/lib/api";

/* ================================
   PENDING JOBS
================================ */

export const getPendingJobs = async () => {


  const res = await api.get("/technician/pending");


  return res.data;
};

/* ================================
   JOB DETAIL
================================ */

export const getJobDetail = async (orderId: number) => {
  const res = await api.get(`/technician/job/${orderId}`);
  return res.data;
};

/* ================================
   COMPLETE JOB
================================ */

export const completeJob = async (orderId: number) => {
  const res = await api.patch(`/technician/complete/${orderId}`);
  return res.data;
};

/* ================================
   IN PROGRESS JOBS
================================ */

export const getInProgressJobs = async () => {
  const res = await api.get("/technician/in-progress");
  return res.data;
};

/* ================================
   HISTORY
================================ */

export const getHistoryJobs = async () => {
  const res = await api.get("/technician/history");
  return res.data;
};

/* ================================
   COUNTERS
================================ */

export const getTechnicianCounters = async () => {
  const res = await api.get("/technician/counters");
  return res.data;
};