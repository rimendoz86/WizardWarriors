export class DomInfo {

    nativeElementRef;

    constructor(id){
        this.nativeElementRef = document.getElementById(id);
    }

    SetOnClick(methodByRef){
        this.nativeElementRef.addEventListener("click", methodByRef);
    }
    
    SetInnerHTML(innerHTML){
        this.nativeElementRef.innerHTML = innerHTML;
    }

    ReplaceClass(removeClass, addClass){
        this.nativeElementRef.classList.remove(removeClass);
        this.nativeElementRef.classList.add(addClass);
    }

}