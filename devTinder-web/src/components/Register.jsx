import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Alert from "./ui/Alert";
import Card from "./ui/Card";
import { fadeUp } from "../lib/motion";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post("signup", { firstName, lastName, email, password });
      setSuccessMessage("Account created! Redirecting...");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (error) {
      setErrorMessage(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div {...fadeUp(0)} className="w-full max-w-[420px]">
      <Card className="!p-8 lg:!p-10 shadow-xl border-black/[0.08]">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
          <p className="text-[15px] text-text-secondary mt-2">Join the developer community</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} hint="Uppercase, lowercase, number, symbol" required />
          <Input label="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Button type="submit" className="w-full mt-2" size="lg" loading={isSubmitting} magnetic>
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
          <p className="text-center text-[14px] text-text-secondary">
            Have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
          </p>
        </form>
      </Card>
    </motion.div>
  );
}
