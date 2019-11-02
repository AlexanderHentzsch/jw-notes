import Main from "./pages/Main";
import Options from "./pages/Options";
import OverviewNotes from "./pages/OverviewNotes";
import OverviewPrograms from "./pages/OverviewPrograms";
import OverviewProgramsNotes from "./pages/OverviewProgramsNotes";
import Program from "./pages/Program";
import Editor from "./pages/Editor";

export const routes = [
    {
        path: '/',
        component: Main,
        name: "Main"
    },
    {
        path: '/options',
        component: Options,
        name: "Options"
    },
    {
        path: '/overview/notes',
        component: OverviewNotes,
        name: "OverviewNotes"
    },
    {
        path: '/overview/programs',
        component: OverviewPrograms,
        name: "OverviewPrograms"
    },
    {
        path: '/overview/programs/:idProgram',
        component: OverviewProgramsNotes,
        name: "OverviewProgramsNotes"
    },
    {
        path: '/program/:idProgram',
        component: Program,
        name: "Program"
    },
    {
        path: '/editor/notes/:idNotes/:index?',
        component: Editor,
        name: "EditorNotes"
    },
    {
        path: '/editor/program/:idProgram/:idProgramPoint/:index?',
        component: Editor,
        name: "EditorProgram"
    } /*,
    {
        path: "*",
        redirect: '/',
        name: "404"
    }
    */
];