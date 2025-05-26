import axios from "axios";
import { useState, useEffect } from "react";

export default function AttendanceButton({ setMessage }) {
  const [records, setRecords] = useState([]);

  // 출석자 명단 불러오기
  const fetchTodayAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/attendance/today");
      setRecords(res.data);
    } catch (err) {
      console.error("출석 목록 불러오기 실패", err);
    }
  };

  const handleCheckAttendance = async () => {
    try {
      const coords = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8080/api/attendance/check",
        {
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      await fetchTodayAttendance();
    } catch (err) {
      console.error(err);
      setMessage("출석 실패");
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  return (
    <div>
      <button className="btn" onClick={handleCheckAttendance}>
        출석 체크
      </button>

  
      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
          📋 오늘 출석자 명단
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>이름</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>출석 시간</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ textAlign: "center", padding: "12px", color: "#888" }}>
                  아직 출석한 사람이 없습니다.
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                    {r.username}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                    {new Date(r.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}