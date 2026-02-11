'use client';
import { useState } from 'react';
import { BookOpen, Clock, Target, Award, PlayCircle, CheckCircle, Lock, Star, Users } from 'lucide-react';

export default function LearningPaths() {
  const [selectedPath, setSelectedPath] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set());

  const learningPaths = [
    {
      id: 1,
      title: 'Frontend Development Mastery',
      description: 'Complete frontend development from basics to advanced',
      duration: '3 months',
      difficulty: 'intermediate',
      modules: 8,
      completedModules: 3,
      totalLessons: 45,
      completedLessons: 12,
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
      rating: 4.8,
      enrolled: 2341,
      icon: '🎨',
      progress: 27
    },
    {
      id: 2,
      title: 'Backend Development with Node.js',
      description: 'Build scalable backend applications with Node.js and Express',
      duration: '4 months',
      difficulty: 'intermediate',
      modules: 10,
      completedModules: 0,
      totalLessons: 60,
      completedLessons: 0,
      skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Authentication'],
      rating: 4.7,
      enrolled: 1876,
      icon: '⚙️',
      progress: 0
    },
    {
      id: 3,
      title: 'Full Stack JavaScript',
      description: 'Become a full stack developer with modern JavaScript technologies',
      duration: '6 months',
      difficulty: 'advanced',
      modules: 12,
      completedModules: 1,
      totalLessons: 80,
      completedLessons: 8,
      skills: ['React', 'Node.js', 'MongoDB', 'GraphQL', 'Docker'],
      rating: 4.9,
      enrolled: 3124,
      icon: '🚀',
      progress: 10
    },
    {
      id: 4,
      title: 'DevOps and Cloud Computing',
      description: 'Learn deployment, CI/CD, and cloud services',
      duration: '2 months',
      difficulty: 'advanced',
      modules: 6,
      completedModules: 0,
      totalLessons: 30,
      completedLessons: 0,
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Monitoring'],
      rating: 4.6,
      enrolled: 987,
      icon: '☁️',
      progress: 0
    }
  ];

  const pathDetails = {
    1: {
      modules: [
        {
          id: 1,
          title: 'HTML & CSS Fundamentals',
          lessons: 6,
          completedLessons: 6,
          duration: '2 weeks',
          difficulty: 'beginner',
          locked: false
        },
        {
          id: 2,
          title: 'JavaScript Basics',
          lessons: 8,
          completedLessons: 6,
          duration: '3 weeks',
          difficulty: 'beginner',
          locked: false
        },
        {
          id: 3,
          title: 'Advanced JavaScript',
          lessons: 10,
          completedLessons: 0,
          duration: '4 weeks',
          difficulty: 'intermediate',
          locked: false
        },
        {
          id: 4,
          title: 'React Fundamentals',
          lessons: 8,
          completedLessons: 0,
          duration: '3 weeks',
          difficulty: 'intermediate',
          locked: true
        },
        {
          id: 5,
          title: 'Advanced React',
          lessons: 7,
          completedLessons: 0,
          duration: '3 weeks',
          difficulty: 'advanced',
          locked: true
        },
        {
          id: 6,
          title: 'State Management',
          lessons: 6,
          completedLessons: 0,
          duration: '2 weeks',
          difficulty: 'intermediate',
          locked: true
        },
        {
          id: 7,
          title: 'Testing & Debugging',
          lessons: 5,
          completedLessons: 0,
          duration: '2 weeks',
          difficulty: 'intermediate',
          locked: true
        },
        {
          id: 8,
          title: 'Capstone Project',
          lessons: 5,
          completedLessons: 0,
          duration: '3 weeks',
          difficulty: 'advanced',
          locked: true
        }
      ]
    }
  };

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (selectedPath) {
    const path = learningPaths.find(p => p.id === selectedPath);
    const modules = pathDetails[selectedPath]?.modules || [];

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPath(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Back
            </button>
            <div className="text-3xl">{path.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{path.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{path.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              {renderStars(path.rating)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{path.enrolled} enrolled</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{path.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${path.progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Course Modules</h4>
          {modules.map((module, index) => (
            <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => !module.locked && toggleModule(module.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    module.completedLessons === module.lessons 
                      ? 'bg-green-100 text-green-600' 
                      : module.locked 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {module.completedLessons === module.lessons ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : module.locked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">
                      {module.title}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{module.lessons} lessons</span>
                      <span>•</span>
                      <span>{module.duration}</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {module.completedLessons}/{module.lessons}
                  </div>
                  {!module.locked && (
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${(module.completedLessons / module.lessons) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {expandedModules.has(module.id) && !module.locked && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    {Array.from({ length: module.lessons }, (_, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          i < module.completedLessons
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {i < module.completedLessons && (
                            <CheckCircle className="h-2 w-2 text-white fill-current" />
                          )}
                        </div>
                        <span className={`${
                          i < module.completedLessons
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          Lesson {i + 1}: {['Introduction', 'Core Concepts', 'Practical Examples', 'Advanced Topics', 'Best Practices', 'Exercises'][i % 6]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Learning Paths</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <BookOpen className="h-4 w-4" />
          <span>{learningPaths.length} paths</span>
        </div>
      </div>

      <div className="space-y-4">
        {learningPaths.map(path => (
          <div key={path.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{path.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{path.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{path.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {path.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {path.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
                      +{path.skills.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{path.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{path.modules} modules</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(path.rating)}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Progress</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{path.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {path.enrolled.toLocaleString()} enrolled
                  </span>
                  <button
                    onClick={() => setSelectedPath(path.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    {path.progress > 0 ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Learning Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-600" />
            <span>Certificates of completion</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-600" />
            <span>Real-world projects</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span>Community support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
