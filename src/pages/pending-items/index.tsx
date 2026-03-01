import TechnicianLayout from "@/components/TechnicianLayout";
import React from "react";

const PendingItems = () => {
  return (
    <TechnicianLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Pending Items</h1>
        <p>
          Here you can view and manage all your pending tasks, appointments, or
          any other items that require your attention as a technician.
        </p>
        {/* Add components to display and manage pending items here */}
      </div>
    </TechnicianLayout>
  );
};

export default PendingItems;
