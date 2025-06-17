import { create } from "zustand";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * Zustand store for authentication management.
 * Manages user state, login/logout, and authentication loading/error states.
 * @typedef {Object} AuthStore
 * @property {object|null} user - The authenticated user's data, or null if not logged in.
 * @property {boolean} isLoggedIn - True if a user is currently logged in, false otherwise.
 * @property {boolean} authLoading - True if an authentication operation is in progress, false otherwise.
 * @property {string|null} authError - Any error message from authentication operations, or null if no error.
 * @property {function(boolean): void} setAuthLoading - Function to set the authLoading state.
 * @property {function(string|null): void} setAuthError - Function to set the authError state.
 * @property {function(object|null): void} setUser - Function to set the authenticated user's data.
 * @property {function(string): Promise<object|null>} fetchUserProfileFromFirestore - Fetches additional user profile data from Firestore.
 * @property {function(string, string): Promise<object>} loginUser - Handles user login with email and password.
 * @property {function(): Promise<void>} logoutUser - Handles user logout.
 * @property {function(): void} initializeAuthListener - Initializes the Firebase authentication state listener.
 */
const useAuthStore = create((set, get) => ({
  user: null,
  isLoggedIn: false,
  authLoading: true,
  authError: null,

  /**
   * Sets the authentication loading state.
   * @param {boolean} isLoading - True if an authentication operation is in progress, false otherwise.
   */
  setAuthLoading: (isLoading) => set({ authLoading: isLoading }),

  /**
   * Sets the authentication error message.
   * @param {string|null} error - The error message, or null if no error.
   */
  setAuthError: (error) => set({ authError: error }),

  /**
   * Sets the authenticated user's data and updates the isLoggedIn state.
   * @param {object|null} userData - The user's data object, or null if no user.
   */
  setUser: (userData) => {
    set({ user: userData, isLoggedIn: !!userData });
  },

  /**
   * Fetches additional user profile data from Firestore based on the user's UID.
   * @param {string} uid - The unique ID of the user.
   * @returns {Promise<object|null>} A promise that resolves with the user's custom profile data, or null if not found or an error occurs.
   */
  fetchUserProfileFromFirestore: async (uid) => {
    if (!uid) return null;
    const userDocRef = doc(db, "users", uid);
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data();
      } else {
        console.warn("No additional user data found in Firestore for UID:", uid);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore for UID:", uid, error);
      return null;
    }
  },

  /**
   * Handles user login with email and password.
   * Authenticates the user with Firebase, fetches their custom profile,
   * combines the data, and updates the store's state. Also handles cart merging
   * and subscription if `_mergeCarts` and `_subscribeToUserCart` functions exist in the store.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<object>} A promise that resolves with the combined user data upon successful login.
   * @throws {Error} If the login process fails.
   */
  loginUser: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseAuthUser = userCredential.user;

      const customUserProfile = await get().fetchUserProfileFromFirestore(firebaseAuthUser.uid);
      const combinedUserData = {
        uid: firebaseAuthUser.uid,
        email: firebaseAuthUser.email,
        displayName: firebaseAuthUser.displayName,
        photoURL: firebaseAuthUser.photoURL,
        username: customUserProfile ? customUserProfile.username : null,
        createdAt: customUserProfile ? customUserProfile.createdAt : null,
      };

      set({
        user: combinedUserData,
        isLoggedIn: true,
        authLoading: false,
      });

      return combinedUserData;
    } catch (error) {
      console.error("Auth Error (from store):", error.message);
      set({ authError: error.message, authLoading: false, user: null, isLoggedIn: false });
      throw error;
    }
  },

  /**
   * Handles user logout.
   * Signs out the user from Firebase, unsubscribes from cart updates if `_unsubscribeFromCart` exists,
   * and resets the store's authentication and cart states.
   * @returns {Promise<void>} A promise that resolves when the user is successfully logged out.
   * @throws {Error} If the logout process fails.
   */
  logoutUser: async () => {
    set({ authLoading: true, authError: null });
    try {
      await signOut(auth);
      get()._unsubscribeFromCart();
      set({ user: null, isLoggedIn: false, authLoading: false, cart: [] });
    } catch (error) {
      console.error("Logout Error (from store):", error.message);
      set({ authError: error.message, authLoading: false });
      throw error;
    }
  },

  /**
   * Initializes the Firebase authentication state listener.
   * This listener will automatically update the store's user and isLoggedIn states
   * whenever the Firebase authentication state changes (e.g., on page load,
   * or when a user logs in/out from another tab).
   * It also fetches custom user profile data from Firestore if a user is logged in.
   */
  initializeAuthListener: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Firebase Auth State Changed: User logged in.", user.uid);
        const customUserProfile = await get().fetchUserProfileFromFirestore(user.uid);
        const combinedUserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          username: customUserProfile ? customUserProfile.username : null,
          createdAt: customUserProfile ? customUserProfile.createdAt : null,
        };
        set({ user: combinedUserData, isLoggedIn: true });
      } else {
        console.log("Firebase Auth State Changed: User logged out or no user.");
        set({ user: null, isLoggedIn: false });
      }
      set({ authLoading: false });
    });
  },
}));

export default useAuthStore;
