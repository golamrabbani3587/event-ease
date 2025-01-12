import { useState } from "react";
import { loginUser } from "../services/api";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let [alert, setAlert] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email, password });
      setAlert({ message: "Login successful!", type: "success" });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setAlert({ message: "Login failed. Please try again.", type: "error" });
    }
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  return (
    <div className="relative">
      <Navbar isLoggedIn={false} />
      {alert && (
        <div
          className={`absolute top-4 right-4 p-4 rounded-md shadow-lg text-white ${
            alert.type === "success" ? "bg-yellow-500" : "bg-red-500"
          }`}
        >
          {alert.message}
        </div>
      )}
      <div className="max-w-sm mx-auto mt-16">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="block w-full p-2 mt-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="block w-full p-2 mt-2 border rounded"
          />
          <button
            type="submit"
            className="w-full p-2 mt-4 bg-yellow-500 text-white rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
