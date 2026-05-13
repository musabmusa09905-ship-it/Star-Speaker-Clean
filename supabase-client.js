(() => {
  const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
  let client = null;
  let publicClient = null;

  function getClient() {
    if (client) return client;

    if (!config.url || !config.anonKey || !window.supabase?.createClient) {
      return null;
    }

    client = window.supabase.createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    return client;
  }

  function getPublicClient() {
    if (publicClient) return publicClient;

    if (!config.url || !config.anonKey || !window.supabase?.createClient) {
      return null;
    }

    publicClient = window.supabase.createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    return publicClient;
  }

  function isConfigured() {
    return Boolean(getClient());
  }

  function makeSafePathPart(value) {
    return String(value || "student")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 42) || "student";
  }

  function makeRandomId() {
    if (window.crypto?.getRandomValues) {
      const values = new Uint32Array(2);
      window.crypto.getRandomValues(values);
      return Array.from(values, (value) => value.toString(36)).join("");
    }

    return Math.random().toString(36).slice(2, 12);
  }

  async function insertApplySubmission(payload) {
    const supabaseClient = getPublicClient();
    if (!supabaseClient) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabaseClient
      .from("apply_submissions")
      .insert(payload);

    if (error) throw error;
    return { ok: true };
  }

  async function uploadLevelTestRecording(blob, fullName) {
    const supabaseClient = getPublicClient();
    if (!supabaseClient || !blob) {
      return { path: null, publicUrl: null };
    }

    const contentType = blob.type || "audio/webm";
    const fileName = `level-tests/${Date.now()}-${makeSafePathPart(fullName)}-${makeRandomId()}.webm`;
    const audioFile = typeof File === "function"
      ? new File([blob], fileName, { type: contentType })
      : blob;

    const { data, error } = await supabaseClient.storage
      .from("level-test-recordings")
      .upload(fileName, audioFile, {
        contentType,
        upsert: false,
      });

    if (error) throw error;

    return { path: data?.path || fileName, publicUrl: null };
  }

  async function insertLevelTestSubmission(payload) {
    const supabaseClient = getPublicClient();
    if (!supabaseClient) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabaseClient
      .from("level_test_submissions")
      .insert(payload);

    if (error) throw error;
    return { ok: true };
  }

  async function getSession() {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      return null;
    }

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return data?.session || null;
  }

  async function exchangeRecoveryCode(code) {
    const supabaseClient = getClient();
    if (!supabaseClient || !code) {
      return null;
    }

    const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return data?.session || null;
  }

  async function verifyRecoveryToken(tokenHash) {
    const supabaseClient = getClient();
    if (!supabaseClient || !tokenHash) {
      return null;
    }

    const { data, error } = await supabaseClient.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (error) throw error;
    return data?.session || null;
  }

  async function setRecoverySession(accessToken, refreshToken) {
    const supabaseClient = getClient();
    if (!supabaseClient || !accessToken || !refreshToken) {
      return null;
    }

    const { data, error } = await supabaseClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) throw error;
    return data?.session || null;
  }

  async function signInStudent(email, password) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async function signOutStudent() {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      return { ok: true };
    }

    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    return { ok: true };
  }

  async function sendPasswordReset(email, redirectTo) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) throw error;
    return { ok: true };
  }

  async function updateStudentPassword(password) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabaseClient.auth.updateUser({ password });
    if (error) throw error;
    return data;
  }

  async function getStudentProfile(user) {
    const supabaseClient = getClient();
    if (!supabaseClient || !user?.id) {
      return null;
    }

    const { data: byAuthId, error: authError } = await supabaseClient
      .from("student_profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (authError) throw authError;
    if (byAuthId) return byAuthId;

    const email = String(user.email || "").trim();
    if (!email) {
      return null;
    }

    const { data: byEmail, error: emailError } = await supabaseClient
      .from("student_profiles")
      .select("*")
      .ilike("email", email)
      .limit(1)
      .maybeSingle();

    if (emailError) throw emailError;
    return byEmail || null;
  }

  async function updateStudentLoginTimestamps(profile, user) {
    const supabaseClient = getClient();
    if (!supabaseClient || !profile?.id) {
      return { ok: false };
    }

    const now = new Date().toISOString();
    const updates = {
      last_login_at: now,
      updated_at: now,
    };

    if (!profile.first_login_at) {
      updates.first_login_at = now;
    }

    const { error } = await supabaseClient
      .from("student_profiles")
      .update(updates)
      .eq("id", profile.id);

    if (error) {
      console.warn("Student login timestamp update failed:", error);
      return { ok: false, error };
    }

    return { ok: true };
  }

  async function insertPortalEvent(user, eventType, eventDetails = {}) {
    const supabaseClient = getClient();
    if (!supabaseClient || !user?.id) {
      return { ok: false };
    }

    const { error } = await supabaseClient
      .from("student_portal_events")
      .insert({
        auth_user_id: user.id,
        email: user.email || null,
        event_type: eventType,
        event_details: eventDetails,
      });

    if (error) {
      console.warn("Student portal event logging failed:", error);
      return { ok: false, error };
    }

    return { ok: true };
  }

  function getAudioExtension(fileOrBlob) {
    const type = String(fileOrBlob?.type || "").toLowerCase();
    const name = String(fileOrBlob?.name || "").toLowerCase();

    if (name.match(/\.(webm|mp3|mpeg|mp4|m4a|wav|ogg)$/)) {
      return name.split(".").pop().replace("mpeg", "mp3");
    }

    if (type.includes("mpeg") || type.includes("mp3")) return "mp3";
    if (type.includes("mp4")) return "mp4";
    if (type.includes("m4a")) return "m4a";
    if (type.includes("wav")) return "wav";
    if (type.includes("ogg")) return "ogg";
    return "webm";
  }

  function makeVoiceSubmissionPath(userId, submissionDate, fileOrBlob) {
    const safeUserId = String(userId || "student")
      .trim()
      .replace(/[^a-zA-Z0-9-]/g, "")
      .slice(0, 80) || "student";
    const safeDate = String(submissionDate || new Date().toISOString().slice(0, 10))
      .replace(/[^0-9-]/g, "")
      .slice(0, 10);
    const extension = getAudioExtension(fileOrBlob);
    return `${safeUserId}/${safeDate}/voice-${Date.now()}-${makeRandomId()}.${extension}`;
  }

  async function uploadVoiceSubmissionAudio(fileOrBlob, userId, submissionDate) {
    const supabaseClient = getClient();
    if (!supabaseClient || !fileOrBlob || !userId) {
      throw new Error("Voice submission upload is not configured.");
    }

    const storagePath = makeVoiceSubmissionPath(userId, submissionDate, fileOrBlob);
    const contentType = fileOrBlob.type || "audio/webm";
    const uploadFile = typeof File === "function" && !(fileOrBlob instanceof File)
      ? new File([fileOrBlob], storagePath.split("/").pop(), { type: contentType })
      : fileOrBlob;

    const { data, error } = await supabaseClient.storage
      .from("voice-submissions")
      .upload(storagePath, uploadFile, {
        contentType,
        upsert: false,
      });

    if (error) throw error;
    return { path: data?.path || storagePath, publicUrl: null };
  }

  async function insertVoiceSubmission(payload) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabaseClient
      .from("voice_submissions")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async function getVoiceSubmissions(userId, startDate, endDate) {
    const supabaseClient = getClient();
    if (!supabaseClient || !userId) {
      return [];
    }

    let query = supabaseClient
      .from("voice_submissions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (startDate) query = query.gte("submission_date", startDate);
    if (endDate) query = query.lte("submission_date", endDate);

    const { data, error } = await query;
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }

  window.starSpeakerSupabase = {
    isConfigured,
    getClient,
    getPublicClient,
    insertApplySubmission,
    uploadLevelTestRecording,
    insertLevelTestSubmission,
    getSession,
    exchangeRecoveryCode,
    verifyRecoveryToken,
    setRecoverySession,
    signInStudent,
    signOutStudent,
    sendPasswordReset,
    updateStudentPassword,
    getStudentProfile,
    updateStudentLoginTimestamps,
    insertPortalEvent,
    uploadVoiceSubmissionAudio,
    insertVoiceSubmission,
    getVoiceSubmissions,
  };
})();
