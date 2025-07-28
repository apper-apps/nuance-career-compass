import { useState, useEffect } from "react";
import JobCard from "@/components/molecules/JobCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import jobService from "@/services/api/jobService";
import applicationService from "@/services/api/applicationService";
import resumeService from "@/services/api/resumeService";
import { toast } from "react-toastify";

const JobsList = ({ searchTerm = "", filters = {} }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await jobService.getAll();
      setJobs(data);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const data = await applicationService.getAll();
      setApplications(data);
    } catch (err) {
      console.error("Failed to load applications:", err);
    }
  };

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  const handleApply = async (job) => {
    try {
      const resumes = await resumeService.getAll();
      if (resumes.length === 0) {
        toast.error("Please upload a resume first");
        return;
      }

      const defaultResume = resumes.find(r => r.isDefault) || resumes[0];
      
      const applicationData = {
        jobId: job.Id,
        appliedDate: new Date().toISOString(),
        status: "Applied",
        resumeUsed: defaultResume.filename,
        notes: ""
      };

      await applicationService.create(applicationData);
      await loadApplications();
      
      toast.success(`Successfully applied to ${job.title}`);
    } catch (err) {
      toast.error("Failed to submit application");
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !filters.location || job.location === filters.location;
    const matchesIndustry = !filters.industry || job.industry === filters.industry;
    const matchesType = !filters.type || job.type === filters.type;
    
    return matchesSearch && matchesLocation && matchesIndustry && matchesType;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadJobs} />;
  if (filteredJobs.length === 0) {
    return (
      <Empty
        title="No jobs found"
        description="Try adjusting your search criteria or filters to find more opportunities."
        icon="Search"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
          </h2>
          <p className="text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {paginatedJobs.map((job) => (
          <JobCard
            key={job.Id}
            job={job}
            onApply={handleApply}
            hasApplied={hasApplied(job.Id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            icon="ChevronLeft"
          >
            Previous
          </Button>
          
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;
              
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={isCurrentPage ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            icon="ChevronRight"
            iconPosition="right"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobsList;