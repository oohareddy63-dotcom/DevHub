'use client';
import { useState } from 'react';
import { Award, Trophy, Star, Target, Zap, Shield, Heart, Code, Users, Calendar } from 'lucide-react';

export default function AchievementBadges({ userAchievements = [], userStats = {}, compact = false }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const allBadges = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Complete your profile',
      icon: Target,
      category: 'onboarding',
      rarity: 'common',
      points: 10,
      unlocked: true,
      progress: 100,
      requirement: 'Add profile picture, bio, and skills'
    },
    {
      id: 2,
      name: 'Skill Builder',
      description: 'Add 5 skills to your profile',
      icon: Star,
      category: 'skills',
      rarity: 'common',
      points: 25,
      unlocked: true,
      progress: 100,
      requirement: 'Add at least 5 skills with levels'
    },
    {
      id: 3,
      name: 'Social Butterfly',
      description: 'Connect with 10 people',
      icon: Users,
      category: 'social',
      rarity: 'common',
      points: 30,
      unlocked: false,
      progress: 60,
      requirement: 'Send and receive 10 connection requests'
    },
    {
      id: 4,
      name: 'Knowledge Sharer',
      description: 'Create 10 build logs',
      icon: Code,
      category: 'content',
      rarity: 'uncommon',
      points: 50,
      unlocked: false,
      progress: 30,
      requirement: 'Share your learning journey with 10 build logs'
    },
    {
      id: 5,
      name: 'Helping Hand',
      description: 'Help 5 developers',
      icon: Heart,
      category: 'community',
      rarity: 'uncommon',
      points: 75,
      unlocked: false,
      progress: 40,
      requirement: 'Provide help on 5 different build logs'
    },
    {
      id: 6,
      name: 'Consistent Learner',
      description: 'Login for 30 consecutive days',
      icon: Calendar,
      category: 'engagement',
      rarity: 'rare',
      points: 100,
      unlocked: false,
      progress: 23,
      requirement: 'Login every day for a month'
    },
    {
      id: 7,
      name: 'Mentor Material',
      description: 'Get 25 endorsements',
      icon: Shield,
      category: 'recognition',
      rarity: 'rare',
      points: 150,
      unlocked: false,
      progress: 12,
      requirement: 'Receive 25 endorsements on your skills'
    },
    {
      id: 8,
      name: 'Speed Demon',
      description: 'Complete a skill in record time',
      icon: Zap,
      category: 'achievement',
      rarity: 'epic',
      points: 200,
      unlocked: false,
      progress: 0,
      requirement: 'Complete a learning path faster than 95% of users'
    },
    {
      id: 9,
      name: 'Master Developer',
      description: 'Reach advanced level in 5 skills',
      icon: Trophy,
      category: 'mastery',
      rarity: 'legendary',
      points: 500,
      unlocked: false,
      progress: 20,
      requirement: 'Achieve advanced level in 5 different skills'
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-800 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'onboarding': return Target;
      case 'skills': return Star;
      case 'social': return Users;
      case 'content': return Code;
      case 'community': return Heart;
      case 'engagement': return Calendar;
      case 'recognition': return Shield;
      case 'achievement': return Zap;
      case 'mastery': return Trophy;
      default: return Award;
    }
  };

  const filteredBadges = selectedBadge
    ? allBadges.filter(badge => badge.category === selectedBadge)
    : allBadges;

  const categories = [...new Set(allBadges.map(badge => badge.category))];

  const totalPoints = allBadges
    .filter(badge => badge.unlocked)
    .reduce((sum, badge) => sum + badge.points, 0);

  const unlockedCount = allBadges.filter(badge => badge.unlocked).length;
  const totalCount = allBadges.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Achievement Badges</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <Trophy className="h-4 w-4" />
            <span className="font-medium">{totalPoints} pts</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {unlockedCount}/{totalCount} unlocked
          </div>
        </div>
      </div>

      <div className="filters-container">
        <button
          onClick={() => setSelectedBadge(null)}
          className={`filter-btn ${!selectedBadge ? 'active' : ''}`}
        >
          All ({totalCount})
        </button>
        {categories.map(category => {
          const count = allBadges.filter(badge => badge.category === category).length;
          const unlocked = allBadges.filter(badge => badge.category === category && badge.unlocked).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedBadge(category)}
              className={`filter-btn ${selectedBadge === category ? 'active' : ''}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} ({unlocked}/{count})
            </button>
          );
        })}
      </div>

      <div className="badges-container">
        {filteredBadges.map(badge => {
          const IconComponent = badge.icon;
          return (
            <div
              key={badge.id}
              className={`badge-card transition-all ${badge.unlocked
                ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md cursor-pointer'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-60'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full border flex-shrink-0 ${badge.unlocked
                  ? getRarityColor(badge.rarity)
                  : 'bg-gray-100 text-gray-400 border-gray-300'
                  }`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {badge.name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {badge.points} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {badge.description}
                  </p>

                  {!badge.unlocked && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-1 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </span>
                    {badge.unlocked && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1 flex-shrink-0">
                        <span>✓</span> Unlocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">How to Earn Badges</h4>
        <div className={`grid gap-2 text-sm text-gray-600 dark:text-gray-400 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full"></div>
            <span>Common: Complete basic tasks (10-30 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full"></div>
            <span>Uncommon: Help others (25-75 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full"></div>
            <span>Rare: Consistent effort (50-150 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded-full"></div>
            <span>Epic: Exceptional achievements (100-200 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-full"></div>
            <span>Legendary: Master status (200-500 pts)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
