import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const FilterPanel = ({ filters, onFiltersChange, onClear }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const locations = [
    "New York, NY",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Boston, MA",
    "Seattle, WA",
    "Austin, TX",
    "Denver, CO",
    "Atlanta, GA",
    "Remote"
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Sales",
    "Engineering",
    "Design",
    "Human Resources",
    "Operations"
  ];

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote"
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          icon="X"
        >
          Clear All
        </Button>
      </div>
      
      <div className="space-y-4">
        <Select
          label="Location"
          placeholder="Select location"
          value={filters.location || ""}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </Select>

        <Select
          label="Industry"
          placeholder="Select industry"
          value={filters.industry || ""}
          onChange={(e) => handleFilterChange("industry", e.target.value)}
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
          value={filters.type || ""}
          onChange={(e) => handleFilterChange("type", e.target.value)}
        >
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default FilterPanel;