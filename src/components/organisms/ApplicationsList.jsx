import { useState, useEffect } from "react";
import ApplicationCard from "@/components/molecules/ApplicationCard";
import StatusPipeline from "@/components/molecules/StatusPipeline";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import applicationService from "@/services/api/applicationService";
import jobService from "@/services/api/jobService";

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [applicationsData, jobsData] = await Promise.all([
        applicationService.getAll(),
        jobService.getAll()
      ]);
      setApplications(applicationsData);
      setJobs(jobsData);
    } catch (err) {
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getJobById = (jobId) => {
    return jobs.find(job => job.Id === jobId);
  };

  const getStatusCounts = () => {
    const counts = {
      Applied: applications.filter(app => app.status === "Applied").length,
      Reviewing: applications.filter(app => app.status === "Reviewing").length,
      Interview: applications.filter(app => app.status === "Interview").length,
      Rejected: applications.filter(app => app.status === "Rejected").length
    };
    return counts;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (applications.length === 0) {
    return (
      <Empty
        title="No applications yet"
        description="Start applying to jobs to track your progress here."
        action={{
          label: "Browse Jobs",
          onClick: () => window.location.href = "/jobs",
          icon: "Search"
        }}
        icon="FileText"
      />
    );
  }

  const statusCounts = getStatusCounts();
  const sortedApplications = [...applications].sort((a, b) => 
    new Date(b.appliedDate) - new Date(a.appliedDate)
  );

  return (
    <div className="space-y-6">
      <StatusPipeline applications={applications} />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {count}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {status}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Your Applications ({applications.length})
        </h2>
        <div className="grid gap-4">
          {sortedApplications.map((application) => (
            <ApplicationCard
              key={application.Id}
              application={application}
              job={getJobById(application.jobId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsList;