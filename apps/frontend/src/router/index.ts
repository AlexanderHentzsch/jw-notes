import {createRouter, createWebHistory} from 'vue-router';

export default createRouter({
  history: createWebHistory('/jw-notes/'),
  routes: [
    {path: '/', name: 'Main', component: () => import('../views/IndexView.vue')},
    {path: '/overview/notes', name: 'OverviewNotes', component: () => import('../views/OverviewNotesView.vue')},
    {path: '/editor/notes/:id', name: 'EditorNotes', component: () => import('../views/EditorNotesView.vue')},
    {path: '/options', name: 'Options', component: () => import('../views/OptionsView.vue')},
  ],
});
