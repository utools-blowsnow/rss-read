if (window.db === undefined){
    window.db = function(name,value=undefined){
        let obj = localStorage.getItem(name);
        if (value !== undefined){
            let obj = {
                data: value
            }
            localStorage.setItem(name,JSON.stringify(obj));
            return;
        }
        obj = JSON.parse(obj);
        if (obj == null) return null;
        return obj.data;
    }
}
if (window.is_utools === undefined){
    window.is_utools = false;
}
