'use client';
import { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Building, ExternalLink } from 'lucide-react';

export default function JobBoard() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: '$120k - $180k',
      skills: ['React', 'TypeScript', 'Node.js'],
      description: 'Looking for experienced frontend developer to lead our UI team.',
      posted: '2 days ago',
      logo: '🏢'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'full-time',
      salary: '$90k - $130k',
      skills: ['JavaScript', 'Python', 'AWS'],
      description: 'Join our growing team and help build the future of fintech.',
      posted: '1 week ago',
      logo: '🚀'
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'DesignHub',
      location: 'New York, NY',
      type: 'contract',
      salary: '$80 - $120/hr',
      skills: ['React', 'CSS', 'UI/UX'],
      description: 'Need a React expert for our new design system project.',
      posted: '3 days ago',
      logo: '🎨'
    },
    {
      id: 4,
      title: 'Junior Developer',
      company: 'LearnTech',
      location: 'Austin, TX',
      type: 'internship',
      salary: '$20 - $30/hr',
      skills: ['JavaScript', 'HTML', 'CSS'],
      description: 'Great opportunity for beginners to learn and grow.',
      posted: '1 day ago',
      logo: '📚'
    }
  ];

  const filteredJobs = mockJobs.filter(job => {
    const matchesFilter = filter === 'all' || job.type === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getTypeColor = (type) => {
    switch(type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'internship': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Job Board</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Briefcase className="h-4 w-4" />
          <span>{filteredJobs.length} jobs</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search jobs, companies, or skills..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{job.logo}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{job.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.posted}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 ml-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(job.type)}`}>
                  {job.type.replace('-', ' ')}
                </span>
                <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                  <ExternalLink className="h-3 w-3" />
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">No jobs found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
