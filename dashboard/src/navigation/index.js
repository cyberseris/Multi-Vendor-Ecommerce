import { allNav } from "./allNav";  

export const getNav = (role) => {
    const finalNavs = []

    console.log("role: ", role);
    for(let i = 0; i < allNav.length; i++){
        if(role === allNav[i].role){
            console.log("allNav[i].role: ", allNav[i].role);
            finalNavs.push(allNav[i])
        }
    }
    return finalNavs
}