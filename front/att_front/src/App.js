import { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import AttendanceButton from "./components/AttendanceButton";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Attendance Tracker</h1>

      {!isLogin ? (
        isSignup ? (
          <SignupForm setIsSignup={setIsSignup} setMessage={setMessage} />
        ) : (
          <LoginForm setIsLogin={setIsLogin} setMessage={setMessage} />
        )
      ) : (
        <AttendanceButton setMessage={setMessage} />
      )}

      {!isLogin && (
        <button className="text-sm text-gray-400 underline mt-4" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "이미 계정이 있나요? 로그인" : "계정이 없나요? 회원가입"}
        </button>
      )}

      {message && <p className="mt-4 text-green-400">{message}</p>}
    </div>
  );
}

export default App;
