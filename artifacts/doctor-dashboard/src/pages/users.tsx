import { useState } from "react";
import {
  useListUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@workspace/api-client-react";
import { RefreshCw } from "lucide-react";
import type { UserResponse, CreateUserRequest, UpdateUserRequest } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListUsersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Pencil, Trash2, ShieldCheck, Shield } from "lucide-react";
import { useGetMe } from "@workspace/api-client-react";

type UserFormData = {
  username: string;
  password: string;
  name: string;
  email: string;
  specialty: string;
  role: "admin" | "moderator";
};

const BLANK_FORM: UserFormData = {
  username: "",
  password: "",
  name: "",
  email: "",
  specialty: "",
  role: "moderator",
};

function generateSecurePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "@#$%!";
  const all = upper + lower + digits + special;

  function randomIndex(max: number): number {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  }

  const password = [
    upper[randomIndex(upper.length)],
    lower[randomIndex(lower.length)],
    digits[randomIndex(digits.length)],
    special[randomIndex(special.length)],
  ];
  for (let i = 0; i < 8; i++) {
    password.push(all[randomIndex(all.length)]);
  }

  const shuffle = new Uint32Array(password.length);
  crypto.getRandomValues(shuffle);
  return password
    .map((char, i) => ({ char, sort: shuffle[i] }))
    .sort((a, b) => a.sort - b.sort)
    .map((x) => x.char)
    .join("");
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: me } = useGetMe();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<UserFormData>(BLANK_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: users = [], isLoading } = useListUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  function openCreate() {
    setEditingId(null);
    setForm(BLANK_FORM);
    setFormError(null);
    setDialogOpen(true);
  }

  function openEdit(user: UserResponse) {
    setEditingId(user.id);
    setForm({
      username: user.username,
      password: "",
      name: user.name,
      email: user.email,
      specialty: user.specialty ?? "",
      role: user.role as "admin" | "moderator",
    });
    setFormError(null);
    setDialogOpen(true);
  }

  function openDelete(userId: number) {
    setDeletingId(userId);
    setDeleteDialogOpen(true);
  }

  function handleField(field: keyof UserFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  }

  function handleSave() {
    if (!form.username.trim() || form.username.length < 3) {
      setFormError("Username must be at least 3 characters.");
      return;
    }
    if (!editingId && form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (editingId && form.password && form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      setFormError("A valid email is required.");
      return;
    }

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
    };

    if (editingId) {
      const body: UpdateUserRequest = {
        username: form.username,
        name: form.name,
        email: form.email,
        role: form.role,
      };
      if (form.specialty.trim()) body.specialty = form.specialty;
      if (form.password.trim()) body.password = form.password;

      updateUser.mutate(
        { userId: editingId, data: body },
        {
          onSuccess: () => {
            toast({ title: "User updated", description: `${form.name} has been updated.` });
            setDialogOpen(false);
            invalidate();
          },
          onError: (err: Error) => {
            setFormError(err.message || "Failed to update user.");
          },
        }
      );
    } else {
      const body: CreateUserRequest = {
        username: form.username,
        password: form.password,
        name: form.name,
        email: form.email,
        specialty: form.specialty || undefined,
        role: form.role,
      };
      createUser.mutate(
        { data: body },
        {
          onSuccess: () => {
            toast({ title: "User created", description: `${form.name} has been added.` });
            setDialogOpen(false);
            invalidate();
          },
          onError: (err: Error) => {
            setFormError(err.message || "Failed to create user.");
          },
        }
      );
    }
  }

  function handleDelete() {
    if (deletingId == null) return;
    deleteUser.mutate(
      { userId: deletingId },
      {
        onSuccess: () => {
          toast({ title: "User deleted", description: "The user has been removed." });
          setDeleteDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        },
        onError: (err: Error) => {
          toast({ title: "Cannot delete user", description: err.message || "Failed to delete user.", variant: "destructive" });
          setDeleteDialogOpen(false);
        },
      }
    );
  }

  const isMutating = createUser.isPending || updateUser.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage admin and moderator accounts</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-700">
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No users found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-slate-800">{user.name}</TableCell>
                    <TableCell className="text-slate-600 font-mono text-sm">{user.username}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{user.email}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{user.specialty || "—"}</TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 flex items-center gap-1 w-fit">
                          <ShieldCheck className="h-3 w-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex items-center gap-1 w-fit">
                          <Shield className="h-3 w-3" />
                          Moderator
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(user)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {user.id !== me?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDelete(user.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {formError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{formError}</div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleField("name", e.target.value)}
                  placeholder="Dr. Jane Smith"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Username</Label>
                <Input
                  value={form.username}
                  onChange={(e) => handleField("username", e.target.value)}
                  placeholder="jsmith"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleField("email", e.target.value)}
                placeholder="jsmith@hospital.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{editingId ? "New Password (optional)" : "Password"}</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={form.password}
                  onChange={(e) => handleField("password", e.target.value)}
                  placeholder={editingId ? "Leave blank to keep" : "Min. 6 characters"}
                  className="font-mono text-sm flex-1"
                />
                {!editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-1.5"
                    onClick={() => handleField("password", generateSecurePassword())}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Generate
                  </Button>
                )}
              </div>
              {!editingId && (
                <p className="text-xs text-slate-500">Generated password is visible so you can copy and share it with the new user.</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => handleField("role", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Specialty (optional)</Label>
              <Input
                value={form.specialty}
                onChange={(e) => handleField("specialty", e.target.value)}
                placeholder="Pediatric Neurology"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isMutating}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isMutating}>
              {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
