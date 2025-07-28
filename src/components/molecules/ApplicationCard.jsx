import { formatDistanceToNow } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ApplicationCard = ({ application, job }) => {
  const getStatusIcon = (status) => {
    const icons = {
      Applied: "Send",
      Reviewing: "Eye",
      Interview: "MessageCircle",
      Rejected: "X"
    };
    return icons[status] || "FileText";
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: "applied",
      Reviewing: "reviewing", 
      Interview: "interview",
      Rejected: "rejected"
    };
    return colors[status] || "default";
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {job?.title || "Job Title"}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <ApperIcon name="Building2" className="w-4 h-4 mr-1" />
            <span className="font-medium">{job?.company || "Company"}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            <span>{job?.location || "Location"}</span>
          </div>
        </div>
        <Badge variant={getStatusColor(application.status)}>
          <ApperIcon 
            name={getStatusIcon(application.status)} 
            className="w-3 h-3 mr-1" 
          />
          {application.status}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
          <span>Applied {formatDistanceToNow(new Date(application.appliedDate), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center">
          <ApperIcon name="FileText" className="w-4 h-4 mr-1" />
          <span>{application.resumeUsed}</span>
        </div>
      </div>

      {application.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {application.notes}
          </p>
        </div>
      )}
    </Card>
  );
};

export default ApplicationCard;