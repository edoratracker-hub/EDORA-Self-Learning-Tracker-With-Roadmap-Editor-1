"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  Search,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteUser,
  deleteUsers,
  updateUserRole,
} from "@/app/actions/admin-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
  createdAt: any;
}

interface UserTableProps {
  initialUsers: User[];
}

export const UserTable = ({ initialUsers }: UserTableProps) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const handleDelete = async () => {
    if (!userToDelete) return;
    const res = await deleteUser(userToDelete);
    if (res.success) {
      setUsers(users.filter((u) => u.id !== userToDelete));
      toast.success("User deleted successfully");
    } else {
      toast.error(res.error || "Failed to delete user");
    }
    setUserToDelete(null);
  };

  const handleBulkDelete = async () => {
    const res = await deleteUsers(selectedUsers);
    if (res.success) {
      setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
      toast.success("Users deleted successfully");
    } else {
      toast.error(res.error || "Failed to delete users");
    }
    setIsBulkDeleting(false);
  };

  const handleUpdateRole = async (userId: string, role: any) => {
    const res = await updateUserRole(userId, role);
    if (res.success) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
      toast.success(`User role updated to ${role}`);
    } else {
      toast.error(res.error || "Failed to update user role");
    }
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500 hover:bg-red-600">Admin</Badge>;
      case "mentor":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Mentor</Badge>;
      case "student":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Student</Badge>
        );
      case "recruiter":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600">Recruiter</Badge>
        );
      case "professional":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            Professional
          </Badge>
        );
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {selectedUsers.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBulkDeleting(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedUsers.length})
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedUsers.length === filteredUsers.length &&
                    filteredUsers.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="group transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">
                        {user.name || "Anonymous"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setViewingUser(user)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleUpdateRole(user.id, "admin")}
                        >
                          Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateRole(user.id, "mentor")}
                        >
                          Mentor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateRole(user.id, "student")}
                        >
                          Student
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateRole(user.id, "recruiter")}
                        >
                          Recruiter
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateRole(user.id, "professional")
                          }
                        >
                          Professional
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setUserToDelete(user.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User details dialog */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user.
            </DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserIcon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {viewingUser.name || "Anonymous"}
                  </h3>
                  <p className="text-muted-foreground">{viewingUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 bg-muted/50">
                <div>
                  <p className="text-xs uppercase text-muted-foreground font-semibold">
                    Role
                  </p>
                  <div className="mt-1">{getRoleBadge(viewingUser.role)}</div>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground font-semibold">
                    User ID
                  </p>
                  <p className="mt-1 truncate text-sm font-mono">
                    {viewingUser.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground font-semibold">
                    Joined Date
                  </p>
                  <p className="mt-1 text-sm">
                    {new Date(viewingUser.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground font-semibold">
                    Status
                  </p>
                  <Badge variant="outline" className="mt-1">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldCheck className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="py-4">
              Are you sure you want to delete this user? This action cannot be
              undone and all associated data will be removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              No, Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk delete confirmation dialog */}
      <Dialog
        open={isBulkDeleting}
        onOpenChange={() => setIsBulkDeleting(false)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Bulk Delete Users
            </DialogTitle>
            <DialogDescription className="py-4">
              Are you sure you want to delete{" "}
              <span className="font-bold text-foreground">
                {selectedUsers.length}
              </span>{" "}
              selected users? This action is permanent.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsBulkDeleting(false)}>
              No, Keep Users
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Yes, Delete All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
