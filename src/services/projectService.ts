import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  objective: string;
  features: string[];
  image_label?: string;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [];

let cachedProjects: ProjectItem[] = [];

export async function getProjects(): Promise<ProjectItem[]> {
  const supabase = getSupabase();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        cachedProjects = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          tags: Array.isArray(item.tags) ? item.tags : [],
          objective: item.objective || '',
          features: Array.isArray(item.features) ? item.features : [],
          image_label: item.image_label,
        }));
        return cachedProjects;
      }
    } catch (err) {
      console.warn('Using default projects fallback:', err);
    }
  }

  return cachedProjects;
}

export function findProjectById(id: number): ProjectItem | undefined {
  return cachedProjects.find((p) => p.id === id);
}
