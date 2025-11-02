import { PitchRecord } from '../types';

const USERS_KEY = 'pitchPerfectUsers';
const SESSION_KEY = 'pitchPerfectSession';

// Helper to get all users from localStorage
const getUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
};

// Helper to save all users to localStorage
const saveUsers = (users: any) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signUp = (email: string, password: string): { success: boolean; message: string } => {
    const users = getUsers();
    if (users[email]) {
        return { success: false, message: 'User with this email already exists.' };
    }
    users[email] = { password, history: [] };
    saveUsers(users);
    return { success: true, message: 'Sign up successful! Please log in.' };
};

export const login = (email: string, password: string): { success: boolean; message: string } => {
    const users = getUsers();
    const user = users[email];
    if (!user || user.password !== password) {
        return { success: false, message: 'Invalid email or password.' };
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    return { success: true, message: 'Login successful!' };
};

export const logout = () => {
    localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): { email: string } | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

export const getPitchHistory = (): PitchRecord[] => {
    const user = getCurrentUser();
    if (!user) return [];
    const users = getUsers();
    return users[user.email]?.history || [];
};

export const savePitchToHistory = (pitchRecord: PitchRecord) => {
    const user = getCurrentUser();
    if (!user) return;
    const users = getUsers();
    if (users[user.email]) {
        let history = users[user.email].history || [];
        history.unshift(pitchRecord); // Add to the beginning
        if (history.length > 10) {
            history = history.slice(0, 10); // Keep only the last 10
        }
        users[user.email].history = history;
        saveUsers(users);
    }
};