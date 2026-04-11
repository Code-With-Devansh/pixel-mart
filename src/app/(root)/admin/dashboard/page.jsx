import React from "react";
import CountOverview from "./CountOverview";
import QuickAdd from "./QuickAdd";

const AdminDashboard = () => {
  return (
    <div className="pt-5">
      <CountOverview />
      <QuickAdd/>
    </div>
  );
};

export default AdminDashboard;
