

const stringmap = {};

const StringStore ={
    get: (key) =>{
        if(stringmap[key]){
            return stringmap[key];
        }
        return key;
    },
    set: (key, value) =>{
        stringmap[key] = value;
    }
}
export default StringStore;