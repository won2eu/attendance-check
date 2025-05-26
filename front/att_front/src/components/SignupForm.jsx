import { useState } from "react";
import axios from "axios";

export default function SignupForm({ setIsSignup, setMessage }) {
  const [form, setForm] = useState({ userId: "", name: "", password: "", confirmPassword: "" });

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/signup", {
        username: form.userId,
        realname: form.name,
        password: form.password,
      });

      setMessage("회원가입 성공. 로그인하세요.");
      setIsSignup(false);
    } catch {
      setMessage("회원가입 실패");
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <input className="input" placeholder="User ID" value={form.userId} onChange={(e) => handleChange("userId", e.target.value)} />
      <input className="input" placeholder="Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
      <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} />
      <input className="input" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} />
      <button className="btn" onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
