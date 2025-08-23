export interface Manager {
  id: string
  name: string
  email: string
  branch: "Noida" | "Gurgaon" | "Central Delhi"
  password: string
  createdAt: string
}

export interface ManagerSession {
  managerId: string
  name: string
  branch: string
  email: string
}

const STORAGE_KEY = "honda_managers"
const SESSION_KEY = "honda_manager_session"

export function getManagers(): Manager[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveManager(manager: Omit<Manager, "id" | "createdAt">): { success: boolean; message: string } {
  const managers = getManagers()

  // Check if branch already has a manager
  const branchExists = managers.find((m) => m.branch === manager.branch)
  if (branchExists) {
    return { success: false, message: `Manager already exists for ${manager.branch} branch` }
  }

  // Check if email already exists
  const emailExists = managers.find((m) => m.email === manager.email)
  if (emailExists) {
    return { success: false, message: "Email already registered" }
  }

  const newManager: Manager = {
    ...manager,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  managers.push(newManager)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(managers))
  return { success: true, message: "Manager registered successfully" }
}

export function loginManager(
  email: string,
  password: string,
): { success: boolean; manager?: ManagerSession; message: string } {
  const managers = getManagers()
  const manager = managers.find((m) => m.email === email && m.password === password)

  if (!manager) {
    return { success: false, message: "Invalid email or password" }
  }

  const session: ManagerSession = {
    managerId: manager.id,
    name: manager.name,
    branch: manager.branch,
    email: manager.email,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { success: true, manager: session, message: "Login successful" }
}

export function getManagerSession(): ManagerSession | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(SESSION_KEY)
  return stored ? JSON.parse(stored) : null
}

export function logoutManager(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getAvailableBranches(): string[] {
  const managers = getManagers()
  const occupiedBranches = managers.map((m) => m.branch)
  const allBranches = ["Noida", "Gurgaon", "Central Delhi"]
  return allBranches.filter((branch) => !occupiedBranches.includes(branch as any))
}
