import CommunityLayout from '../layouts/CommunityLayout.vue'

export const communityRoutes = [
  {
    path: '/communities/:communitySlug',
    component: CommunityLayout,
    children: [
      {
        path: '',
        name: 'CommunityHome',
        component: () => import('../pages/community/CommunityHome.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'posts',
        name: 'CommunityPosts',
        component: () => import('../pages/community/CommunityPosts.vue'),
      },
      {
        path: 'posts/:id',
        name: 'CommunityPost',
        component: () => import('../pages/community/CommunityPost.vue'),
      },
      {
        path: 'events',
        name: 'CommunityEvents',
        component: () => import('../pages/community/CommunityEvents.vue'),
      },
      {
        path: 'events/:id',
        name: 'CommunityEvent',
        component: () => import('../pages/community/CommunityEvent.vue'),
      },
      {
        path: 'members',
        name: 'CommunityMembers',
        component: () => import('../pages/community/CommunityMembers.vue'),
      },
      {
        path: 'conversations',
        name: 'CommunityConversations',
        component: () => import('../pages/community/CommunityConversations.vue'),
      },
      {
        path: 'conversations/:id',
        name: 'CommunityConversation',
        component: () => import('../pages/community/CommunityConversation.vue'),
      },
      {
        path: 'pages',
        name: 'CommunityPages',
        component: () => import('../pages/community/CommunityPages.vue'),
      },
      {
        path: 'pages/:id',
        name: 'CommunityPage',
        component: () => import('../pages/community/CommunityPage.vue'),
      },
      {
        path: 'joatu',
        name: 'CommunityJoaTu',
        component: () => import('../pages/community/CommunityJoaTu.vue'),
      },
    ],
  },
]
