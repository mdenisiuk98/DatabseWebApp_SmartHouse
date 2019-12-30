function editDevice(element,rooms,types){
    
    var parent = document.getElementById(element.Device_Name);
    let checkMultiple = parent.innerHTML.includes('form');
    if(checkMultiple===false){
        const oldForm=parent.innerHTML;     

        this.resetForm = function(){
            parent.innerHTML = oldForm;
        }

        newForm = " <form class='deviceEditor' action='deviceList' method='POST' >\n Nazwa:  <input type='text' name='Device_Name' value='"+ element.Device_Name +
        "'><br>Pokoj: <select name='Room_ID'>";

        rooms.forEach(room =>{
            if(room.Room_Name === element.Room_Name){
                newForm +="<option value=" + room.Room_ID + " selected>" + room.Room_Name + "</option> ";
            }
            else{
            newForm +="<option value=" + room.Room_ID + ">" + room.Room_Name + "</option> ";
            }
        })

       newForm+= "</select><br> Zuzycie pradu: <input type='number' name='Power_Consumption' value='" + element.Power_Consumption +
        "'><br>Wymagane uprawnienia: <input type ='number' name='Authorization_Level' min='0' max='10' value=" + element.Authorization_Level +"><br>" + 
        "Powiadomienia: <input type='checkbox' name='Notifications_Enabled' value='true'/><br>"+
        "Adres IP: <input type='text' name='IP_Address' value='" + element.IP_Address + "'><br>" +
        "Typ: <select name='Type_ID'>";

        types.forEach(type =>{
            if(type.Type_Name === element.Type_Name){
                newForm +="<option value=" + type.Type_ID + " selected>" + type.Type_Name + "</option> ";
            }
            else{
            newForm +="<option value=" + type.Type_ID + ">" + type.Type_Name + "</option> ";
            }
        })
        newForm+="</select><br><input type='hidden' name='Device_Name_OLD' value='" + element.Device_Name +
        "'> <center><input type='submit' value='Zapisz'><button type='button' onclick='resetForm()'>Anuluj</button></center></form>";
        parent.innerHTML = newForm;

    }
}

