import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { addUser } from "../../utils/userSlice";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Alert from "./ui/Alert";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Avatar from "./ui/Avatar";
import Reveal from "./motion/Reveal";

export default function ProfileEdit() {
  const user = useSelector((store) => store.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [about, setAbout] = useState(user?.about || "");
  const [age, setAge] = useState(user?.age?.toString() || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [city, setCity] = useState(user?.city || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "");
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || "");
  const [calendlyUrl, setCalendlyUrl] = useState(user?.calendlyUrl || "");
  const [readReceipts, setReadReceipts] = useState(user?.readReceipts !== false);
  const [lookingFor, setLookingFor] = useState(user?.lookingFor || []);
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState(user?.skills || []);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    const skill = skillsInput.trim();
    if (!skill || skills.includes(skill) || skills.length >= 10) return;
    setSkills([...skills, skill]);
    setSkillsInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        about: about.trim(),
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        city: city.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        calendlyUrl: calendlyUrl.trim() || undefined,
        lookingFor,
        readReceipts,
        skills,
      };

      const res = await api.patch("profile/edit", payload);
      dispatch(addUser(res.data.user));
      setSuccess("Profile updated successfully");
      setTimeout(() => navigate("/app/profile"), 800);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow px-5 sm:px-8 py-8 lg:py-10 max-w-xl mx-auto">
      <Reveal>
        <div className="mb-8">
          <Link
            to="/app/profile"
            className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            <span aria-hidden="true">←</span> Back to profile
          </Link>
          <p className="label-caps mt-4 mb-2">Settings</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit profile</h1>
          <p className="text-[14px] text-text-secondary mt-1.5">Update how other developers see you</p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <Card className="!p-0 overflow-hidden">
          <div className="px-6 py-8 bg-linear-to-br from-brand-50/80 via-surface-elevated to-surface-elevated dark:from-brand-50/20 dark:via-surface-elevated dark:to-surface-elevated border-b border-border">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Avatar src={photoUrl || user?.photoUrl} alt={firstName} size="xl" />
              </motion.div>
              <div>
                <p className="font-semibold text-text-primary tracking-tight">
                  {firstName || "Your"} {lastName}
                </p>
                <p className="text-sm text-text-muted mt-0.5">Paste a photo URL below to update your avatar</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-text-primary">About</label>
              <textarea
                className="w-full min-h-[110px] px-4 py-3 rounded-xl border border-border bg-surface-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none transition-shadow leading-relaxed"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="What are you building, learning, or looking for?"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Age" type="number" min={18} max={100} value={age} onChange={(e) => setAge(e.target.value)} />
              <div>
                <label className="block text-sm font-medium mb-1.5 text-text-primary">Gender</label>
                <select
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" />
            <Input label="Photo URL" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." />
            <Input label="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
            <Input label="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
            <Input label="Portfolio URL" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
            <Input label="Calendly URL" value={calendlyUrl} onChange={(e) => setCalendlyUrl(e.target.value)} />

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={readReceipts} onChange={(e) => setReadReceipts(e.target.checked)} />
              Show read receipts to matches
            </label>

            <div>
              <div className="flex gap-2">
                <Input
                  label="Skills"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. React"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" variant="secondary" className="mt-7 shrink-0" onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 min-h-[28px]">
                <AnimatePresence mode="popLayout">
                  {skills.map((skill) => (
                    <motion.button
                      key={skill}
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    >
                      <Badge>{skill} ×</Badge>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Alert variant="error">{error}</Alert>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Alert variant="success">{success}</Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" className="w-full" loading={loading} size="lg">
              Save changes
            </Button>
          </form>
        </Card>
      </Reveal>
    </div>
  );
}
