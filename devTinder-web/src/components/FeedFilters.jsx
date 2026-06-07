import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Badge from "./ui/Badge";
import { cn } from "../lib/utils";

const SKILL_SUGGESTIONS = ["JavaScript", "React", "Node.js", "Python", "TypeScript", "Go", "AWS", "MongoDB"];
const GENDERS = [
  { value: "", label: "Any gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function FeedFilters({ filters, onChange, onApply, onReset, loading }) {
  const [expanded, setExpanded] = useState(false);
  const hasActive = Boolean(filters.skills?.length || filters.city || filters.gender);

  const toggleSkill = (skill) => {
    const current = filters.skills || [];
    const next = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill];
    onChange({ ...filters, skills: next });
  };

  return (
    <div className="max-w-md mx-auto mb-8">
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border text-sm font-medium transition-all duration-200",
          expanded || hasActive
            ? "bg-surface-elevated border-border shadow-sm"
            : "bg-surface-elevated/80 border-border hover:border-brand-200 hover:shadow-sm",
        )}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2 text-text-primary">
          <svg className="size-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Refine your feed
          {hasActive && (
            <span className="size-1.5 rounded-full bg-brand-600" aria-label="Filters active" />
          )}
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-muted"
          aria-hidden="true"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl border border-border bg-surface-elevated shadow-sm space-y-5">
              <Input
                label="City"
                placeholder="e.g. Mumbai, Bangalore"
                value={filters.city || ""}
                onChange={(e) => onChange({ ...filters, city: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium mb-1.5 text-text-primary">Gender</label>
                <select
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-shadow"
                  value={filters.gender || ""}
                  onChange={(e) => onChange({ ...filters, gender: e.target.value })}
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm font-medium mb-2.5 text-text-primary">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {SKILL_SUGGESTIONS.map((skill) => {
                    const active = filters.skills?.includes(skill);
                    return (
                      <button key={skill} type="button" onClick={() => toggleSkill(skill)}>
                        <Badge variant={active ? "default" : "neutral"} className={cn(active && "ring-1 ring-brand-200")}>
                          {skill}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button variant="secondary" size="sm" className="flex-1" onClick={onReset} disabled={loading}>
                  Reset
                </Button>
                <Button size="sm" className="flex-1" onClick={onApply} loading={loading}>
                  Apply filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function buildFeedQuery(filters, page = 1) {
  const params = new URLSearchParams({ page: String(page), limit: "10" });
  if (filters.city?.trim()) params.set("city", filters.city.trim());
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.skills?.length) params.set("skills", filters.skills.join(","));
  return params.toString();
}
