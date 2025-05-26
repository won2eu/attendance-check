import { useState } from "react";
import axios from "axios";

export default function LoginForm({ setIsLogin, setMessage }) {
  const [form, setForm] = useState({ userId: "", password: "" });

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username : form.userId,
        password : form.password,
      });
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      setIsLogin(true);
      setMessage("로그인 성공");
    } catch {
      setMessage("로그인 실패");
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <input className="input" placeholder="User ID" value={form.userId} onChange={(e) => handleChange("userId", e.target.value)} />
      <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} />
      <button className="btn" onClick={handleLogin}>Login</button>
    </div>
  );
}
