import { useState } from "react";
import { useGetMe, useUpdateDoctorProfile, useChangeDoctorPassword } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all placeholder:text-slate-400 ${props.className ?? ""}`}
    />
  );
}

export default function SettingsPage() {
  const { data: user } = useGetMe();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateProfile = useUpdateDoctorProfile();
  const changePassword = useChangeDoctorPassword();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    specialty: "",
  });
  const [profileInitialized, setProfileInitialized] = useState(false);

  if (user && !profileInitialized) {
    setProfile({
      name: user.name ?? "",
      email: user.email ?? "",
      username: user.username ?? "",
      specialty: user.specialty ?? "",
    });
    setProfileInitialized(true);
  }

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function handleProfileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
    setProfileError(null);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswords((p) => ({ ...p, [e.target.name]: e.target.value }));
    setPasswordError(null);
  }

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim() || !profile.username.trim()) {
      setProfileError("Name, email, and username are required.");
      return;
    }
    updateProfile.mutate(
      { data: { name: profile.name.trim(), email: profile.email.trim(), username: profile.username.trim(), specialty: profile.specialty.trim() || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getMe"] });
          toast({ title: "Profile updated", description: "Your profile information has been saved." });
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to update profile.";
          setProfileError(msg);
        },
      }
    );
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    changePassword.mutate(
      { data: { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword, confirmPassword: passwords.confirmPassword } },
      {
        onSuccess: () => {
          setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
          toast({ title: "Password changed", description: "Your password has been updated successfully." });
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to change password.";
          setPasswordError(msg);
        },
      }
    );
  }

  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "DR";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account information and security.</p>
      </div>

      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xl shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-lg font-bold text-slate-800">{user?.name ? `Dr. ${user.name}` : "—"}</p>
          <p className="text-sm text-slate-500">{user?.email ?? "—"}</p>
          <p className="text-xs text-blue-600 font-semibold mt-0.5">{user?.specialty ?? "No specialty set"}</p>
        </div>
      </div>

      <SectionCard title="Profile Information" description="Update your name, email, username, and specialty.">
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="Full Name">
              <Input
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="e.g. Jane Smith"
                required
              />
            </FieldGroup>
            <FieldGroup label="Username">
              <Input
                name="username"
                value={profile.username}
                onChange={handleProfileChange}
                placeholder="e.g. jsmith"
                required
              />
            </FieldGroup>
          </div>
          <FieldGroup label="Email Address">
            <Input
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="e.g. jane@clinic.com"
              required
            />
          </FieldGroup>
          <FieldGroup label="Specialty (optional)">
            <Input
              name="specialty"
              value={profile.specialty}
              onChange={handleProfileChange}
              placeholder="e.g. Pediatric Neurology"
            />
          </FieldGroup>

          {profileError && (
            <p className="text-sm text-red-600 font-medium">{profileError}</p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all"
            >
              {updateProfile.isPending ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Change Password" description="Update your login password. You'll need to enter your current password to confirm.">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <FieldGroup label="Current Password">
            <Input
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter your current password"
              autoComplete="current-password"
              required
            />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="New Password">
              <Input
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                required
              />
            </FieldGroup>
            <FieldGroup label="Confirm New Password">
              <Input
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Repeat new password"
                autoComplete="new-password"
                required
              />
            </FieldGroup>
          </div>

          {passwordError && (
            <p className="text-sm text-red-600 font-medium">{passwordError}</p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all"
            >
              {changePassword.isPending ? "Changing…" : "Change Password"}
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
