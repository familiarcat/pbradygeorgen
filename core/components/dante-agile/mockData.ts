/**
 * Mock data for the Dante Agile components
 */

// Mock sprint data
export const mockSprintData = {
  id: 'sprint-1',
  name: 'Sprint 1: The Beginning of the Journey',
  startDate: '2023-04-01',
  endDate: '2023-04-14',
  tasks: [
    {
      id: 'task-1',
      name: 'Fix authentication bug',
      realm: 'inferno',
      level: 5,
      status: 'completed',
      date: '2023-04-02'
    },
    {
      id: 'task-2',
      name: 'Optimize database queries',
      realm: 'purgatorio',
      level: 2,
      status: 'in-progress',
      date: '2023-04-03'
    },
    {
      id: 'task-3',
      name: 'Implement new user dashboard',
      realm: 'paradiso',
      level: 3,
      status: 'todo',
      date: '2023-04-05'
    },
    {
      id: 'task-4',
      name: 'Fix security vulnerability',
      realm: 'inferno',
      level: 8,
      status: 'in-progress',
      date: '2023-04-04'
    },
    {
      id: 'task-5',
      name: 'Refactor legacy code',
      realm: 'purgatorio',
      level: 1,
      status: 'completed',
      date: '2023-04-06'
    },
    {
      id: 'task-6',
      name: 'Add new feature',
      realm: 'paradiso',
      level: 4,
      status: 'review',
      date: '2023-04-07'
    },
    {
      id: 'task-7',
      name: 'Fix UI bug',
      realm: 'inferno',
      level: 2,
      status: 'completed',
      date: '2023-04-08'
    },
    {
      id: 'task-8',
      name: 'Improve error handling',
      realm: 'purgatorio',
      level: 3,
      status: 'todo',
      date: '2023-04-09'
    },
    {
      id: 'task-9',
      name: 'Implement new API endpoint',
      realm: 'paradiso',
      level: 2,
      status: 'in-progress',
      date: '2023-04-10'
    },
    {
      id: 'task-10',
      name: 'Fix memory leak',
      realm: 'inferno',
      level: 6,
      status: 'completed',
      date: '2023-04-11'
    }
  ],
  features: [
    {
      id: 'feature-1',
      name: 'User Authentication',
      teamMembers: [
        { id: 'member-1', name: 'John Doe' },
        { id: 'member-2', name: 'Jane Smith' }
      ],
      progress: {
        inferno: 80,
        purgatorio: 60,
        paradiso: 40,
        overall: 65
      }
    },
    {
      id: 'feature-2',
      name: 'Dashboard UI',
      teamMembers: [
        { id: 'member-3', name: 'Bob Johnson' },
        { id: 'member-4', name: 'Alice Williams' }
      ],
      progress: {
        inferno: 100,
        purgatorio: 75,
        paradiso: 50,
        overall: 70
      }
    },
    {
      id: 'feature-3',
      name: 'API Integration',
      teamMembers: [
        { id: 'member-1', name: 'John Doe' },
        { id: 'member-5', name: 'Charlie Brown' }
      ],
      progress: {
        inferno: 60,
        purgatorio: 40,
        paradiso: 20,
        overall: 40
      }
    }
  ],
  pairSessions: [
    {
      id: 'pair-1',
      members: [
        { id: 'member-1', name: 'John Doe' },
        { id: 'member-2', name: 'Jane Smith' }
      ],
      task: 'Fix authentication bug',
      date: '2023-04-02'
    },
    {
      id: 'pair-2',
      members: [
        { id: 'member-3', name: 'Bob Johnson' },
        { id: 'member-4', name: 'Alice Williams' }
      ],
      task: 'Implement new user dashboard',
      date: '2023-04-05'
    }
  ],
  mobSessions: [
    {
      id: 'mob-1',
      members: [
        { id: 'member-1', name: 'John Doe' },
        { id: 'member-2', name: 'Jane Smith' },
        { id: 'member-3', name: 'Bob Johnson' },
        { id: 'member-4', name: 'Alice Williams' }
      ],
      task: 'Fix security vulnerability',
      date: '2023-04-04'
    }
  ]
};

// Mock team data
export const mockTeamData = {
  id: 'team-1',
  name: 'Dante Development Team',
  members: [
    {
      id: 'member-1',
      name: 'John Doe',
      role: 'Frontend Developer',
      tasks: [
        {
          id: 'task-1',
          name: 'Fix authentication bug',
          description: 'Resolve issues with user login flow',
          realm: 'inferno',
          level: 5,
          status: 'completed'
        },
        {
          id: 'task-9',
          name: 'Implement new API endpoint',
          description: 'Create endpoint for user preferences',
          realm: 'paradiso',
          level: 2,
          status: 'in-progress'
        }
      ],
      distribution: {
        inferno: 40,
        purgatorio: 20,
        paradiso: 40
      }
    },
    {
      id: 'member-2',
      name: 'Jane Smith',
      role: 'Backend Developer',
      tasks: [
        {
          id: 'task-2',
          name: 'Optimize database queries',
          description: 'Improve performance of user data retrieval',
          realm: 'purgatorio',
          level: 2,
          status: 'in-progress'
        },
        {
          id: 'task-4',
          name: 'Fix security vulnerability',
          description: 'Address XSS vulnerability in forms',
          realm: 'inferno',
          level: 8,
          status: 'in-progress'
        }
      ],
      distribution: {
        inferno: 50,
        purgatorio: 30,
        paradiso: 20
      }
    },
    {
      id: 'member-3',
      name: 'Bob Johnson',
      role: 'UI/UX Designer',
      tasks: [
        {
          id: 'task-3',
          name: 'Implement new user dashboard',
          description: 'Create responsive dashboard layout',
          realm: 'paradiso',
          level: 3,
          status: 'todo'
        },
        {
          id: 'task-7',
          name: 'Fix UI bug',
          description: 'Resolve layout issues on mobile devices',
          realm: 'inferno',
          level: 2,
          status: 'completed'
        }
      ],
      distribution: {
        inferno: 30,
        purgatorio: 10,
        paradiso: 60
      }
    }
  ],
  philosophy: {
    hesse: 75,
    salinger: 60,
    derrida: 45,
    dante: 80
  },
  learningActivities: [
    {
      id: 'learning-1',
      title: 'TypeScript Advanced Features',
      description: 'Workshop on advanced TypeScript features and best practices',
      type: 'workshop',
      participants: ['John Doe', 'Jane Smith', 'Bob Johnson'],
      date: '2023-04-03',
      duration: '2 hours'
    },
    {
      id: 'learning-2',
      title: 'React Performance Optimization',
      description: 'Pair programming session focused on React performance',
      type: 'pair',
      participants: ['John Doe', 'Bob Johnson'],
      date: '2023-04-05',
      duration: '1.5 hours'
    },
    {
      id: 'learning-3',
      title: 'Security Best Practices',
      description: 'Team presentation on web application security',
      type: 'presentation',
      participants: ['Jane Smith', 'John Doe', 'Bob Johnson'],
      date: '2023-04-07',
      duration: '1 hour'
    }
  ]
};

// Mock tasks data
export const mockTasksData = [
  {
    id: 'task-1',
    name: 'Fix authentication bug',
    description: 'Resolve issues with user login flow',
    realm: 'inferno',
    level: 5,
    status: 'completed',
    assignee: 'John Doe',
    dueDate: '2023-04-05'
  },
  {
    id: 'task-2',
    name: 'Optimize database queries',
    description: 'Improve performance of user data retrieval',
    realm: 'purgatorio',
    level: 2,
    status: 'in-progress',
    assignee: 'Jane Smith',
    dueDate: '2023-04-07'
  },
  {
    id: 'task-3',
    name: 'Implement new user dashboard',
    description: 'Create responsive dashboard layout',
    realm: 'paradiso',
    level: 3,
    status: 'todo',
    assignee: 'Bob Johnson',
    dueDate: '2023-04-10'
  },
  {
    id: 'task-4',
    name: 'Fix security vulnerability',
    description: 'Address XSS vulnerability in forms',
    realm: 'inferno',
    level: 8,
    status: 'in-progress',
    assignee: 'Jane Smith',
    dueDate: '2023-04-06'
  },
  {
    id: 'task-5',
    name: 'Refactor legacy code',
    description: 'Improve maintainability of authentication module',
    realm: 'purgatorio',
    level: 1,
    status: 'completed',
    assignee: 'John Doe',
    dueDate: '2023-04-04'
  },
  {
    id: 'task-6',
    name: 'Add new feature',
    description: 'Implement user preferences functionality',
    realm: 'paradiso',
    level: 4,
    status: 'review',
    assignee: 'Alice Williams',
    dueDate: '2023-04-09'
  },
  {
    id: 'task-7',
    name: 'Fix UI bug',
    description: 'Resolve layout issues on mobile devices',
    realm: 'inferno',
    level: 2,
    status: 'completed',
    assignee: 'Bob Johnson',
    dueDate: '2023-04-03'
  },
  {
    id: 'task-8',
    name: 'Improve error handling',
    description: 'Enhance error messages and logging',
    realm: 'purgatorio',
    level: 3,
    status: 'todo',
    assignee: 'Charlie Brown',
    dueDate: '2023-04-11'
  },
  {
    id: 'task-9',
    name: 'Implement new API endpoint',
    description: 'Create endpoint for user preferences',
    realm: 'paradiso',
    level: 2,
    status: 'in-progress',
    assignee: 'John Doe',
    dueDate: '2023-04-08'
  },
  {
    id: 'task-10',
    name: 'Fix memory leak',
    description: 'Resolve memory leak in data visualization component',
    realm: 'inferno',
    level: 6,
    status: 'blocked',
    assignee: 'Jane Smith',
    dueDate: '2023-04-07'
  },
  {
    id: 'task-11',
    name: 'Update documentation',
    description: 'Update API documentation with new endpoints',
    realm: 'purgatorio',
    level: 6,
    status: 'todo',
    assignee: 'Charlie Brown',
    dueDate: '2023-04-12'
  },
  {
    id: 'task-12',
    name: 'Create new visualization',
    description: 'Implement data visualization for user analytics',
    realm: 'paradiso',
    level: 5,
    status: 'todo',
    assignee: 'Alice Williams',
    dueDate: '2023-04-13'
  }
];
