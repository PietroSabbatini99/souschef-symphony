
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { DietaryPreferences } from '@/components/dashboard/analytics/types';

export function useUserPreferences() {
  const [userPreferences, setUserPreferences] = useState<DietaryPreferences>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('dietary_preferences')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.dietary_preferences) {
          const prefs = data.dietary_preferences as DietaryPreferences;
          setUserPreferences(prefs);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };
    
    fetchUserPreferences();
  }, [user]);

  return { userPreferences };
}
