import TechnicianLayout from "@/components/TechnicianLayout";

const ServiceRequests = () => {
  return (
    <TechnicianLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Service Requests</h1>
        <p>
          Here you can view and manage all your service requests, including new
          requests, ongoing requests, and completed requests.
        </p>
        {/* Add components to display and manage service requests here */}
      </div>
    </TechnicianLayout>
  );
};

export default ServiceRequests;
