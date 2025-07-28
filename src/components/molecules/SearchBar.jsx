import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ onSearch, placeholder = "Search jobs...", value = "", onChange }) => {
  const [searchTerm, setSearchTerm] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          icon="Search"
          className="pr-12"
        />
      </div>
      <Button type="submit" variant="primary" icon="Search">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;