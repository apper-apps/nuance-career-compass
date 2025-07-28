import ApplicationsList from "@/components/organisms/ApplicationsList";

const Applications = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text font-display mb-4">
          Your Applications
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your job application progress and stay organized
        </p>
      </div>

      <ApplicationsList />
    </div>
  );
};

export default Applications;