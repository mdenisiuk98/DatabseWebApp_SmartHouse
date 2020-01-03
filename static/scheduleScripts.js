function swapTaskScript(tasks,scripts,check){
    if(check==true){
        var options = document.querySelector('select[name=\'Job\'')
        options.innerHTML = ''
        scripts.forEach(script=>{
            options.innerHTML+=('<option value=' + script.Script_ID + '>' + script.Script_Name + '</option>')
        })
    }
    else{
        var device = document.querySelector('select[name=\'Device_ID\'')
        device.onchange()
    }
}

function swapDeviceTasks(tasks,check,devices,argID){
    if(check!=true){
        let validDevice = devices.filter(device=>{
            if(device.Device_ID==argID){
                return device
            }
        })
    
        var options = document.querySelector('select[name=\'Job\'')
        options.innerHTML = ''
        tasks.forEach(task=>{
            if(task.Type_ID==validDevice[0].Type_ID){
            options.innerHTML+=('<option value=' + task.Task_ID + '>' + task.Task_Name + '</option>')
            }
        })
    }
}

async function removeScheduleItem(itemID){
    var xhr = new XMLHttpRequest();
    xhr.open("POST",'/removeScheduleItem',true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('Schedule_ID=' + itemID);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload()
        }
    }
}   
