
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function AccountView() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-4 bg-white rounded-lg shadow">
        {user && (
          <div className="mb-6">
            <p className="text-gray-600">Email: {user.email}</p>
          </div>
        )}
        <Button 
          variant="destructive" 
          onClick={handleSignOut}
          className="mt-4"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}
