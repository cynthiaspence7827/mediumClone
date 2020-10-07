import { handleErrors } from "./utils.js";

document.addEventListener('DOMContentLoaded', async (e) => {
    const userId = localStorage.getItem("MEDIUM_CURRENT_USER_ID");
    const userToken = localStorage.getItem("MEDIUM_ACCESS_TOKEN");
    const isAuth = userId.headers.Authorization.split(' ')[0] = 'authorization';
    const token = userId.headers.Authorization.split(' ')[1];
    if(userId === null) {
        window.location.href = "/";
        return
    }
    try{
        const res = await fetch(`http://localhost:3000/api/users/${userId}`,{
            // method: "GET",
            // body: JSON.stringify(body),
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        if(!res.ok) {
            throw res;
        }
        if(res.status === 401) {
            window.location.href = "/";
            return
        }

        const obj = await res.json();
        const {firstName, lastName} = obj.user;
        // console.log(obj);
        document.querySelector("#userName").innerHTML = `Hello ${firstName} ${lastName}`;
    }catch(err){
        handleErrors(err);
    }
})
