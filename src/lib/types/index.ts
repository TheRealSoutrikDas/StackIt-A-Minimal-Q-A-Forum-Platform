export type UserRole = 'guest' | 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  reputation: number;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  author: User;
  tags: Tag[];
  votes: number;
  views: number;
  answers: Answer[];
  acceptedAnswerId?: string;
  createdAt: Date;
  updatedAt: Date;
  isClosed: boolean;
}

export interface Answer {
  id: string;
  content: string;
  author: User;
  questionId: string;
  votes: number;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  parentId: string; // question or answer id
  parentType: 'question' | 'answer';
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'mention' | 'vote' | 'accept';
  title: string;
  message: string;
  userId: string;
  relatedId?: string; // question or answer id
  isRead: boolean;
  createdAt: Date;
}

export interface Vote {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'question' | 'answer';
  value: 1 | -1; // 1 for upvote, -1 for downvote
  createdAt: Date;
}

// export interface RichTextContent {
//   type: 'doc';
//   content: Array<{
//     type: string;
//     content?: Array<{
//       type: string;
//       text?: string;
//       marks?: Array<{
//         type: string;
//         attrs?: Record<string, any>;
//       }>;
//     }>;
//     attrs?: Record<string, any>;
//   }>;
// } 