import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StatusPipeline = ({ currentStatus, applications = [] }) => {
  const stages = [
    { key: "Applied", label: "Applied", icon: "Send" },
    { key: "Reviewing", label: "Reviewing", icon: "Eye" },
    { key: "Interview", label: "Interview", icon: "MessageCircle" },
    { key: "Offer", label: "Offer", icon: "CheckCircle" }
  ];

  const getStageCount = (stage) => {
    return applications.filter(app => app.status === stage).length;
  };

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.key === currentStatus);
  };

  const currentIndex = getCurrentStageIndex();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Pipeline</h3>
      
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isActive = index === currentIndex;
          const isPassed = index < currentIndex;
          const count = getStageCount(stage.key);
          
          return (
            <div key={stage.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                    isActive && "bg-gradient-to-r from-primary to-primary/90 border-primary text-white shadow-lg",
                    isPassed && "bg-gradient-to-r from-success to-success/90 border-success text-white",
                    !isActive && !isPassed && "border-gray-300 text-gray-400 bg-white"
                  )}
                >
                  <ApperIcon name={stage.icon} className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium mt-2 transition-colors duration-200",
                    isActive && "text-primary",
                    isPassed && "text-success",
                    !isActive && !isPassed && "text-gray-500"
                  )}
                >
                  {stage.label}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {count} application{count !== 1 ? 's' : ''}
                </span>
              </div>
              
              {index < stages.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-200",
                    index < currentIndex ? "bg-gradient-to-r from-success to-success/90" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusPipeline;