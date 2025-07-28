import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FileUpload from "@/components/molecules/FileUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import resumeService from "@/services/api/resumeService";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const Profile = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await resumeService.getAll();
      setResumes(data);
    } catch (err) {
      setError("Failed to load resumes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleFileSelect = async (file) => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      const resumeData = {
        filename: file.name,
        uploadDate: new Date().toISOString(),
        fileUrl: URL.createObjectURL(file),
        isDefault: resumes.length === 0
      };
      
      await resumeService.create(resumeData);
      await loadResumes();
      
      toast.success("Resume uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleSetDefault = async (resumeId) => {
    try {
      // First, set all resumes to non-default
      for (const resume of resumes) {
        if (resume.isDefault) {
          await resumeService.update(resume.Id, { ...resume, isDefault: false });
        }
      }
      
      // Then set the selected resume as default
      const resume = resumes.find(r => r.Id === resumeId);
      await resumeService.update(resumeId, { ...resume, isDefault: true });
      
      await loadResumes();
      toast.success("Default resume updated");
    } catch (err) {
      toast.error("Failed to update default resume");
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    
    try {
      await resumeService.delete(resumeId);
      await loadResumes();
      toast.success("Resume deleted successfully");
    } catch (err) {
      toast.error("Failed to delete resume");
    }
  };

  const formatFileSize = (url) => {
    // Mock file size since we're using object URLs
    return "2.5 MB";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadResumes} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text font-display mb-4">
          Your Profile
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Manage your resumes and application preferences
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Resume Management</h2>
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="Info" className="w-4 h-4 mr-1" />
            <span>Upload multiple versions for different job types</span>
          </div>
        </div>

        <FileUpload
          onFileSelect={handleFileSelect}
          accept=".pdf,.doc,.docx"
        />

        {uploading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center text-primary">
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              Uploading resume...
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Your Resumes ({resumes.length})
        </h3>

        {resumes.length === 0 ? (
          <Empty
            title="No resumes uploaded yet"
            description="Upload your first resume to start applying for jobs."
            icon="FileText"
          />
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume.Id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center flex-1">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 mr-4">
                    <ApperIcon name="FileText" className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h4 className="font-medium text-gray-900 mr-2">
                        {resume.filename}
                      </h4>
                      {resume.isDefault && (
                        <Badge variant="success">Default</Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                        Uploaded {formatDistanceToNow(new Date(resume.uploadDate), { addSuffix: true })}
                      </span>
                      <span className="flex items-center">
                        <ApperIcon name="HardDrive" className="w-4 h-4 mr-1" />
                        {formatFileSize(resume.fileUrl)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(resume.fileUrl, "_blank")}
                    icon="Eye"
                  >
                    View
                  </Button>
                  {!resume.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(resume.Id)}
                      icon="Star"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteResume(resume.Id)}
                    icon="Trash2"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Application Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-2">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Tailor Your Resume</h4>
              <p className="text-sm text-gray-600">Customize your resume for each job type and industry.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-2">
              <ApperIcon name="Target" className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Use Keywords</h4>
              <p className="text-sm text-gray-600">Include relevant keywords from job descriptions.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-2">
              <ApperIcon name="Clock" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Apply Early</h4>
              <p className="text-sm text-gray-600">Submit applications within the first few days of posting.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg p-2">
              <ApperIcon name="MessageSquare" className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Follow Up</h4>
              <p className="text-sm text-gray-600">Send a polite follow-up email after 1-2 weeks.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;