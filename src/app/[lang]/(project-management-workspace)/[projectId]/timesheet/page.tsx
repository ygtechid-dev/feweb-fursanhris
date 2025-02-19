'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, MoreHorizontal, ChevronLeft } from 'lucide-react';

type ExpandedEpics = {
  [key: string]: boolean;
};

interface Task {
  id: string;
  title: string;
  status: 'DONE' | 'TO DO';
}

interface Epic {
  id: string;
  title: string;
  type: 'epic';
  tasks: Task[];
}

const Timeline: React.FC = () => {
  const [expandedEpics, setExpandedEpics] = useState<ExpandedEpics>({
    'SCRUM-1': true,
    'SCRUM-2': true
  });

  // Get current date and generate date range
  const today = new Date();
  const generateDateRange = () => {
    const dates = [];
    const startDate = new Date(today.getFullYear(), today.getMonth(), 15); // Start from 15th
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dateRange = generateDateRange();

  const toggleEpic = (epicId: string): void => {
    setExpandedEpics(prev => ({
      ...prev,
      [epicId]: !prev[epicId]
    }));
  };

  const tasks: Epic[] = [
    {
      id: 'SCRUM-1',
      title: 'Goals management',
      type: 'epic',
      tasks: [
        { id: 'SCRUM-5', title: 'Create Goals Modal/Pop up', status: 'DONE' },
        { id: 'SCRUM-6', title: 'Filtering Goals', status: 'DONE' },
        { id: 'SCRUM-7', title: 'Edit Goal Modal/Pop Up', status: 'DONE' },
        { id: 'SCRUM-8', title: 'Detail Goal Screen', status: 'TO DO' },
        { id: 'SCRUM-9', title: 'Integrate Create Goal with Chat GPT', status: 'TO DO' },
        { id: 'SCRUM-12', title: 'Delete Goal', status: 'DONE' },
      ]
    },
    {
      id: 'SCRUM-2',
      title: 'Task Management',
      type: 'epic',
      tasks: [
        { id: 'SCRUM-10', title: 'Edit Task Screen', status: 'TO DO' },
        { id: 'SCRUM-11', title: 'Delete Task', status: 'TO DO' },
        { id: 'SCRUM-13', title: 'List Tasks Screen', status: 'TO DO' },
      ]
    },
    {
      id: 'SCRUM-3',
      title: 'Progress Tracking',
      type: 'epic',
      tasks: []
    },
    {
      id: 'SCRUM-4',
      title: 'Calendar Page',
      type: 'epic',
      tasks: []
    },
    {
      id: 'SCRUM-15',
      title: 'Dashboard Page',
      type: 'epic',
      tasks: []
    }
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Timeline</h1>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Give feedback
            </button>
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Share
            </button>
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Export
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search timeline"
            className="px-3 py-1.5 border rounded-md w-64"
          />
          <select className="px-3 py-1.5 border rounded-md">
            <option>Status category</option>
          </select>
          <select className="px-3 py-1.5 border rounded-md">
            <option>Epic</option>
          </select>
        </div>
      </div>

      {/* Timeline header with dates */}
      <div className="border-b">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
          <div className="w-72">Sprints</div>
          <div className="flex-1 overflow-x-auto">
            <div className="flex min-w-full">
              {dateRange.map((date, index) => (
                <div 
                  key={index}
                  className="flex-none w-8 text-xs text-center border-l first:border-l-0"
                >
                  <div className="font-medium">
                    {date.getDate()}
                  </div>
                  <div className="text-gray-500">
                    {index === 0 || date.getDate() === 1 ? date.toLocaleString('default', { month: 'short' }) : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {tasks.map((epic) => (
            <div key={epic.id} className="border-b last:border-b-0">
              <div className="flex">
                <div className="w-72">
                  <div 
                    className="flex items-center py-2 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleEpic(epic.id)}
                  >
                    <button className="p-1">
                      {expandedEpics[epic.id] ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </button>
                    <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center mx-2">
                      <span className="text-purple-700 text-sm">E</span>
                    </div>
                    <span className="text-sm font-medium">{epic.id}</span>
                    <span className="ml-2 text-sm">{epic.title}</span>
                  </div>
                </div>
                
                {/* Timeline grid for epic */}
                <div className="flex-1">
                  <div className="h-8 flex">
                    {dateRange.map((_, index) => (
                      <div key={index} className="flex-none w-8 border-l first:border-l-0" />
                    ))}
                  </div>
                </div>
              </div>
              
              {expandedEpics[epic.id] && epic.tasks.length > 0 && (
                <div className="ml-8">
                  {epic.tasks.map((task) => (
                    <div key={task.id} className="flex">
                      <div className="w-64 py-1">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                            <span className="text-green-700 text-sm">T</span>
                          </div>
                          <span className="ml-2 text-sm font-medium">{task.id}</span>
                          <span className="ml-2 text-sm">{task.title}</span>
                        </div>
                      </div>
                      
                      {/* Timeline grid for task */}
                      <div className="flex-1">
                        <div className="h-8 flex">
                          {dateRange.map((_, index) => (
                            <div key={index} className="flex-none w-8 border-l first:border-l-0" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="mt-4 flex items-center text-sm text-blue-600 hover:underline">
          <Plus className="w-4 h-4 mr-1" />
          Create Epic
        </button>
      </div>

      {/* Timeline controls */}
      <div className="border-t p-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="px-3 py-1 text-sm border rounded">Today</button>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm border rounded">Weeks</button>
          <button className="px-3 py-1 text-sm border rounded">Months</button>
          <button className="px-3 py-1 text-sm border rounded">Quarters</button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
