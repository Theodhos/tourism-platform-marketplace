"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarDays, KeyRound, Mail, ShieldCheck, User2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Props = {
  user: {
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt?: string | Date;
  };
};

export default function ProfilePanel({ user }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const memberSince = useMemo(() => {
    if (!user.createdAt) return "Now";
    return new Date(user.createdAt).toLocaleDateString();
  }, [user.createdAt]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Profile update failed");
      }

      toast.success(data.passwordChanged ? "Profile and password updated" : "Profile updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="surface p-6">
      <div className="flex items-center gap-2">
        <User2 className="h-5 w-5 text-brand-600" />
        <div>
          <p className="eyebrow">Profile & security</p>
          <h2 className="text-2xl font-black text-slate-950">Personal information</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Name", value: user.name, icon: User2 },
          { label: "Email", value: user.email, icon: Mail },
          { label: "Password", value: "••••••••", icon: KeyRound },
          { label: "Member since", value: memberSince, icon: CalendarDays }
        ].map((item) => (
          <div key={item.label} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
            <item.icon className="h-5 w-5 text-brand-600" />
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
            <p className="mt-1 break-words text-sm font-bold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Full name" value={name} onChange={(event) => setName(event.target.value)} required />
          <Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-600" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Change password</p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Input
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Enter current password"
            />
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 6 characters"
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat new password"
            />
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Leave password fields empty if you only want to update your name or email.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving changes..." : "Save profile"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setName(user.name);
              setEmail(user.email);
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </section>
  );
}
