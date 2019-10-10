import Main from "@/pages/Main";
import Editor from "@/pages/Editor";

export const routes = [
    {
        path: '/',
        component: Main
    },
    {
        path: '/editor/:id?/:index?',
        component: Editor
    }
];