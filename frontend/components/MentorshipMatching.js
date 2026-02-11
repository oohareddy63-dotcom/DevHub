'use client';
import { useState } from 'react';
import { Users, Star, MessageCircle, Calendar, Award, Target } from 'lucide-react';

export default function MentorshipMatching() {
  const [filter, setFilter] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState(null);

  const mockMentors = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Frontend Engineer at Google',
      expertise: ['React', 'TypeScript', 'Performance'],
      rating: 4.9,
      reviews: 127,
      mentees: 23,
      availability: 'Weekends',
      price: '$50/hr',
      bio: 'Passionate about helping developers level up their frontend skills.',
      skills: ['React', 'TypeScript', 'Performance', 'CSS', 'Testing'],
      languages: ['English', 'Mandarin'],
      image: '👩‍💻'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      title: 'Full Stack Architect',
      expertise: ['Node.js', 'System Design', 'AWS'],
      rating: 4.8,
      reviews: 89,
      mentees: 15,
      availability: 'Evenings',
      price: '$60/hr',
      bio: '10+ years experience building scalable web applications.',
      skills: ['Node.js', 'AWS', 'Docker', 'MongoDB', 'System Design'],
      languages: ['English', 'Spanish'],
      image: '👨‍💼'
    },
    {
      id: 3,
      name: 'Emily Watson',
      title: 'UX Design Lead',
      expertise: ['UI/UX', 'Design Systems', 'Research'],
      rating: 4.7,
      reviews: 156,
      mentees: 31,
      availability: 'Flexible',
      price: '$45/hr',
      bio: 'Helping developers create beautiful and user-friendly interfaces.',
      skills: ['UI/UX', 'Figma', 'Research', 'Prototyping', 'Design Systems'],
      languages: ['English'],
      image: '👩‍🎨'
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'DevOps Engineer',
      expertise: ['DevOps', 'CI/CD', 'Kubernetes'],
      rating: 4.6,
      reviews: 67,
      mentees: 12,
      availability: 'Weekdays',
      price: '$55/hr',
      bio: 'Specializing in modern DevOps practices and cloud infrastructure.',
      skills: ['Kubernetes', 'Docker', 'CI/CD', 'AWS', 'Terraform'],
      languages: ['English', 'Korean'],
      image: '👨‍🔧'
    }
  ];

  const filteredMentors = filter === 'all' 
    ? mockMentors 
    : mockMentors.filter(mentor => 
        mentor.expertise.some(exp => exp.toLowerCase().includes(filter.toLowerCase()))
      );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Find a Mentor</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Users className="h-4 w-4" />
          <span>{filteredMentors.length} mentors available</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'React', 'Node.js', 'UI/UX', 'DevOps'].map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredMentors.map(mentor => (
          <div key={mentor.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{mentor.image}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{mentor.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{mentor.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {renderStars(mentor.rating)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mentor.rating} ({mentor.reviews} reviews)
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{mentor.bio}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {mentor.expertise.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{mentor.mentees} mentees</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{mentor.availability}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{mentor.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{mentor.languages.join(', ')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMentor(mentor)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    View Profile
                  </button>
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Mentor Profile: {selectedMentor.name}
              </h3>
              <button
                onClick={() => setSelectedMentor(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{selectedMentor.image}</div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedMentor.name}</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedMentor.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  {renderStars(selectedMentor.rating)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedMentor.rating} ({selectedMentor.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">About</h5>
                <p className="text-gray-700 dark:text-gray-300">{selectedMentor.bio}</p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Skills & Expertise</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedMentor.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Availability</h5>
                  <p className="text-gray-700 dark:text-gray-300">{selectedMentor.availability}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Session Price</h5>
                  <p className="text-gray-700 dark:text-gray-300">{selectedMentor.price}</p>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Languages</h5>
                <p className="text-gray-700 dark:text-gray-300">{selectedMentor.languages.join(', ')}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                  Book Session
                </button>
                <button className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredMentors.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">No mentors found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}
