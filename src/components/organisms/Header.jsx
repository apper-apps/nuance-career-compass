import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const location = useLocation();

  const navigation = [
    { name: "Jobs", href: "/jobs", icon: "Search" },
    { name: "Applications", href: "/applications", icon: "FileText" },
    { name: "Alerts", href: "/alerts", icon: "Bell" },
    { name: "Profile", href: "/profile", icon: "User" }
  ];

  const isActive = (href) => {
    if (href === "/jobs") {
      return location.pathname === "/" || location.pathname === "/jobs" || location.pathname.startsWith("/jobs/");
    }
    return location.pathname === href;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-2 mr-3">
              <ApperIcon name="Compass" className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text font-display">
              CareerCompass
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200",
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <ApperIcon name="Menu" className="w-6 h-6 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors duration-200",
                isActive(item.href)
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                className={cn(
                  "w-5 h-5 mb-1",
                  isActive(item.href) ? "text-primary" : "text-gray-500"
                )} 
              />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;