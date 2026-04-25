import React, { useEffect, useState } from "react";
import { getAnalytics } from "../../services/api";
import { DollarSign, ShoppingBag, Package, Users, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import './AdminDashboard.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  if (!data) return <div>Không thể tải dữ liệu thống kê</div>;

  const formatVND = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);

  const formatMonth = (m) => `Tháng ${m}`;

  return (
    <div className="admin-dashboard">
      <h1 style={{ marginBottom: "20px", fontFamily: "var(--font-serif)" }}>
        Tổng quan hệ thống
      </h1>

      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          className="stat-card"
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              background: "#e6f7ff",
              padding: "15px",
              borderRadius: "50%",
              color: "#1890ff",
            }}
          >
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>
              Tổng Doanh Thu
            </p>
            <h3 style={{ fontSize: "20px", fontWeight: 600 }}>
              {formatVND(data.totalRevenue)}
            </h3>
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              background: "#f6ffed",
              padding: "15px",
              borderRadius: "50%",
              color: "#52c41a",
            }}
          >
            <ShoppingBag size={24} />
          </div>
          <div>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>
              Tổng Đơn Hàng
            </p>
            <h3 style={{ fontSize: "24px", fontWeight: 600 }}>
              {data.totalOrders}
            </h3>
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              background: "#fff2e8",
              padding: "15px",
              borderRadius: "50%",
              color: "#fa541c",
            }}
          >
            <Package size={24} />
          </div>
          <div>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>
              Tổng Sản Phẩm
            </p>
            <h3 style={{ fontSize: "24px", fontWeight: 600 }}>
              {data.totalProducts}
            </h3>
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              background: "#f9f0ff",
              padding: "15px",
              borderRadius: "50%",
              color: "#722ed1",
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>
              Tổng Khách Hàng
            </p>
            <h3 style={{ fontSize: "24px", fontWeight: 600 }}>
              {data.totalUsers}
            </h3>
          </div>
        </div>
      </div>

      <div
        className="chart-section"
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "#333" }}>
          Biểu đồ Doanh Thu Năm Nay
        </h2>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={data.monthlyRevenue}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eee"
              />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => formatVND(val).replace(" ₫", "")}
              />
              <Tooltip
                formatter={(value) => formatVND(value)}
                labelFormatter={(label) => `Tháng ${label}`}
                cursor={{ fill: "#f5f5f5" }}
              />
              <Bar
                dataKey="revenue"
                fill="var(--gold)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
