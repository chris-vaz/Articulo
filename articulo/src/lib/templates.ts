
import { EditorNode } from './types'

export type WorkflowTemplate = {
  id: string
  name: string
  description: string
  nodes: EditorNode[]
  edges: { id: string; source: string; target: string }[]
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Workflow',
    description: 'Start from scratch with an empty canvas',
    nodes: [],
    edges: [],
  },
  {
    id: 'drive-slack',
    name: 'Google Drive to Slack',
    description: 'Send a Slack notification when a file is uploaded to Google Drive',
    nodes: [
      {
        id: 'trigger-1',
        type: 'Google Drive',
        position: { x: 250, y: 0 },
        data: {
          title: 'Google Drive',
          description: 'Trigger when a new file is uploaded',
          completed: false,
          current: false,
          metadata: {},
          type: 'Google Drive',
        },
      },
      {
        id: 'action-1',
        type: 'Slack',
        position: { x: 250, y: 200 },
        data: {
          title: 'Slack',
          description: 'Send a notification to Slack',
          completed: false,
          current: false,
          metadata: {},
          type: 'Slack',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'action-1' },
    ],
  },
  {
    id: 'drive-notion',
    name: 'Google Drive to Notion',
    description: 'Create a Notion page when a file is uploaded to Google Drive',
    nodes: [
      {
        id: 'trigger-1',
        type: 'Google Drive',
        position: { x: 250, y: 0 },
        data: {
          title: 'Google Drive',
          description: 'Trigger when a new file is uploaded',
          completed: false,
          current: false,
          metadata: {},
          type: 'Google Drive',
        },
      },
      {
        id: 'action-1',
        type: 'Notion',
        position: { x: 250, y: 200 },
        data: {
          title: 'Notion',
          description: 'Create a new entry in Notion',
          completed: false,
          current: false,
          metadata: {},
          type: 'Notion',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'action-1' },
    ],
  },
  {
    id: 'drive-discord',
    name: 'Google Drive to Discord',
    description: 'Post to a Discord channel when a file changes in Google Drive',
    nodes: [
      {
        id: 'trigger-1',
        type: 'Google Drive',
        position: { x: 250, y: 0 },
        data: {
          title: 'Google Drive',
          description: 'Trigger when files change',
          completed: false,
          current: false,
          metadata: {},
          type: 'Google Drive',
        },
      },
      {
        id: 'action-1',
        type: 'Discord',
        position: { x: 250, y: 200 },
        data: {
          title: 'Discord',
          description: 'Post a message to Discord',
          completed: false,
          current: false,
          metadata: {},
          type: 'Discord',
        },
      },
    ],
    edges: [{ id: 'e1', source: 'trigger-1', target: 'action-1' }],
  },
]
