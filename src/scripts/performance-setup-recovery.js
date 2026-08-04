export async function persistSetupAttempt({ ensureQuestion, saveParticipant, resetLockedAttempt }) {
  await ensureQuestion();
  try {
    await saveParticipant();
    return { recovered: false };
  } catch (cause) {
    if (cause?.code !== "participant_attempt_locked") throw cause;
    resetLockedAttempt();
    await ensureQuestion();
    await saveParticipant();
    return { recovered: true };
  }
}
