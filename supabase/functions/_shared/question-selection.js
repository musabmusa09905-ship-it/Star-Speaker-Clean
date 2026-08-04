export function chooseQuestion(eligible, history, recentQuestionIds = [], randomValue = 0) {
  if (!Array.isArray(eligible) || !eligible.length) return null;
  const recentIds = new Set(recentQuestionIds.map(String));
  const historyById = new Map();
  for (const entry of history || []) {
    const id = String(entry.question_id || "");
    if (!id || historyById.has(id)) continue;
    historyById.set(id, entry);
  }
  const unseen = eligible.filter((question) => !historyById.has(question.id) && !recentIds.has(question.id));
  const nonRecent = eligible.filter((question) => !recentIds.has(question.id));
  if (unseen.length) return unseen[Math.abs(Number(randomValue) || 0) % unseen.length];
  if (nonRecent.length) return nonRecent[Math.abs(Number(randomValue) || 0) % nonRecent.length];
  return [...eligible].sort((a, b) => {
    const aTime = Date.parse(String(historyById.get(a.id)?.last_served_at || 0));
    const bTime = Date.parse(String(historyById.get(b.id)?.last_served_at || 0));
    return aTime - bTime || a.id.localeCompare(b.id);
  })[0];
}
