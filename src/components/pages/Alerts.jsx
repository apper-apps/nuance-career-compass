import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import alertService from "@/services/api/alertService";
import { toast } from "react-toastify";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    filters: {
      title: "",
      location: "",
      industry: "",
      type: ""
    },
    frequency: "daily"
  });

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await alertService.getAll();
      setAlerts(data);
    } catch (err) {
      setError("Failed to load alerts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleInputChange = (field, value) => {
    if (field.startsWith("filters.")) {
      const filterField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          [filterField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please enter an alert name");
      return;
    }

    const hasFilters = Object.values(formData.filters).some(value => value.trim());
    if (!hasFilters) {
      toast.error("Please specify at least one search criteria");
      return;
    }

    try {
      const alertData = {
        ...formData,
        isActive: true
      };
      
      await alertService.create(alertData);
      await loadAlerts();
      
      setFormData({
        name: "",
        filters: {
          title: "",
          location: "",
          industry: "",
          type: ""
        },
        frequency: "daily"
      });
      setShowForm(false);
      
      toast.success("Job alert created successfully");
    } catch (err) {
      toast.error("Failed to create alert");
    }
  };

  const handleToggleAlert = async (alertId, currentStatus) => {
    try {
      await alertService.update(alertId, { isActive: !currentStatus });
      await loadAlerts();
      toast.success(`Alert ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (err) {
      toast.error("Failed to update alert");
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;
    
    try {
      await alertService.delete(alertId);
      await loadAlerts();
      toast.success("Alert deleted successfully");
    } catch (err) {
      toast.error("Failed to delete alert");
    }
  };

  const locations = [
    "New York, NY", "San Francisco, CA", "Los Angeles, CA", "Chicago, IL",
    "Boston, MA", "Seattle, WA", "Austin, TX", "Denver, CO", "Atlanta, GA", "Remote"
  ];

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Marketing",
    "Sales", "Engineering", "Design", "Human Resources", "Operations"
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAlerts} />;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text font-display mb-4">
          Job Alerts
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Set up personalized job alerts and never miss the perfect opportunity
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Alerts ({alerts.length})
        </h2>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          icon={showForm ? "X" : "Plus"}
        >
          {showForm ? "Cancel" : "Create Alert"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Alert</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Alert Name"
              placeholder="e.g., Frontend Developer in San Francisco"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job Title Keywords"
                placeholder="e.g., React Developer, Frontend"
                value={formData.filters.title}
                onChange={(e) => handleInputChange("filters.title", e.target.value)}
              />

              <Select
                label="Preferred Location"
                placeholder="Select location"
                value={formData.filters.location}
                onChange={(e) => handleInputChange("filters.location", e.target.value)}
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Industry"
                placeholder="Select industry"
                value={formData.filters.industry}
                onChange={(e) => handleInputChange("filters.industry", e.target.value)}
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </Select>

              <Select
                label="Job Type"
                placeholder="Select job type"
                value={formData.filters.type}
                onChange={(e) => handleInputChange("filters.type", e.target.value)}
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            <Select
              label="Alert Frequency"
              value={formData.frequency}
              onChange={(e) => handleInputChange("frequency", e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="immediate">Immediate</option>
            </Select>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon="Bell">
                Create Alert
              </Button>
            </div>
          </form>
        </Card>
      )}

      {alerts.length === 0 ? (
        <Empty
          title="No job alerts yet"
          description="Create your first job alert to get notified about relevant opportunities."
          action={{
            label: "Create Alert",
            onClick: () => setShowForm(true),
            icon: "Bell"
          }}
          icon="Bell"
        />
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert.Id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {alert.name}
                    </h3>
                    <Badge variant={alert.isActive ? "success" : "default"}>
                      {alert.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {alert.filters.title && (
                      <div className="flex items-center">
                        <ApperIcon name="Search" className="w-4 h-4 mr-2" />
                        <span>Keywords: {alert.filters.title}</span>
                      </div>
                    )}
                    {alert.filters.location && (
                      <div className="flex items-center">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                        <span>Location: {alert.filters.location}</span>
                      </div>
                    )}
                    {alert.filters.industry && (
                      <div className="flex items-center">
                        <ApperIcon name="Building" className="w-4 h-4 mr-2" />
                        <span>Industry: {alert.filters.industry}</span>
                      </div>
                    )}
                    {alert.filters.type && (
                      <div className="flex items-center">
                        <ApperIcon name="Briefcase" className="w-4 h-4 mr-2" />
                        <span>Type: {alert.filters.type}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                      <span>Frequency: {alert.frequency}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAlert(alert.Id, alert.isActive)}
                    icon={alert.isActive ? "PauseCircle" : "PlayCircle"}
                  >
                    {alert.isActive ? "Pause" : "Activate"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.Id)}
                    icon="Trash2"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;