import TechnicianLayout from "@/components/TechnicianLayout";
const History = () => {
  return (
    <TechnicianLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">History</h1>
        <p>
          Here you can view your past activities, completed tasks, and any other
          relevant history related to your work as a technician.
        </p>
        {/* Add components to display history data here */}
      </div>
    </TechnicianLayout>
  );
};

export default History;
