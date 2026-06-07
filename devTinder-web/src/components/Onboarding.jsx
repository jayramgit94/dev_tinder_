import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { addUser } from "../../utils/userSlice";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Alert from "./ui/Alert";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { cn } from "../lib/utils";

const STEPS = ["About you", "Details", "Skills"];

const GOAL_OPTIONS = [
  "Co-founder",
  "Hackathon team",
  "Open source",
  "Mentorship",
  "Side project",
  "Job referral",
];

export default function Onboarding() {
  const user = useSelector((store) => store.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [about, setAbout] = useState(user?.about === "Hey there! I am using DevTinder." ? "" : user?.about || "");
  const [age, setAge] = useState(user?.age?.toString() || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [city, setCity] = useState(user?.city || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState(user?.skills || []);
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    const skill = skillsInput.trim();
    if (!skill || skills.includes(skill) || skills.length >= 10) return;
    setSkills([...skills, skill]);
    setSkillsInput("");
  };

  const toggleGoal = (goal) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  };

  const canProceed = () => {
    if (step === 0) return about.trim().length >= 10;
    if (step === 1) return age && gender;
    if (step === 2) return skills.length >= 1;
    return true;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const goalText = goals.length ? ` Looking for: ${goals.join(", ")}.` : "";
      const payload = {
        about: about.trim() + goalText,
        age: Number(age),
        gender,
        city: city.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined,
        skills,
        onboardingComplete: true,
      };

      const res = await api.patch("profile/edit", payload);
      dispatch(addUser(res.data.user || { ...user, ...payload }));
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12 mesh-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-xl !p-0 overflow-hidden">
          <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-black/[0.04] bg-linear-to-b from-brand-50/50 to-white">
            <p className="label-caps mb-2">Welcome</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Set up your developer profile
            </h1>
            <p className="text-text-secondary text-sm mt-1.5">{STEPS[step]}</p>

            <div className="flex items-center gap-3 mt-6">
              <span className="text-xs font-medium text-text-muted shrink-0">
                {step + 1}/{STEPS.length}
              </span>
              <div className="flex gap-1.5 flex-1">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-300",
                      i <= step ? "bg-brand-600" : "bg-black/[0.06]",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-6">
            {error && <Alert variant="error" className="mb-5">{error}</Alert>}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-text-primary">Bio</label>
                      <textarea
                        className="w-full min-h-[130px] px-4 py-3 rounded-xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none text-sm leading-relaxed"
                        placeholder="Tell developers what you're building, learning, or looking for..."
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                      />
                      <p className="text-xs text-text-muted mt-1.5">Minimum 10 characters</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2.5 text-text-primary">What are you looking for?</p>
                      <div className="flex flex-wrap gap-2">
                        {GOAL_OPTIONS.map((goal) => (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => toggleGoal(goal)}
                            className={cn(
                              "px-3.5 py-2 rounded-full text-sm border transition-all duration-200",
                              goals.includes(goal)
                                ? "bg-brand-50 border-brand-300 text-brand-700 shadow-sm"
                                : "border-black/[0.08] text-text-secondary hover:border-brand-200 hover:bg-brand-50/30",
                            )}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <Input label="Age" type="number" min={18} max={100} value={age} onChange={(e) => setAge(e.target.value)} />
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-text-primary">Gender</label>
                      <select
                        className="w-full h-11 px-4 rounded-xl border border-border bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" />
                    <Input
                      label="Photo URL"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://..."
                      hint="Optional — paste an image URL"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        label="Skills"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="e.g. React"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" variant="secondary" className="mt-7 shrink-0" onClick={addSkill}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[32px]">
                      {skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => setSkills(skills.filter((s) => s !== skill))}
                        >
                          <Badge>{skill} ×</Badge>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-text-muted">Add at least 1 skill (max 10)</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3 mt-8 pt-6 border-t border-black/[0.04]">
              {step > 0 && (
                <Button variant="secondary" onClick={() => setStep(step - 1)} disabled={loading}>
                  Back
                </Button>
              )}
              <div className="flex-1" />
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} loading={loading} disabled={!canProceed()}>
                  Finish setup
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
