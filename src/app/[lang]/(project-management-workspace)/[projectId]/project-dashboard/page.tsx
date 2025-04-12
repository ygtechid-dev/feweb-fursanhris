'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, CheckCircle, AlertCircle, Circle, ListChecks, Briefcase, Users, RefreshCw, ListTodo, Loader, FolderKanban } from 'lucide-react';
import { Activity, DashboardStats, getDashboardStats, getProject, getProjectCompletionData, getRecentActivities, ProjectCompletion } from '@/services/projectDashboardService';
import { useParams, useSearchParams } from 'next/navigation';
import { Project } from '@/types/projectTypes';
import ProjectMembersList from '@/views/dashboards/projects/ProjectMembersList';
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext';

// Interface for chart data items
interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export default function Dashboard() {
  const { dictionary } = useDictionary();
  
  // State for dashboard data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Project | null>(null);
  const [statistics, setStatistics] = useState<DashboardStats | null>(null);
  const [projectCompletionData, setProjectCompletionData] = useState<ProjectCompletion[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  // Get search params for project ID filtering
  const searchParams = useParams();
  const projectId = searchParams.projectId;

  // Colors for charts
  const COLORS = {
    projects: ['#4CAF50', '#FFC107', '#2196F3'],
    tasks: ['#FF9800', '#3F51B5', '#673AB7', '#009688'],
    // Updated priority colors to match the function you provided
    priorities: ['#F44336', '#FF9800', '#4CAF50'] // Red for high, orange for medium, green for low
  };

  // Helper function to get priority color (based on your example)
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#F44336'; // error/red
      case 'medium':
        return '#FF9800'; // warning/orange
      case 'low':
        return '#4CAF50'; // success/green
      default:
        return '#2196F3'; // primary/blue
    }
  };

  // Function to get icon color based on priority
  const getPriorityIconColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-blue-500';
    }
  };

  // Fetch data on component mount or when projectId changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel with project ID filter if provided
        const params = projectId ? { projectId: Number(projectId) } : undefined;
        
        const [projectData, stats, completionData, activities] = await Promise.all([
          getProject(params),
          getDashboardStats(params),
          getProjectCompletionData(params),
          getRecentActivities(4, params) // Limit to 4 recent activities
        ]);
        
        setProject(projectData);
        setStatistics(stats);
        setProjectCompletionData(completionData);
        setRecentActivities(activities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // You could set some error state here
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [projectId]); // Re-fetch when projectId changes

  // Process chart data when statistics change
  const projectStatusData: ChartDataItem[] = statistics ? [
    { name: 'Active', value: statistics.projects.active, color: COLORS.projects[0] },
    { name: 'On Hold', value: statistics.projects.on_hold, color: COLORS.projects[1] },
    { name: 'Completed', value: statistics.projects.completed, color: COLORS.projects[2] }
  ] : [];

  const taskStatusData: ChartDataItem[] = statistics ? [
    { name: dictionary['content'].todoTasks, value: statistics.tasks.todo, color: COLORS.tasks[0] },
    { name: dictionary['content'].inProgressTasks, value: statistics.tasks.in_progress, color: COLORS.tasks[1] },
    { name: dictionary['content'].inReviewTasks, value: statistics.tasks.in_review, color: COLORS.tasks[2] },
    { name: dictionary['content'].completedTasks, value: statistics.tasks.done, color: COLORS.tasks[3] }
  ] : [];

  const priorityData: ChartDataItem[] = statistics ? [
    { name: dictionary['content'].highPriority || 'High', value: statistics.priorities.high, color: getPriorityColor('high') },
    { name: dictionary['content'].mediumPriority || 'Medium', value: statistics.priorities.medium, color: getPriorityColor('medium') },
    { name: dictionary['content'].lowPriority || 'Low', value: statistics.priorities.low, color: getPriorityColor('low') }
  ] : [];

  // Helper functions
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getActivityIcon = (type: 'task' | 'project', action: string) => {
    if (type === 'task') {
      if (action === 'completed') return <CheckCircle className="h-5 w-5 text-green-600" />;
      if (action === 'commented') return <Circle className="h-5 w-5 text-blue-500" />;
      if (action === 'assigned') return <Users className="h-5 w-5 text-purple-500" />;
      if (action === 'updated') return <ListChecks className="h-5 w-5 text-orange-500" />;
      return <ListChecks className="h-5 w-5 text-blue-500" />;
    } else {
      return <Briefcase className="h-5 w-5 text-indigo-600" />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-500">{dictionary['content'].loadingDashboardData || 'Loading dashboard data...'}</p>
        </div>
      </div>
    );
  }

  // If statistics aren't loaded yet
  if (!statistics) {
    return (
      <div className="p-3 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-500">{dictionary['content'].noDataAvailable || 'No data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {projectId ? (dictionary['content'].projectDashboard || 'Project Dashboard') : (dictionary['content'].projectManagementDashboard || 'Project Management Dashboard')} {project && ` - ${project.name}`}
        </h1>
        {projectId && (
          <a href={`/${searchParams?.lang}/projects`} className="flex items-center text-blue-600 hover:text-blue-800">
            <RefreshCw className="h-4 w-4 mr-1" /> {dictionary['content'].viewAllProjects || 'View All Projects'}
          </a>
        )}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{dictionary['content'].totalTasks || 'Total Tasks'}</p>
              <p className="text-2xl font-bold">{statistics.tasks.total}</p>
            </div>
            <ListChecks className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{dictionary['content'].todoTasks || 'To Do Tasks'}</p>
              <p className="text-2xl font-bold">{statistics.tasks.todo}</p>
            </div>
            <ListTodo className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{dictionary['content'].inProgressTasks || 'In Progress Tasks'}</p>
              <p className="text-2xl font-bold">{statistics.tasks.in_progress}</p>
            </div>
            <Loader className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{dictionary['content'].inReviewTasks || 'In Review Tasks'}</p>
              <p className="text-2xl font-bold">{statistics.tasks.in_review}</p>
            </div>
            <FolderKanban className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{dictionary['content'].completedTasks || 'Completed Tasks'}</p>
              <p className="text-2xl font-bold">{statistics.tasks.done}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{dictionary['content'].lowPriorityTasks || 'Low Priority Tasks'}</p>
              <p className="text-2xl font-bold">{statistics.priorities.low}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{dictionary['content'].mediumPriorityTasks || 'Medium Priority Tasks'}</p>
              <p className="text-2xl font-bold">{statistics.priorities.medium}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{dictionary['content'].highPriorityTasks || 'High Priority Tasks'}</p>
              <p className="text-2xl font-bold">{statistics.priorities.high}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Project Progress */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Task Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">{dictionary['content'].taskDistribution || 'Task Distribution'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">{dictionary['content'].byStatus || 'By Status'}</h3>
              {taskStatusData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-status-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-500 text-sm">{dictionary['content'].noTaskStatusData || 'No task status data'}</p>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">{dictionary['content'].byPriority || 'By Priority'}</h3>
              {priorityData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-priority-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-500 text-sm">{dictionary['content'].noPriorityData || 'No priority data'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed and Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">{dictionary['content'].recentActivities || 'Recent Activities'}</h2>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getActivityIcon(activity.type, activity.action)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      <span className="text-gray-900">{activity.user}</span>
                      <span className="text-gray-500"> {activity.action} </span>
                      <span className="text-gray-900">{activity.name}</span>
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" /> {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">{dictionary['content'].noRecentActivities || 'No recent activities'}</p>
            )}
          </div>
        </div>
        
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">{dictionary['content'].upcomingDeadlines || 'Upcoming Deadlines'}</h2>
          <div className="space-y-4">
            {statistics.upcomingDeadlines.length > 0 ? (
              statistics.upcomingDeadlines.map((task) => (
                <div key={task.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <Calendar className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.name}</p>
                    <p className="text-xs text-gray-600">{dictionary['content'].project || 'Project'}: {task.project}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      {dictionary['content'].due || 'Due'}: {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">{dictionary['content'].noUpcomingDeadlines || 'No upcoming deadlines'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <ProjectMembersList project={project} />
      </div>
    </div>
  );
}
