import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No results found", 
  description = "Try adjusting your search criteria or filters.", 
  action,
  icon = "Search",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] text-center", className)}>
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-full p-6 mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-accent" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent to-accent/90 text-white rounded-lg hover:from-accent/90 hover:to-accent/80 transition-all duration-200 font-medium"
        >
          <ApperIcon name={action.icon || "Plus"} className="w-4 h-4 mr-2" />
          {action.label}
        </button>
      )}
    </div>
  );
};

export default Empty;