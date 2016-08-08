'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: 'mongodb://localhost/bop-test',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  s3: {
    region: 'us-west-1',
    bucket: 'digital-platform-test-files',
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.cwd(),
        fileName: 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: false, // activate to use rotating logs
          fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: 'daily',
          verbose: false
        }
      }
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Test Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    admin: process.env.MAILER_ADMIN || 'Billion Oyster Project <bop@fearless.tech>',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      },
      ses: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_AMAZON_KEY',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_AMAZON_SECRET_KEY'
      }
    }
  },
  seedDB: {
    //seed: process.env.MONGO_SEED === 'true' ? true : false,
    seed: true,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedOrganization: {
        name: 'Org1',
        organizationType: 'school',
        description: 'Test Organization',
        streetAddress: '123 Main St',
        city: 'Anytown',
        state: 'NY',
        latitude: 39.765,
        longitude: -76.234,
        pending: false
      },
      seedTeam: {
        name: 'Test Team'
      },
      seedStation: {
        name: 'Test Station',
        latitude: 39.765,
        longitude: -76.234,
        bodyOfWater: 'Test Body of Water',
        status: 'Active',
        photo: {
          originalname: 'water.jpg',
          mimetype: 'image/jpeg',
          filename:'31c11c686cf6373172e6d95fdaf6aeb9',
          path: 'http://s3-us-west-1.amazonaws.com/digital-platform-dev-files/uploads/restoration-stations/img/station/31c11c686cf6373172e6d95fdaf6aeb9.jpg'
        }
      },
      seedUserLeader: {
        username: 'teacher',
        provider: 'local',
        email: 'teacher@localhost.com',
        firstName: 'Teacher',
        lastName: 'Local',
        displayName: 'Teacher Local',
        teamLeadType: 'teacher',
        roles: ['user', 'team lead']
      },
      seedUserMember1: {
        username: 'student1',
        provider: 'local',
        email: 'student1@localhost.com',
        firstName: 'Student1',
        lastName: 'Local',
        displayName: 'Student1 Local',
        roles: ['user', 'team member']
      },
      seedUserMember2: {
        username: 'student2',
        provider: 'local',
        email: 'student2@localhost.com',
        firstName: 'Student2',
        lastName: 'Local',
        displayName: 'Student2 Local',
        roles: ['user', 'team member']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  },
  // This config is set to true during grunt coverage
  coverage: process.env.COVERAGE || false
};
