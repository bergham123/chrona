// ================================================================
// src/handlers.js (أضف هذه الدوال في نهاية الملف قبل أقسام المشرف)
// ================================================================

export async function handleUpdateProfile(request, env, username) {
  const body = await request.json();
  const { email, phone, telegramId } = body;
  
  const users = await getAllUsers(env);
  const user = users[username];
  if (!user) return jsonResponse({ error: "User not found" }, 404);

  if (email) {
    const { validateEmail } = await import('./helpers.js');
    const emailErr = validateEmail(email);
    if (emailErr) return jsonResponse({ error: emailErr }, 400);
    // التحقق مما إذا كان الإيميل مستخدم من قبل شخص آخر
    const taken = Object.values(users).find(u => u.email === email && u.username !== username);
    if (taken) return jsonResponse({ error: "Email already in use" }, 409);
    user.email = email;
  }

  user.phone = phone || "";
  if (telegramId !== undefined) user.telegramId = telegramId;

  users[username] = user;
  await saveAllUsers(env, users);

  return jsonResponse({ 
    success: true, 
    message: "Profile updated", 
    profile: { email: user.email, phone: user.phone, telegramId: user.telegramId } 
  });
}

export async function handleUpdatePassword(request, env, username) {
  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword) return jsonResponse({ error: "Both passwords are required" }, 400);
  
  const { validatePassword } = await import('./helpers.js');
  const passErr = validatePassword(newPassword);
  if (passErr) return jsonResponse({ error: passErr }, 400);

  const users = await getAllUsers(env);
  const user = users[username];
  if (!user) return jsonResponse({ error: "User not found" }, 404);

  const { verifyPassword } = await import('./helpers.js');
  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return jsonResponse({ error: "Current password is incorrect" }, 401);

  const { hashPassword } = await import('./helpers.js');
  user.passwordHash = await hashPassword(newPassword);
  users[username] = user;
  await saveAllUsers(env, users);
  
  return jsonResponse({ success: true, message: "Password updated successfully" });
}
