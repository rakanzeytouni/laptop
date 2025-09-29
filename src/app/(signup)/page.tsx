"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setNameError(val.trim().length < 5 ? "Name must be at least 5 characters." : null);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
      setPasswordError("Password must include at least one special character.");
    } else {
      setPasswordError(null);
    }
  };
  const handleConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirm(val);
    setConfirmError(val !== password ? "Passwords do not match!" : null);
  };
  const canSubmit =
    name.trim().length >= 5 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
    confirm === password &&
    !nameError &&
    !passwordError &&
    !confirmError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;

    const payload = { name, email, password , confirmPassword: confirm 
 };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
          const data = await res.json();
          console.log("data",data)
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/home");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 via-purple-600 to-blue-700">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Signup</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={handleName}
            placeholder="Name"
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none"
          />
          {nameError && <p className="text-red-600 text-sm">{nameError}</p>}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={handlePassword}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none"
          />
          {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}

          <input
            type="password"
            value={confirm}
            onChange={handleConfirm}
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none"
          />
          {confirmError && <p className="text-red-600 text-sm">{confirmError}</p>}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-2 bg-blue-600 text-white rounded-xl"
          >
            Signup
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/home" })}
          className="w-full py-2 bg-red-500 text-white rounded-xl"
        >
          Signup with Google
        </button>
        <div><a href="/login" className=" text-blue-500 hover:underline ">If You Have An Acount</a>  </div>
      </motion.div>
    </div>
  );
}
