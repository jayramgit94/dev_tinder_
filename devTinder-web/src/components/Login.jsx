import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import api from "../lib/api";
import { addUser } from "../../utils/userSlice";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Alert from "./ui/Alert";
import Card from "./ui/Card";
import { fadeUp } from "../lib/motion";

export default function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const response = await api.post("login", { email: emailId, password });
      const userData = response.data.user || response.data;
      dispatch(addUser(userData));
      navigate(userData.onboardingComplete ? "/app" : "/app/onboarding", { replace: true });
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div {...fadeUp(0)} className="w-full max-w-[420px]">
      <Card className="!p-8 lg:!p-10 shadow-xl border-black/[0.08]">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-[15px] text-text-secondary mt-2">Sign in to continue networking</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <Input label="Email" type="email" value={emailId} placeholder="you@example.com" onChange={(e) => setEmailId(e.target.value)} required autoComplete="email" />
          <Input label="Password" type="password" value={password} placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          {errorMsg && <Alert variant="error">{errorMsg}</Alert>}
          <Button type="submit" className="w-full" size="lg" loading={isSubmitting} magnetic>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-[14px] text-text-secondary">
            New here?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">Create account</Link>
          </p>
        </form>
      </Card>
    </motion.div>
  );
}
