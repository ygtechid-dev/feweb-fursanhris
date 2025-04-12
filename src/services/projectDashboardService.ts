import axiosInstance from "@/libs/axios";

// Type definitions
export interface ProjectStats {
  active: number;
  on_hold: number;
  completed: number;
  total: number;
}

export interface TaskStats {
  todo: number;
  in_progress: number;
  in_review: number;
  done: number;
  total: number;
}

export interface PriorityStats {
  high: number;
  medium: number;
  low: number;
}

export interface Activity {
  id: number;
  type: 'task' | 'project';
  action: 'completed' | 'created' | 'commented' | 'assigned' | 'updated';
  name: string;
  user: string;
  time: string;
}

export interface DeadlineTask {
  id: number;
  name: string;
  project: string;
  dueDate: string;
}

export interface DashboardStats {
  projects: ProjectStats;
  tasks: TaskStats;
  priorities: PriorityStats;
  upcomingDeadlines: DeadlineTask[];
}

export interface ProjectCompletion {
  name: string;
  completion: number;
}

// Interface for dashboard query parameters
export interface DashboardQueryParams {
  projectId?: number;
}

// Dashboard API functions
export const getProject = async (params?: DashboardQueryParams): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/project-dashboard/show', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard project:', error);
    throw error;
  }
};

export const getDashboardStats = async (params?: DashboardQueryParams): Promise<DashboardStats> => {
  try {
    const response = await axiosInstance.get('/web/project-dashboard/stats', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getProjectCompletionData = async (params?: DashboardQueryParams): Promise<ProjectCompletion[]> => {
  try {
    const response = await axiosInstance.get('/web/project-dashboard/project-completion', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching project completion data:', error);
    throw error;
  }
};

export const getRecentActivities = async (limit: number = 5, params?: DashboardQueryParams): Promise<Activity[]> => {
  try {
    const response = await axiosInstance.get('/web/project-dashboard/recent-activities', {
      params: { 
        limit,
        ...params 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};
