//to use this instead of page
let currentPage="";
//this variable helps us to find a product we want to delete
let productId="";
//this variable is for 3 different states of changing password
let changePassState;
//this variable is for knowing if deleting item failed or not
let isOparationFailed=false;
//header and main
let aside=document.querySelector("aside");
let main=document.querySelector("main");
let search= document.querySelector(".search");
let searchedValue;
let products=document.querySelector(".products");
//modal and container
let modal= document.querySelector(".modal");
let modalContainer= modal.querySelector(".container");
//closing container in all modals
let closeButtonContainer=  modalContainer.querySelector(".closeButton");
//buttons in delete message box
let  cancelButton=  modalContainer.querySelector(".messageBox .cancelButton");
let okButton=  modalContainer.querySelector(".messageBox .okButton");
//this popupmessage is above the table and used for delete,changePass,editAndInsert
let popupMessage=document.querySelector(".popupMessage");
let popupCloseButton=popupMessage.querySelector(".closeButton");
//button near the table to add new product
let addProductButton=document.querySelector(".addSection");
//button in modal to save changes
let saveChangesButton=modal.querySelector(".editAndInsertForm button");
//menus in header
let menus=document.querySelectorAll("nav a");
let asideMenus=document.querySelectorAll("aside a");
let changePassMenu=menus[1];
let logOutMenu=menus[2];
let changePassAside=asideMenus[1];
let logOutAside=asideMenus[2];
//array of products
let productsData="";

//products qualities
let idFeild=document.getElementById("idFeild");
let nameField=document.getElementById("name");
let case_= document.getElementById("case_");
let glasp=document.getElementById("glasp");
let strap= document.getElementById("strap");
let picUrl=document.getElementById("picUrl");
//this general error message is used in modals below the inputs
let errorMessage=document.querySelector(".errorMessage");


//eventListeners
let pictureBox=modal.querySelector(".pictureBox");
pictureBox.addEventListener("click",()=>{showModal("pictureBox")});
let asideLinks=document.querySelectorAll("aside a");
for (let i=0;i<asideLinks.length;i++){
    asideLinks[i].style.transitionDelay=`0.${i*2}s`;
}
changePassAside.addEventListener("click",()=>{
   hambergerMenuSwitch();
   showModal('changePass');
   });
//changepass listeners

changePassMenu.addEventListener("click",()=>showModal('changePass'));
let changePassDiv=document.querySelector(".changePass");
let changePassButon=changePassDiv.querySelector("button");

changePassButon.addEventListener("click",()=>{
   changePassValidation();

});
//showPass listener
let showPassButtons=document.querySelectorAll(".showPassIcon");
for (let i=0;i<showPassButtons.length;i++){
   showPassButtons[i].addEventListener("click",(e)=>{
     let ob=e.currentTarget;
     let input=ob.parentNode.querySelector("input");
     ob.classList.toggle("hidePassIcon");
     if(input.type=="password")
       input.type="text";
     else
     input.type="password"  ;
   });
}

//searchIcon & hambergerMenu listener
let searchIcon=document.querySelector(".products #searchSection i");
searchIcon.addEventListener("click",showSearch);
let hambergerMenu=document.querySelector(".hambergerMenu");
hambergerMenu.addEventListener("click",hambergerMenuSwitch);
closeButtonContainer.addEventListener("click",closeModal);
//delete messageBox listener
cancelButton.addEventListener("click",closeModal);
okButton.addEventListener("click",()=>deleteItem(productId));
//popup
popupCloseButton.addEventListener("click",(e)=>e.currentTarget.parentNode.style.opacity="0");
//add new product button listener
addProductButton.addEventListener("click",()=>{
     emptyForm();
      showModal("insert");});
//save changes for edit and insert listener    
saveChangesButton.addEventListener("click",(e)=>{
   
    if(editOrInsertValidation(e)==0)
    return;
    });

//FUNCTIONS
function emptyForm(){
   errorMessage.style.display="none";
   let feilds=document.querySelectorAll(".editAndInsertForm input[type=text]");
   document.querySelector(".editAndInsertForm input[type=file]").value="";
   for(let i=0;i<feilds.length;i++)
       feilds[i].value="";
}
function findIdexById(id){
   for(let i=0;i<productsData.length-1;i++)
      if(productsData[i].id==id)
         return i;
   return -1;      
}
//ajax
function ajax(mode,id,name,case_="",glasp="",strap="",picUrl="",gender="",page="") {
   isOparationFailed=false;
   const xhttp = new XMLHttpRequest();
  
   xhttp.onload = function() {
	   if(this.responseText=="0")
          productsData="";
      else if(this.responseText=="failed") { 
          isOparationFailed=true; 
        
      }
	   else if(this.responseText!="success"){
         // document.write(this.responseText);
		    productsData =JSON.parse(this.responseText); 
          
       
	   }
     }
  

   xhttp.open("POST", "../pages/page2.php", false);
   let fd=new FormData();
   fd.append("mode",mode);
   fd.append("id",id);
   fd.append("name",name);
   fd.append("case_",case_);
   fd.append("strap",strap);
   fd.append("glasp",glasp);
   fd.append("picUrl",picUrl);
   fd.append("gender",gender);
   fd.append("page",page);
   
   if(mode=="insert" || mode=="update"){
      fd.append("pic",document.getElementById("picUrl").files[0]);
   }
  
   xhttp.send(fd);

 }
function ajax2(oldPass,newPass,repeatedPass){
   changePassState="";
   const xhttp = new XMLHttpRequest();
  
   xhttp.onload = function() {
       changePassState=this.responseText;
     }
  

   xhttp.open("POST", "../pages/page2.php", false);
   let fd=new FormData();
   fd.append("mode","changePass");
   fd.append("oldPass",oldPass);
   fd.append("newPass",newPass);
   fd.append("repeatedPass",repeatedPass);
  
   xhttp.send(fd);

}
//header functions
function hambergerMenuSwitch(){
    hambergerMenu.classList.toggle("activerHambergerMenu");
  aside.classList.toggle("openAside");
}
function showSearch(e){         
selectPage(1);          
}
//edit and insert validation
function validation(){
      let message=""
      if(nameField.value=="")
         message+="فیلد مدل الزامی است<br/>";
      if(picUrl.value=="" )
         message+="فیلد تصویر ظاهری الزامی است<br/>";  
         return message;
      }     

//selectPage & showModal
 
function selectPage(page){

   currentPage=page;
   let nav=document.querySelector(".products nav");
   searchedValue= document.getElementById("searchTextFeild").value;
   ajax("select","",searchedValue,"","","","","",page);
  
   if(productsData==""){
      products.querySelector("tbody").innerHTML="<tr><td colspan='4'>محصولی یافت نشد</td></tr>";
      nav.innerHTML="";
      return;
   }

   let tbody=products.querySelector("table tbody") ;
   tbody.innerHTML="";
         for(let x=productsData.length-2;x>=0;x--){
            tbody.innerHTML+=`<tr> 
                <td><img src="../${productsData[x].picUrl}" alt=""  onclick="showModal('pictureBox',${x})"></td>
                <td>${productsData[x].name}</td> <td><span onClick="showModal('edit',${x})" class="button"><i class="fa-regular fa-pen-to-square"></i></span></th> 
                <td><span class="button" onclick="showModal('messageBox',${x})"><i class="fa-solid fa-trash-can"></i></span></td> 
                </tr>`;
           
         }
         
         
         let pageCount=productsData[productsData.length-1].pages;
         nav.innerHTML="";
        if(pageCount>1){
         for(let i=0;i<pageCount;i++){
            nav.innerHTML+=`<span onClick="selectPage(${i+1})">${i+1}</span>`;
         }
         document.querySelector(`.products nav span:nth-of-type(${page})`).classList.add("navItemActive");
       }
}

function showModal(mode,index=0){
   if(productsData[index]!=null)
      productId=productsData[index].id;
     
   let modalPages=document.querySelectorAll('.modal .container>div');
   for(let x of modalPages)
      x.style.display="none";

   switch(mode){

      case "messageBox":
         let messageBox=modal.querySelector(".modal .container .messageBox");
         messageBox.style.display="block";
         setTimeout(()=>cancelButton.focus(),500);
         


      break;

      case "pictureBox":
         let pictureBox=modal.querySelector(".modal .container .pictureBox");
         pictureBox.style.display="block";
         pictureBox.querySelector("img").src="../"+productsData[index].picUrl;
         
      break;

      case "changePass":
         let changePassDiv=modal.querySelector(".modal .container .changePass");
         changePassDiv.style.display="block";
         
      break;

      case "insert":
      case "edit":
         let editAndInsertForm=modal.querySelector(".modal .container .editAndInsertForm");
         editAndInsertForm.style.display="flex";
         let icoeditAndInsertFormIconn=document.querySelector(".editAndInsertFormIcon");
         if(mode=="edit"){
            idFeild.value=productsData[index].id;
            nameField.value=productsData[index].name;
            case_.value=productsData[index].case_;
            strap.value=productsData[index].strap;
            glasp.value=productsData[index].glasp;
            editAndInsertForm.querySelector("button").innerHTML="اعمال تغییرات";
            icoeditAndInsertFormIconn.innerHTML="";
            icoeditAndInsertFormIconn.style.backgroundImage=`url(../${productsData[index].picUrl})`;
            if(productsData[index].gender=="woman")
               document.getElementById("woman").checked=true;
         }
         else{
         icoeditAndInsertFormIconn.innerHTML='<i class="fa-solid fa-circle-plus"></i>';
         icoeditAndInsertFormIconn.style.backgroundImage="";
         editAndInsertForm.querySelector("button").innerHTML="ذخیره محصول";
         }
      break;
   }
   modal.style.opacity=1;
   modal.style.display="flex";
   setTimeout(()=>{
      modalContainer.style.opacity=1;
},500);
  
}
function closeModal(){
   productId="";
   modal.style.opacity=0;
   modalContainer.style.opacity=0;
   setTimeout(()=>modal.style.display="none",500);
}

//delete and edit&insert
function deleteItem(id){
   let index=findIdexById(id);
productPicPath=productsData[index].picUrl;
ajax("delete",id,"","","","",productPicPath,"","");
 closeModal();
 selectPage(1);
 showPopUp();
}

function editAndinsertItem(mode,id,name,case_,glasp="",strap="",picUrl="",gender=""){
       ajax(mode,id,name,case_,glasp,strap,picUrl,gender);
          
    closeModal();
    selectPage(currentPage);
    showPopUp();
   }

function editOrInsertValidation(e){
   let gender="man";
   let message=validation();
   if(message!=""){  
      errorMessage.innerHTML=message;
      document.querySelector(".errorMessage").style.display="inline-block";
      return 0;
   }
   if( document.getElementById("woman").checked)
     gender="woman";
        if(e.currentTarget.innerHTML=="ذخیره محصول")
        editAndinsertItem("insert","",nameField.value,
                 case_.value,
                  glasp.value,
                  strap.value,
                  picUrl.value,
                 gender);
         else{
            let picPath= picUrl.value;
            if(validation()!=""){
               errorMessage.style.display="block";
               return 0;
            }
               
             editAndinsertItem("update",idFeild.value,nameField.value,
                  case_.value,
                  glasp.value,
                  strap.value,
                  picPath,
                  gender); 
         }   
      
   }

//popup function
function showPopUp(){
   if(isOparationFailed){
      popupMessage.style.backgroundColor="rgb(185, 2, 2)";
      popupMessage.querySelector("span").innerHTML="عملیات با شکست مواجه شد";
      }
        popupMessage.style.opacity="1";
        setTimeout(()=>popupMessage.style.opacity="0",3000);
}
//changePassValidation function
function changePassValidation(){
   let inputs=changePassDiv.querySelectorAll("input");
   let oldPass=inputs[0];
   let newPass=inputs[1];
   let repeatedPass=inputs[2];
   let changePassErrorMessage=changePassDiv.querySelector(".changePassErrorMessage");
   if(newPass.value!=repeatedPass.value){
   changePassErrorMessage.innerText="کلمه عبور جدید باید با تکرار آن یکسان باشد";
   changePassErrorMessage.style.display="inline-block";
  
   }
  else{
   ajax2(oldPass.value,newPass.value,repeatedPass.value);
   oldPass.value="";
   newPass.value="";
   repeatedPass.value="";
   changePassErrorMessage.innerText="کلمه عبور جدید باید با تکرار آن یکسان باشد";
   changePassErrorMessage.style.display="none";
   closeModal();
   popupMessage.querySelector(".message").innerHTML=changePassState;
   if(changePassState=="عملیات موفقیت امیز بود")
   popupMessage.style.backgroundColor="darkgreen";
   else
   popupMessage.style.backgroundColor="rgb(185,2,2)";

   popupMessage.style.opacity="1";
   setTimeout(()=>popupMessage.style.opacity="0",6000);
  }
}

selectPage(1);