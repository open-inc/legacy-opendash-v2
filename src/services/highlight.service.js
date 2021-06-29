


const highlightSingleton ={
    listener : [], 
    addListener : (cListener)=>{
        if(!(typeof cListener.notify == 'function')) { 
            throw Error("Highlight listener need a notify function")
        }
        highlightSingleton.listener.push(cListener);
        

    },
    highlightEvent : (event)=>{
        if(!("x" in event && "y" in event && "id" in event)){
            throw Error("Events need to have id, x and y attribute")
        }
        highlightSingleton.listener.forEach(cListener =>{
            cListener.notify(event);
        })
    }

};
const singleton = ()=>{
    return highlightSingleton;
}

export default singleton;