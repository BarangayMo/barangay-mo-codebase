
import { Layout } from "@/components/layout/Layout";

const OfficialsDashboard = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-official">Officials Dashboard</h1>
        <div className="mt-6 bg-white rounded-2xl shadow-md p-8 border-[1.5px] border-[#ffd7da]">
          <p className="text-lg text-gray-700 max-w-2xl">
            Welcome, Barangay Official!<br />
            Here you can manage residents, job & product listings, send announcements, and view barangay statistics.
          </p>
          <div className="mt-8 text-gray-400 text-sm">More features coming soon...</div>
        </div>
      </div>
    </Layout>
  );
};
export default OfficialsDashboard;
