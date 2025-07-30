import React from "react";
import "./AdminPanel.scss"; // Assuming you will create this for styling

// Placeholder components for dashboard widgets
const SummaryCard: React.FC<{
  title: string;
  value: string;
  icon?: string;
}> = ({ title, value, icon }) => (
  <div className="summary-card">
    {icon && <span className="summary-card-icon">{icon}</span>}
    <h3 className="summary-card-title">{title}</h3>
    <p className="summary-card-value">{value}</p>
  </div>
);

const RecentActivityItem: React.FC<{ description: string; time: string }> = ({
  description,
  time,
}) => (
  <li className="recent-activity-item">
    <p>{description}</p>
    <span>{time}</span>
  </li>
);

const AdminPanel: React.FC = () => {
  // Placeholder data - replace with actual data fetching and state management
  const summaryData = [
    { title: "Total Sales", value: "$12,345", icon: "💰" },
    { title: "Total Orders", value: "1,234", icon: "🛒" },
    { title: "New Customers", value: "56", icon: "👥" },
    { title: "Pending Shipments", value: "32", icon: "🚚" },
  ];

  const recentActivities = [
    { description: "New order #ORD123 placed.", time: "10 mins ago" },
    { description: "Product 'Awesome T-Shirt' updated.", time: "1 hour ago" },
    {
      description: "User 'john.doe@example.com' registered.",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="admin-panel">
      <h1 className="admin-panel-header">Admin Dashboard</h1>

      <section className="summary-cards-section">
        <h2>Overview</h2>
        <div className="summary-cards-container">
          {summaryData.map((data, index) => (
            <SummaryCard
              key={index}
              title={data.title}
              value={data.value}
              icon={data.icon}
            />
          ))}
        </div>
      </section>

      <section className="recent-activity-section">
        <h2>Recent Activity</h2>
        <ul className="recent-activity-list">
          {recentActivities.map((activity, index) => (
            <RecentActivityItem
              key={index}
              description={activity.description}
              time={activity.time}
            />
          ))}
        </ul>
      </section>

      {/* You can add more sections here, e.g., charts, quick links */}
      {/* <section className="charts-section">
        <h2>Sales Trends</h2>
        {/* Placeholder for charts - you can integrate a charting library here */}
      {/* <div className="chart-placeholder">Chart will go here</div>
      </section> */}
    </div>
  );
};

export default AdminPanel;
