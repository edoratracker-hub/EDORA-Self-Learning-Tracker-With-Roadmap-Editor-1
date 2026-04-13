// seed.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "./schema";
import { db } from "@/drizzle/db";
async function seed() {

    // First, create a test user (you may already have one)
    const testUserId = '723df208-9fdd-4393-9780-7b99caa42680'; // Replace with actual user ID from your auth system

    // Course 1: Full Stack Web Development
    const roadmap1 = await db.insert(schema.roadmaps).values({
        userId: testUserId,
        role: 'student',
        goal: 'Become a Full Stack Web Developer in 6 months',
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning();

    // Milestones for Web Development
    const webDevMilestones = await db.insert(schema.milestones).values([
        {
            roadmapId: roadmap1[0].id,
            category: 'academic',
            title: 'HTML & CSS Fundamentals',
            description: 'Master the basics of web structure and styling',
            status: 'completed',
            date: '2024-01-15',
            progress: 100,
            videoId: 'UB1O30fR-EE', // HTML Crash Course
            order: 1
        },
        {
            roadmapId: roadmap1[0].id,
            category: 'skills',
            title: 'JavaScript Core Concepts',
            description: 'Learn modern JavaScript ES6+ features and concepts',
            status: 'in-progress',
            date: '2024-02-01',
            progress: 65,
            videoId: 'PkZNo7MFNFg', // JavaScript Crash Course
            order: 2
        },
        {
            roadmapId: roadmap1[0].id,
            category: 'skills',
            title: 'React.js Mastery',
            description: 'Build dynamic user interfaces with React',
            status: 'upcoming',
            date: '2024-03-01',
            progress: 0,
            videoId: 'w7ejDZ8SWv8', // React Tutorial
            order: 3
        },
        {
            roadmapId: roadmap1[0].id,
            category: 'career',
            title: 'Node.js & Express Backend',
            description: 'Create REST APIs and server-side applications',
            status: 'upcoming',
            date: '2024-04-01',
            progress: 0,
            videoId: 'Oe421EPjeBE', // Node.js Tutorial
            order: 4
        },
        {
            roadmapId: roadmap1[0].id,
            category: 'academic',
            title: 'Database Management',
            description: 'Work with PostgreSQL and MongoDB',
            status: 'upcoming',
            date: '2024-05-01',
            progress: 0,
            videoId: '4Z9KEBexzcM', // PostgreSQL Tutorial
            order: 5
        }
    ]).returning();

    // Tasks for HTML/CSS Milestone
    await db.insert(schema.milestoneTasks).values([
        {
            milestoneId: webDevMilestones[0].id,
            title: 'Complete HTML tags and elements tutorial',
            completed: true
        },
        {
            milestoneId: webDevMilestones[0].id,
            title: 'Build a personal portfolio page with HTML',
            completed: true
        },
        {
            milestoneId: webDevMilestones[0].id,
            title: 'Master CSS selectors and box model',
            completed: true
        },
        {
            milestoneId: webDevMilestones[0].id,
            title: 'Create responsive layouts with Flexbox',
            completed: true
        }
    ]);

    // Tasks for JavaScript Milestone
    await db.insert(schema.milestoneTasks).values([
        {
            milestoneId: webDevMilestones[1].id,
            title: 'Variables, data types, and operators',
            completed: true
        },
        {
            milestoneId: webDevMilestones[1].id,
            title: 'Functions and scope',
            completed: true
        },
        {
            milestoneId: webDevMilestones[1].id,
            title: 'Arrays and objects methods',
            completed: false
        },
        {
            milestoneId: webDevMilestones[1].id,
            title: 'Promises and async/await',
            completed: false
        }
    ]);

    // Tasks for React Milestone
    await db.insert(schema.milestoneTasks).values([
        {
            milestoneId: webDevMilestones[2].id,
            title: 'Components and props',
            completed: false
        },
        {
            milestoneId: webDevMilestones[2].id,
            title: 'State and lifecycle',
            completed: false
        },
        {
            milestoneId: webDevMilestones[2].id,
            title: 'Hooks (useState, useEffect)',
            completed: false
        }
    ]);

    // Create exam for HTML/CSS Milestone
    const exam1 = await db.insert(schema.exams).values({
        milestoneId: webDevMilestones[0].id,
        title: 'HTML & CSS Fundamentals Assessment',
        pointsPossible: 100
    }).returning();

    // Exam questions
    await db.insert(schema.examQuestions).values([
        {
            examId: exam1[0].id,
            questionText: 'Which HTML tag is used to create a hyperlink?',
            options: JSON.stringify(['<link>', '<a>', '<href>', '<nav>']),
            correctAnswer: '<a>'
        },
        {
            examId: exam1[0].id,
            questionText: 'What does CSS stand for?',
            options: JSON.stringify([
                'Computer Style Sheets',
                'Cascading Style Sheets',
                'Creative Style Sheets',
                'Colorful Style Sheets'
            ]),
            correctAnswer: 'Cascading Style Sheets'
        },
        {
            examId: exam1[0].id,
            questionText: 'Which property is used to change the background color in CSS?',
            options: JSON.stringify(['color', 'bgcolor', 'background-color', 'background']),
            correctAnswer: 'background-color'
        },
        {
            examId: exam1[0].id,
            questionText: 'Which HTML element is used for the largest heading?',
            options: JSON.stringify(['<heading>', '<h1>', '<h6>', '<head>']),
            correctAnswer: '<h1>'
        }
    ]);

    // Course 2: Data Science & Machine Learning
    const roadmap2 = await db.insert(schema.roadmaps).values({
        userId: testUserId,
        role: 'professional',
        goal: 'Master Data Science and ML in 8 months',
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning();

    const dsMilestones = await db.insert(schema.milestones).values([
        {
            roadmapId: roadmap2[0].id,
            category: 'academic',
            title: 'Python Programming Basics',
            description: 'Learn Python fundamentals for data science',
            status: 'completed',
            date: '2024-01-10',
            progress: 100,
            videoId: 'r-uOLxNrN-k', // Python for Beginners
            order: 1
        },
        {
            roadmapId: roadmap2[0].id,
            category: 'skills',
            title: 'NumPy & Pandas Mastery',
            description: 'Data manipulation and analysis libraries',
            status: 'in-progress',
            date: '2024-02-15',
            progress: 40,
            videoId: 'QUT1VHiLmmI', // Pandas Tutorial
            order: 2
        },
        {
            roadmapId: roadmap2[0].id,
            category: 'academic',
            title: 'Data Visualization',
            description: 'Create compelling visualizations with Matplotlib and Seaborn',
            status: 'upcoming',
            date: '2024-03-20',
            progress: 0,
            videoId: 'UQH7w4t5W3k', // Data Visualization
            order: 3
        }
    ]).returning();

    // Tasks for Python Milestone
    await db.insert(schema.milestoneTasks).values([
        {
            milestoneId: dsMilestones[0].id,
            title: 'Python syntax and basic operations',
            completed: true
        },
        {
            milestoneId: dsMilestones[0].id,
            title: 'Control flow and functions',
            completed: true
        },
        {
            milestoneId: dsMilestones[0].id,
            title: 'File handling and exceptions',
            completed: true
        }
    ]);

    // Tasks for NumPy/Pandas Milestone
    await db.insert(schema.milestoneTasks).values([
        {
            milestoneId: dsMilestones[1].id,
            title: 'NumPy arrays and operations',
            completed: true
        },
        {
            milestoneId: dsMilestones[1].id,
            title: 'Pandas Series and DataFrames',
            completed: false
        },
        {
            milestoneId: dsMilestones[1].id,
            title: 'Data cleaning and preprocessing',
            completed: false
        }
    ]);

    // Create exam for Python Milestone
    const exam2 = await db.insert(schema.exams).values({
        milestoneId: dsMilestones[0].id,
        title: 'Python Programming Fundamentals Exam',
        pointsPossible: 100
    }).returning();

    await db.insert(schema.examQuestions).values([
        {
            examId: exam2[0].id,
            questionText: 'Which of the following is a mutable data type in Python?',
            options: JSON.stringify(['Tuple', 'String', 'List', 'Integer']),
            correctAnswer: 'List'
        },
        {
            examId: exam2[0].id,
            questionText: 'What is the output of print(2 ** 3)?',
            options: JSON.stringify(['6', '8', '9', '5']),
            correctAnswer: '8'
        },
        {
            examId: exam2[0].id,
            questionText: 'Which method is used to add an element to a list?',
            options: JSON.stringify(['add()', 'append()', 'insert()', 'push()']),
            correctAnswer: 'append()'
        }
    ]);

    // Course 3: Mobile App Development (React Native)
    const roadmap3 = await db.insert(schema.roadmaps).values({
        userId: testUserId,
        role: 'student',
        goal: 'Build and publish 3 cross-platform mobile apps',
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning();

    const mobileMilestones = await db.insert(schema.milestones).values([
        {
            roadmapId: roadmap3[0].id,
            category: 'academic',
            title: 'React Native Fundamentals',
            description: 'Core concepts of React Native development',
            status: 'completed',
            date: '2024-01-20',
            progress: 100,
            videoId: '0-S5a0eXPoc', // React Native Tutorial
            order: 1
        },
        {
            roadmapId: roadmap3[0].id,
            category: 'skills',
            title: 'Navigation & State Management',
            description: 'Implement routing and state in React Native',
            status: 'in-progress',
            date: '2024-02-25',
            progress: 30,
            videoId: '8I1Nog8YF2w', // React Navigation
            order: 2
        },
        {
            roadmapId: roadmap3[0].id,
            category: 'career',
            title: 'App Publishing & Deployment',
            description: 'Publish apps to App Store and Play Store',
            status: 'upcoming',
            date: '2024-04-15',
            progress: 0,
            videoId: 'Xw/tabHY3j4', // Publishing React Native Apps
            order: 3
        }
    ]).returning();

    // Tasks for React Native Milestone
    await db.insert(schema.milestoneTasks).values([
        {
            milestoneId: mobileMilestones[0].id,
            title: 'Set up React Native environment',
            completed: true
        },
        {
            milestoneId: mobileMilestones[0].id,
            title: 'Core components (View, Text, ScrollView)',
            completed: true
        },
        {
            milestoneId: mobileMilestones[0].id,
            title: 'Styling and Flexbox in React Native',
            completed: true
        },
        {
            milestoneId: mobileMilestones[0].id,
            title: 'Handle user input with TextInput',
            completed: true
        }
    ]);

    // Tasks for Navigation Milestone
    await db.insert(schema.milestoneTasks).values([
        {
            milestoneId: mobileMilestones[1].id,
            title: 'Install and configure React Navigation',
            completed: true
        },
        {
            milestoneId: mobileMilestones[1].id,
            title: 'Stack and Tab navigators',
            completed: false
        },
        {
            milestoneId: mobileMilestones[1].id,
            title: 'Pass data between screens',
            completed: false
        }
    ]);

    // Create exam for React Native Fundamentals
    const exam3 = await db.insert(schema.exams).values({
        milestoneId: mobileMilestones[0].id,
        title: 'React Native Basics Assessment',
        pointsPossible: 100
    }).returning();

    await db.insert(schema.examQuestions).values([
        {
            examId: exam3[0].id,
            questionText: 'Which component is used for scrolling content in React Native?',
            options: JSON.stringify(['<View>', '<ScrollView>', '<FlatList>', 'Both B and C']),
            correctAnswer: 'Both B and C'
        },
        {
            examId: exam3[0].id,
            questionText: 'How do you apply styles in React Native?',
            options: JSON.stringify([
                'Using CSS classes',
                'Using the style prop with JavaScript objects',
                'Using external CSS files',
                'Using inline HTML styles'
            ]),
            correctAnswer: 'Using the style prop with JavaScript objects'
        },
        {
            examId: exam3[0].id,
            questionText: 'Which component is used for navigation in React Native?',
            options: JSON.stringify([
                'React Router',
                'React Navigation',
                'Native Router',
                'Navigation Component'
            ]),
            correctAnswer: 'React Navigation'
        }
    ]);

    // Sample exam attempt (optional)
    await db.insert(schema.examAttempts).values({
        userId: testUserId,
        examId: exam1[0].id,
        score: 85,
        answers: JSON.stringify(['<a>', 'Cascading Style Sheets', 'background-color', '<h1>']),
        completedAt: new Date()
    });

    console.log('Seed data inserted successfully!');
}

seed().catch(console.error);