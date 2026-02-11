const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://oohareddy6362_db_user:csmjwmkvpy5Mh82K@link.wt9ykxr.mongodb.net/?appName=link')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if default user already exists
      const existingUser = await User.findOne({ email: 'devhub@example.com' });
      
      if (existingUser) {
        console.log('Default user already exists');
        process.exit(0);
      }
      
      // Create default user
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const defaultUser = new User({
        name: 'DevHub Developer',
        email: 'devhub@example.com',
        password: hashedPassword,
        headline: 'Full Stack Developer | Learning Enthusiast',
        location: 'San Francisco, CA',
        bio: 'Passionate about building skills and helping others learn. Love React, Node.js, and modern web development.',
        skills: [
          {
            name: 'JavaScript',
            level: 'advanced',
            endorsements: 5,
            proofs: ['https://github.com/devhub/js-projects']
          },
          {
            name: 'React',
            level: 'intermediate', 
            endorsements: 3,
            proofs: ['https://github.com/devhub/react-apps']
          },
          {
            name: 'Node.js',
            level: 'intermediate',
            endorsements: 2,
            proofs: ['https://github.com/devhub/backend-projects']
          }
        ],
        reputation: 150,
        level: 'intermediate',
        collaborators: [],
        collaborationRequests: []
      });
      
      await defaultUser.save();
      console.log('✅ Default user created successfully!');
      console.log('📧 Email: devhub@example.com');
      console.log('🔑 Password: password123');
      console.log('👤 Name: DevHub Developer');
      
    } catch (error) {
      console.error('❌ Error creating default user:', error);
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });
