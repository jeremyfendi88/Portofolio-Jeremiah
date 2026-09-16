import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export interface ContactMessage {
  id?: number | string;
  name: string;
  email: string;
  scope: string;
  message: string;
  created_at?: string;
}

export interface SubmissionResult {
  success: boolean;
  destination: 'supabase' | 'local';
  message: string;
}

const LOCAL_STORAGE_KEY = 'jeremiah_portfolio_contacts';

export async function submitContactInquiry(
  data: Omit<ContactMessage, 'id' | 'created_at'>
): Promise<SubmissionResult> {
  const supabase = getSupabase();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('messages').insert([
        {
          name: data.name.trim(),
          email: data.email.trim(),
          scope: data.scope,
          message: data.message.trim(),
        },
      ]);

      if (error) {
        console.warn('Supabase insert notice (falling back to local storage):', error.message);
        saveToLocalStorage(data);
        return {
          success: true,
          destination: 'local',
          message: 'Saved locally (Supabase table pending).',
        };
      }

      return {
        success: true,
        destination: 'supabase',
        message: 'Message stored directly in Supabase database!',
      };
    } catch (err) {
      console.warn('Network error reaching Supabase, using fallback storage:', err);
      saveToLocalStorage(data);
      return {
        success: true,
        destination: 'local',
        message: 'Saved in offline storage.',
      };
    }
  }

  // Fallback when Supabase keys are not configured yet
  saveToLocalStorage(data);
  return {
    success: true,
    destination: 'local',
    message: 'Message received and stored locally.',
  };
}

function saveToLocalStorage(data: Omit<ContactMessage, 'id' | 'created_at'>): void {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const newEntry: ContactMessage = {
      ...data,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    existing.push(newEntry);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Could not save to localStorage:', e);
  }
}
