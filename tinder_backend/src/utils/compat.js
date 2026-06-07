const calcCompatibility = (mySkills = [], theirSkills = []) => {
  if (!mySkills.length || !theirSkills.length) return 0;
  const mine = new Set(mySkills.map((s) => s.toLowerCase()));
  const overlap = theirSkills.filter((s) => mine.has(s.toLowerCase())).length;
  return Math.round((overlap / Math.max(mine.size, theirSkills.length)) * 100);
};

module.exports = { calcCompatibility };
