import { getToken } from "./utils/auth.js";


 function validarsitoken(){
    if(!getToken()){
        window.location.href = "login.html";
    }
 }

 validarsitoken();



