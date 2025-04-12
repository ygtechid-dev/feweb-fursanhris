import React from 'react';
import { Users, User, Mail, Building, Calendar } from 'lucide-react';
import { Project } from '@/types/projectTypes';

const ProjectMembersList = ({ project } : {project: Project | null}) => {
  if (!project || !project.members || project.members.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Project Members
        </h2>
        <p className="text-gray-500 text-sm">No members assigned to this project</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Users className="h-5 w-5 mr-2 text-blue-500" />
        Project Members ({project.members.length})
      </h2>
      
      <div className="space-y-4">
        {project.members.map((member) => (
          <div key={member.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex-shrink-0 mr-3">
              {member.avatar ? (
                <img 
                  src={member.avatar} 
                  alt={`${member.name}`} 
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-gray-900">
                {member.name}
              </h3>
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <Mail className="h-3 w-3 mr-1" /> {member.email}
              </div>
              <div className="text-xs text-gray-500 flex items-center mt-1">
                {member.type === 'company' ? (
                  <Building className="h-3 w-3 mr-1" />
                ) : (
                  <User className="h-3 w-3 mr-1" />
                )}
                {member.type.charAt(0).toUpperCase() + member.type.slice(1)}
              </div>
            </div>
            
            {/* <div className="text-xs text-gray-500 flex flex-col items-end">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Joined: {new Date(member?.employee_data?.dob || '').toLocaleDateString()}
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectMembersList;
