import type { LoginCredentials } from "../types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseAuth, firestore } from "./firebase";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const VALID_EMAIL = "vendor@gmail.com";
const VALID_PASSWORD = "password123";
const ACCOUNTS_KEY = "e_pharmacy_accounts";

interface StoredAccount {
  email: string;
  salt: string;
  passwordHash: string;
  role?: "customer" | "pharmacy";
}

function isStoredAccount(value: unknown): value is StoredAccount {
  if (typeof value !== "object" || value === null) return false;
  const account = value as Record<string, unknown>;
  return (
    typeof account.email === "string" &&
    typeof account.salt === "string" &&
    typeof account.passwordHash === "string" &&
    (account.role === undefined ||
      account.role === "customer" ||
      account.role === "pharmacy")
  );
}

function getStoredAccounts(): StoredAccount[] {
  const storedAccounts = localStorage.getItem(ACCOUNTS_KEY);
  if (storedAccounts === null) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedAccounts);
  } catch {
    throw new Error(
      "Saved account data is invalid. Clear this site data and try again.",
    );
  }

  if (!Array.isArray(parsed) || !parsed.every(isStoredAccount)) {
    throw new Error(
      "Saved account data is invalid. Clear this site data and try again.",
    );
  }

  return parsed;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const input = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return toHex(new Uint8Array(digest));
}

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<{ token: string; email: string; role: "customer" | "pharmacy" }> {
  if (firebaseAuth && firestore) {
    const result = await signInWithEmailAndPassword(
      firebaseAuth,
      credentials.email.trim().toLowerCase(),
      credentials.password,
    );
    const profile = await getDoc(doc(firestore, "users", result.user.uid));
    const role = profile.data()?.role === "pharmacy" ? "pharmacy" : "customer";
    return {
      token: result.user.uid,
      email: result.user.email ?? credentials.email,
      role,
    };
  }

  await delay(400);
  const email = credentials.email.trim().toLowerCase();

  if (email === VALID_EMAIL && credentials.password === VALID_PASSWORD) {
    return { token: "mock-jwt-token", email, role: "pharmacy" };
  }

  const account = getStoredAccounts().find((stored) => stored.email === email);
  if (
    account &&
    (await hashPassword(credentials.password, account.salt)) ===
      account.passwordHash
  ) {
    return {
      token: `mock-jwt-token:${email}`,
      email,
      role: account.role ?? "customer",
    };
  }

  throw new Error("Email or password is incorrect.");
}

export async function registerRequest(
  credentials: LoginCredentials,
): Promise<{ token: string; email: string; role: "customer" | "pharmacy" }> {
  if (firebaseAuth && firestore) {
    const email = credentials.email.trim().toLowerCase();
    const result = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      credentials.password,
    );
    if (credentials.displayName)
      await updateProfile(result.user, {
        displayName: credentials.displayName,
      });
    const role = credentials.role ?? "customer";
    await setDoc(doc(firestore, "users", result.user.uid), {
      uid: result.user.uid,
      email,
      displayName: credentials.displayName ?? "",
      phone: credentials.phone ?? "",
      role,
      createdAt: new Date().toISOString(),
    });
    return { token: result.user.uid, email, role };
  }

  await delay(400);
  const email = credentials.email.trim().toLowerCase();
  const accounts = getStoredAccounts();

  if (
    email === VALID_EMAIL ||
    accounts.some((account) => account.email === email)
  ) {
    throw new Error("An account with this email already exists.");
  }

  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = toHex(saltBytes);
  const passwordHash = await hashPassword(credentials.password, salt);
  localStorage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify([
      ...accounts,
      { email, salt, passwordHash, role: credentials.role ?? "customer" },
    ]),
  );

  return {
    token: `mock-jwt-token:${email}`,
    email,
    role: credentials.role ?? "customer",
  };
}

export async function logoutRequest(): Promise<void> {
  if (firebaseAuth) {
    await signOut(firebaseAuth);
    return;
  }
  await delay(200);
}
