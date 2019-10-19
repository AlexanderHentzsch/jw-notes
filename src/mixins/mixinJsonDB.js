export default {
    data(){
        return {jsonDBTest: "Hello World"}
    },
    methods: {
        mixinTest(){
            this.jsonDBTest = "String 2";
            alert(this.jsonDBTest);
        }
    }
};