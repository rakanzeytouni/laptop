"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 via-purple-600 to-blue-700">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-xl"
          >
            Login
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
          Login with Google
        </button>
          <div><a href="/" className=" text-blue-500 hover:underline">If You dont have An Acount</a>  </div>
      </motion.div>
    </div>
  );
}
