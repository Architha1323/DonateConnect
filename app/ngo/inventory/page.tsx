'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory</h1>
      <p className="text-muted-foreground">Manage collected items in your inventory</p>
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Inventory Management</h3>
          <p className="text-muted-foreground">Items collected from accepted donations will appear here. Use the Donations page to manage the donation workflow.</p>
        </CardContent>
      </Card>
    </div>
  );
}
