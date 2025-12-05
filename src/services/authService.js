import { storage } from '../utils/helpers';

const encryptPassword = (password) => {
  return btoa(password);
};

const decryptPassword = (encrypted) => {
  try {
    return atob(encrypted);
  } catch {
    return null;
  }
};

const generateToken = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId,
    exp: Date.now() + (24 * 60 * 60 * 1000),
    iat: Date.now()
  }));
  const signature = btoa(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
};

const validateToken = (token) => {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
};

const getUserIdFromToken = (token) => {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return payload.userId;
  } catch {
    return null;
  }
};

export const authService = {
  register: async (userData) => {
    try {
      const users = storage.get('users') || [];
      
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, message: 'User with this email already exists' };
      }

      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: encryptPassword(userData.password),
        role: userData.role || 'student',
        department: userData.department || '',
        phone: userData.phone || '',
        profileImage: userData.profileImage || null,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        preferences: {
          notifications: true,
          emailAlerts: true,
          theme: 'light'
        }
      };

      users.push(newUser);
      storage.set('users', users);

      // Create token
      const token = generateToken(newUser.id);

      // Store login session
      const sessions = storage.get('sessions') || [];
      sessions.push({
        userId: newUser.id,
        token,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
      storage.set('sessions', sessions);

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return { 
        success: true, 
        user: userWithoutPassword, 
        token,
        message: 'Registration successful!' 
      };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  },

  // Login user
  login: async (email, password, rememberMe = false) => {
    try {
      const users = storage.get('users') || [];
      const user = users.find(u => u.email === email);

      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      const decryptedPassword = decryptPassword(user.password);
      if (decryptedPassword !== password) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex] = user;
      storage.set('users', users);

      // Create token
      const token = generateToken(user.id);

      // Store login session
      const sessions = storage.get('sessions') || [];
      sessions.push({
        userId: user.id,
        token,
        rememberMe,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString()
      });
      storage.set('sessions', sessions);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return { 
        success: true, 
        user: userWithoutPassword, 
        token,
        message: 'Login successful!' 
      };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  },

  // Logout user
  logout: () => {
    const token = storage.get('token');
    if (token) {
      // Remove session
      let sessions = storage.get('sessions') || [];
      sessions = sessions.filter(s => s.token !== token);
      storage.set('sessions', sessions);
    }
    
    storage.remove('token');
    storage.remove('user');
    return { success: true, message: 'Logged out successfully' };
  },

  // Verify token
  verifyToken: (token) => {
    if (!validateToken(token)) {
      return { success: false, message: 'Invalid or expired token' };
    }

    const userId = getUserIdFromToken(token);
    const users = storage.get('users') || [];
    const user = users.find(u => u.id === userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  },

  // Get current user
  getCurrentUser: () => {
    const token = storage.get('token');
    if (!token) return null;

    const result = authService.verifyToken(token);
    return result.success ? result.user : null;
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      const users = storage.get('users') || [];
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      // Prevent updating sensitive fields
      delete updates.password;
      delete updates.id;
      delete updates.createdAt;

      users[userIndex] = { ...users[userIndex], ...updates };
      storage.set('users', users);

      const { password: _, ...userWithoutPassword } = users[userIndex];
      return { success: true, user: userWithoutPassword, message: 'Profile updated successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (userId, oldPassword, newPassword) => {
    try {
      const users = storage.get('users') || [];
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      const user = users[userIndex];
      const decryptedPassword = decryptPassword(user.password);

      if (decryptedPassword !== oldPassword) {
        return { success: false, message: 'Current password is incorrect' };
      }

      users[userIndex].password = encryptPassword(newPassword);
      storage.set('users', users);

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to change password' };
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const users = storage.get('users') || [];
      const user = users.find(u => u.email === email);

      if (!user) {
        // Don't reveal if user exists
        return { success: true, message: 'If the email exists, a reset link has been sent' };
      }

      // Generate reset token
      const resetToken = btoa(`${user.id}:${Date.now()}`);
      
      // Store reset token
      const resetTokens = storage.get('resetTokens') || [];
      resetTokens.push({
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
      });
      storage.set('resetTokens', resetTokens);

      // In real app, send email here
      console.log('Password reset token:', resetToken);

      return { 
        success: true, 
        message: 'If the email exists, a reset link has been sent',
        resetToken // In real app, this would be sent via email
      };
    } catch (error) {
      return { success: false, message: 'Failed to process password reset' };
    }
  },

  // Reset password with token
  resetPassword: async (resetToken, newPassword) => {
    try {
      const resetTokens = storage.get('resetTokens') || [];
      const tokenData = resetTokens.find(t => t.token === resetToken);

      if (!tokenData) {
        return { success: false, message: 'Invalid reset token' };
      }

      if (new Date(tokenData.expiresAt) < new Date()) {
        return { success: false, message: 'Reset token has expired' };
      }

      const users = storage.get('users') || [];
      const userIndex = users.findIndex(u => u.id === tokenData.userId);

      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      users[userIndex].password = encryptPassword(newPassword);
      storage.set('users', users);

      // Remove used token
      const updatedTokens = resetTokens.filter(t => t.token !== resetToken);
      storage.set('resetTokens', updatedTokens);

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to reset password' };
    }
  },

  // Verify email (simulation)
  verifyEmail: async (userId) => {
    try {
      const users = storage.get('users') || [];
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      users[userIndex].emailVerified = true;
      storage.set('users', users);

      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to verify email' };
    }
  },

  // Get all users (admin only)
  getAllUsers: () => {
    const users = storage.get('users') || [];
    return users.map(({ password: _, ...user }) => user);
  }
};
