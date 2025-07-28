import { formatDistanceToNow } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, onApply, hasApplied = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/jobs/${job.Id}`);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    onApply(job);
  };

  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    return "Competitive salary";
  };

  return (
    <Card hover className="p-6 cursor-pointer" onClick={handleCardClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <ApperIcon name="Building2" className="w-4 h-4 mr-1" />
            <span className="font-medium">{job.company}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            <span>{job.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {hasApplied ? (
            <Badge variant="success">Applied</Badge>
          ) : (
            <Button
              variant="accent"
              size="sm"
              onClick={handleApplyClick}
              icon="Send"
            >
              Quick Apply
            </Button>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="primary">{job.type}</Badge>
          <Badge variant="secondary">{job.industry}</Badge>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
          <span>{formatDistanceToNow(new Date(job.posted), { addSuffix: true })}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">
            {formatSalary(job.salary)}
          </span>
          <span className="text-xs text-gray-500">
            Click to view details
          </span>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;