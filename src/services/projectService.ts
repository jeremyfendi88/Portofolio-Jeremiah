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

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: 'Personal Portfolio Website',
    description: 'A responsive single-page personal portfolio designed to present personal information, skills, projects, and contact information in a professional digital format.',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    objective: 'To build a clean, modern, and accessible single-page web portfolio showcasing academic background, digital capabilities, and practical projects.',
    features: [
      'Fully responsive layout with sticky navigation and mobile slide-down drawer',
      'Dark / Light theme switcher with preference stored in localStorage',
      'Animated skill competency progress indicators triggered upon viewport entry',
      'Dynamic project detail modal dialog with keyboard ESC and backdrop dismiss',
      'Client-side validated contact inquiry form with clear user feedback',
    ],
  },
  {
    id: 2,
    title: 'Business Data Dashboard',
    description: 'A conceptual dashboard designed to organize and visualize business-related information in a clear and accessible interface.',
    tags: ['Data Visualization', 'UI Design', 'Business Analytics'],
    objective: 'To design and structure an analytical dashboard interface that consolidates core business KPIs, inventory metrics, and decision-support figures into clean visual modules.',
    features: [
      'Modular KPI metric summary cards for quick managerial review',
      'Responsive data chart layouts and structured analytical components',
      'Filterable data views and segment status highlights',
      'Clear visual hierarchy optimized for fast scanning and reporting',
    ],
  },
  {
    id: 3,
    title: 'Business Landing Page',
    description: 'A modern landing page concept designed to communicate a business value proposition and guide visitors toward a clear call to action.',
    tags: ['HTML5', 'CSS3', 'Responsive Design'],
    objective: 'To create a high-converting digital landing page tailored for modern business ventures, emphasizing clarity, value proposition, and user experience.',
    features: [
      'High-impact split-screen hero section communicating immediate value',
      'Product capability and customer trust endorsement blocks',
      'Optimized Call-to-Action pathways driving user engagement',
      'Mobile-first responsive styling ensuring consistency on all viewports',
    ],
  },
];

let cachedProjects: ProjectItem[] = [...DEFAULT_PROJECTS];

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
