import { useState } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import FilterPanel from "@/components/molecules/FilterPanel";
import JobsList from "@/components/organisms/JobsList";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text font-display mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover opportunities that match your skills and advance your career
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by job title, company, or keywords..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClear={handleClearFilters}
          />
        </div>
        
        <div className="lg:col-span-3">
          <JobsList
            searchTerm={searchTerm}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
};

export default Jobs;