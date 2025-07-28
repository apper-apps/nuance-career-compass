import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import jobService from "@/services/api/jobService";
import applicationService from "@/services/api/applicationService";
import resumeService from "@/services/api/resumeService";
import { toast } from "react-toastify";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [jobData, applicationsData] = await Promise.all([
        jobService.getById(parseInt(jobId)),
        applicationService.getAll()
      ]);
      
      setJob(jobData);
      setHasApplied(applicationsData.some(app => app.jobId === parseInt(jobId)));
    } catch (err) {
      setError("Failed to load job details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const handleApply = async () => {
    try {
      setApplying(true);
      
      const resumes = await resumeService.getAll();
      if (resumes.length === 0) {
        toast.error("Please upload a resume first");
        navigate("/profile");
        return;
      }

      const defaultResume = resumes.find(r => r.isDefault) || resumes[0];
      
      const applicationData = {
        jobId: parseInt(jobId),
        appliedDate: new Date().toISOString(),
        status: "Applied",
        resumeUsed: defaultResume.filename,
        notes: ""
      };

      await applicationService.create(applicationData);
      setHasApplied(true);
      
      toast.success(`Successfully applied to ${job.title}`);
    } catch (err) {
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    return "Competitive salary";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadJob} />;
  if (!job) return <Error message="Job not found" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/jobs")}
        icon="ArrowLeft"
        className="mb-4"
      >
        Back to Jobs
      </Button>

      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <div className="flex items-center text-gray-600 mb-2">
              <ApperIcon name="Building2" className="w-5 h-5 mr-2" />
              <span className="text-xl font-medium">{job.company}</span>
            </div>
            <div className="flex items-center text-gray-500 mb-4">
              <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
              <span className="text-lg">{job.location}</span>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <Badge variant="primary" className="text-sm">{job.type}</Badge>
              <Badge variant="secondary" className="text-sm">{job.industry}</Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {formatSalary(job.salary)}
            </div>
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
              <span>Posted {formatDistanceToNow(new Date(job.posted), { addSuffix: true })}</span>
            </div>
            {hasApplied ? (
              <Badge variant="success" className="text-sm">
                <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
                Applied
              </Badge>
            ) : (
              <Button
                variant="accent"
                size="lg"
                onClick={handleApply}
                loading={applying}
                icon="Send"
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <ApperIcon name="CheckCircle" className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <ApperIcon name="Building2" className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Company</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <ApperIcon name="MapPin" className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Location</h3>
              <p className="text-sm text-gray-600">{job.location}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <ApperIcon name="Briefcase" className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Job Type</h3>
              <p className="text-sm text-gray-600">{job.type}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobDetails;