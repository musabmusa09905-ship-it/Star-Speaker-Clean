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
        detectSessionInUrl: false,
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

  window.starSpeakerSupabase = {
    isConfigured,
    getClient,
    getPublicClient,
    insertApplySubmission,
    uploadLevelTestRecording,
    insertLevelTestSubmission,
    getSession,
    signInStudent,
    signOutStudent,
    getStudentProfile,
    updateStudentLoginTimestamps,
    insertPortalEvent,
  };
})();
