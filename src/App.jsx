import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Jobs from "@/components/pages/Jobs";
import Applications from "@/components/pages/Applications";
import Alerts from "@/components/pages/Alerts";
import Profile from "@/components/pages/Profile";
import JobDetails from "@/components/pages/JobDetails";
import InterviewPrep from "@/components/pages/InterviewPrep";

function App() {
  return (
    <>
<Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Jobs />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:jobId" element={<JobDetails />} />
          <Route path="applications" element={<Applications />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="interview-prep" element={<InterviewPrep />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;