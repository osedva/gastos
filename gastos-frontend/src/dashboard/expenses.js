import { apiFetch } from "../utils/api.js"
import { getToken } from "../utils/auth.js"

const form = document.getElementById("expenseForm");
const inputId = document.getElementById("expenseId");
const inputName = document.getElementById("expenseTitle");
const inputValor = document.getElementById("expenseAmount");
const inputidcategory = document.getElementById("expenseIdCategory");
const selecCategory = document.getElementById("expenseCategory");
const inputDate = document.getElementById("expenseDate");


const btnSave = document.getElementById("saveExpense");
const btnUpdate = document.getElementById("updateExpense");
const btnDelete = document.getElementById("deleteExpence");
const btnCancel = document.getElementById("cancelUpdate");

const list = document.getElementById("expenseList");
inputName.focus()


async function loadCategoriesselect() {
    try {
        const token = getToken();
        const categories = await apiFetch("/categories", "GET", null, token);
        if(categories.length == 0){
            alert("Debes crear primero una categoria para el gasto")
            window.location.href = "categories.html";
        }
       
        categories.forEach((category) => {
            setcategory(category.name, category._id)

  
            
            // Agregamos las categorias al select  expenseCategory
            let x = document.getElementById("expenseCategory");
            let option = document.createElement("option");
            option.text = category.name;
            x.add(option);
        });
       
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        alert("No se pudieron cargar las categorías")
        window.location.href = "categories.html";
    }
}



function getcategory() {
    let categ = selecCategory.value;
    let idcat = localStorage.getItem(categ)
    inputidcategory.value = idcat;
}

function getcategoryid() {
    let categ = inputidcategory.value;
    let idcat = localStorage.getItem(categ)
    selecCategory.value = idcat;
}

selecCategory.addEventListener("change", getcategory);


function setcategory(categoria, idd) {
    localStorage.setItem(categoria, idd);
    localStorage.setItem(idd, categoria);
}





function vfecha(){
    let fecha = new Date(); //Fecha actual
      let mes = fecha.getMonth()+1; //obteniendo mes
      let dia = fecha.getDate(); //obteniendo dia
      let anio = fecha.getFullYear(); //obteniendo año
      if(dia<10){
        dia='0'+dia; //agrega cero si el menor de 10
        }
      if(mes<10){
        mes='0'+mes //agrega cero si el menor de 10
        }
        let fec = anio+"-"+mes+"-"+dia;
    return fec
    }
    inputDate.value = vfecha();




async function loadExpenses() {
    try {
        const token = getToken();
        const expenses = await apiFetch("/expenses", "GET", null, token);
        list.innerHTML = ""; 

        expenses.forEach((expensess) => {
            

            // Crear un li para cada expense
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${expensess.title}</span>
                <span>${expensess.amount}</span>
                <span>${expensess.category}</span>
                <button class="edit">
                    Editar
                </button>
            `;
            // Darle funcionalidad al boton editar
            li.querySelector("button").addEventListener("click", () => editExpenses(expensess));
            list.appendChild(li);
        });

    } catch (error) {
        console.error("Error al cargar gastos:", error);
        alert("No se pudieron cargar los gastos")
    }
}




function editExpenses(expensess) {
    inputId.value = expensess._id;
    inputName.value = expensess.title;
    inputValor.value = expensess.amount;
    inputidcategory.value = expensess.category;
    inputDate.value = vfecha();
    getcategoryid();
    
    btnSave.style.display = "none";
    btnUpdate.style.display = "inline-block";
    btnDelete.style.display = "inline-block";
    btnCancel.style.display = "inline-block";
    
  }







 //Guarda un nuevo gasto usando la API.



async function saveExpenses() {
    const title = inputName.value.trim();
    const amount = inputValor.value;
    const category = inputidcategory.value;
    const date = inputDate.value
    if (!title || !amount || !category) {
      alert("Los campos son obligatorios.");
      return;
    }
  
    try {
      const token = getToken();
      await apiFetch("/expenses/new", "POST", {
  
        title,
        amount,
        category,
        date
        }, token);
      alert("Gasto guardado correctamente.");
      form.reset();
      inputDate.value = vfecha();
      loadExpenses();
    } catch (error) {
      console.error("Error al guardar la gasto:", error.message);
      alert("No se pudo guardar el gasto.");
    }
  }





//Actualiza un gasto existente usando la API.
  
 
  
  async function updateExpenses() {
    const id = inputId.value;
    const title = inputName.value.trim();
    const amount = inputValor.value;
    const category = inputidcategory.value;
    const date = inputDate.value
    if (!id || !title || !amount || !category) {
      alert("Completa todos los campos.");
      return;
    }
  
    try {
      const token = getToken();
      await apiFetch(`/expenses/${id}`, "PUT", { 
            title,
            amount,
            category,
            date
       }, token);
      alert("Gasto actualizad correctamente.");
      form.reset();
      inputDate.value = vfecha();
      btnSave.style.display = "inline-block";
      btnUpdate.style.display = "none";
      btnDelete.style.display = "none";
      btnCancel.style.display = "none";
      loadExpenses();
    } catch (error) {
      console.error("Error al actualizar el gasto:", error.message);
      alert("No se pudo actualizar el gasto.");
    }
  }


  async function deleteExpenses() {
    const id = inputId.value;
    try {
      const token = getToken();
      await apiFetch(`/expenses/${id}`, "DELETE", "", token);
      alert("Gasto eliminado correctamente.");
      form.reset();
      inputDate.value = vfecha();
      btnSave.style.display = "inline-block";
      btnUpdate.style.display = "none";
      btnDelete.style.display = "none";
      btnCancel.style.display = "none";
      loadExpenses();
    } catch (error) {
      console.error("Error al eliminar gasto:", error.message);
      alert("No se pudo eliminar el gasto.");
    }
  }



  function cancelUpdate() {
    btnSave.style.display = "inline-block";
    btnUpdate.style.display = "none";
    btnDelete.style.display = "none";
    btnCancel.style.display = "none";
    form.reset();
    inputDate.value = vfecha();
  }
  



loadCategoriesselect();

btnSave.addEventListener("click", saveExpenses);
btnUpdate.addEventListener("click", updateExpenses);
btnDelete.addEventListener("click", deleteExpenses);
btnCancel.addEventListener("click", cancelUpdate);  

document.addEventListener("DOMContentLoaded", loadExpenses);