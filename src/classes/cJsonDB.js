export default class cJsonDB {

    constructor () {
        console.log(localStorage);
    }

    getAllTitles () {
        let titles = [];
        for(i in jsonDB){
            titles.push(jsonDB[i].title);
        }
        return titles;
    }

    set setNewNote (content) {
        jsonDB[dbIndex].notes.push(content);
        localStorage.setItem("DB", jsonDB);
    }
}