import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../services/api";
import { appConfig } from "../../utils/app-config";
import { notyf } from "../../utils/notyf";
import { Spinner } from "../../components/Spinner/Spinner";
import "./ReportsPage.css";

interface ReportRow {
    destination: string;
    likesCount: number;
}

function ReportsPage() {
    const [data, setData] = useState<ReportRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchReport() {
            try {
                const response = await api.get("/api/reports");
                setData(response.data.data);
            } catch {
                setError("Failed to load report data.");
            } finally {
                setLoading(false);
            }
        }

        fetchReport();
    }, []);

    async function handleDownloadCsv() {
        try {
            const token = localStorage.getItem("token");
            const url = `${appConfig.apiUrl}/api/reports/csv`;
            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!response.ok) throw new Error("Download failed");
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "vacation-likes-report.csv";
            link.click();
            URL.revokeObjectURL(link.href);
        } catch {
            notyf.error("Failed to download CSV.");
        }
    }

    if (loading) return <Spinner message="Loading report..." />;

    if (error) {
        return (
            <div className="ReportsPage">
                <p className="report-error">{error}</p>
            </div>
        );
    }

    return (
        <div className="ReportsPage">
            <div className="report-header">
                <h2>Vacations Report</h2>
                <button className="csv-btn" onClick={handleDownloadCsv}>
                    📥 Download CSV
                </button>
            </div>

            {data.length === 0 ? (
                <p className="no-data">No data available.</p>
            ) : (
                <div className="chart-container">
                    <h3 className="chart-title">Vacations Report</h3>
                    <ResponsiveContainer width="100%" height={420}>
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={true} />
                            <XAxis
                                dataKey="destination"
                                tick={{ fontSize: 12 }}
                                angle={-35}
                                textAnchor="end"
                                interval={0}
                                height={80}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 13 }}
                            />
                            <Tooltip
                                formatter={(value) => [String(value), "Likes"]}
                                contentStyle={{ borderRadius: 8, border: "1px solid #ddd" }}
                            />
                            <Bar dataKey="likesCount" fill="#7ec8e3" radius={[2, 2, 0, 0]} maxBarSize={55} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default ReportsPage;
