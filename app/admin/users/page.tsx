'use client';

import { useEffect, useState } from 'react';
import { getUsers, updateUserRole, deleteUser } from '@/actions/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await getUsers({ limit: 100 });
    if (!res.error) setUsers(res.users);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    await updateUserRole(userId, role);
    toast.success('Role updated');
    fetchUsers();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Users</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Select value={u.role} onValueChange={(v) => handleRoleChange(u.id, v)}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DONOR">Donor</SelectItem>
                        <SelectItem value="NGO">NGO</SelectItem>
                        <SelectItem value="BENEFICIARY">Beneficiary</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.isActive ? "default" : "destructive"}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="text-red-500" onClick={async () => { await deleteUser(u.id); fetchUsers(); }}>Deactivate</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
