function swapTaskScript(tasks,scripts,check,callerID){
    if(check==true){
        var options = document.querySelector('#'+callerID+' select[name=\'Job\'')
        options.innerHTML = ''
        scripts.forEach(script=>{
            options.innerHTML+=('<option value=' + script.Script_ID + '>' + script.Script_Name + '</option>')
        })
    }
    else{
        var device = document.querySelector('#'+callerID+' select[name=\'Device_ID\'')
        device.onchange()
    }
}

function swapDeviceTasks(tasks,check,devices,argID,callerID){
    if(check!=true){
        let validDevice = devices.filter(device=>{
            if(device.Device_ID==argID){
                return device
            }
        })
    
        var options = document.querySelector('#'+callerID+' select[name=\'Job\'')
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

function editScheduleItem(scheduleItem,deviceID,callerID){
    console.log('CALLER ID = ' + callerID)
    var form = document.getElementById('newScheduleItem').cloneNode(true)
    form.id=('editScheduleItem_' + scheduleItem.Schedule_ID)
    form.action='/updateScheduleElement'
   var onchangeDev = form.childNodes[1].attributes.onchange.value.substring(0,form.childNodes[1].attributes.onchange.value.length-19)
   onchangeDev+=(',\'' + form.id + '\')')
   form.childNodes[1].attributes.onchange.value=onchangeDev
    var onchangeChck = form.childNodes[3].attributes.onchange.value.substring(0,form.childNodes[3].attributes.onchange.value.length-19)
    onchangeChck+=(',\'' + form.id + '\')')
    form.childNodes[3].attributes.onchange.value=onchangeChck
    hiddenInput = document.createElement('input')
    hiddenInput.type='hidden'
    hiddenInput.value= scheduleItem.Schedule_ID
    hiddenInput.name='Schedule_ID'
    form.appendChild(hiddenInput)
    var cancelButton=document.createElement('button')
    cancelButton.innerHTML='Anuluj'
    cancelButton.classList.add('updateFormBtn')
    cancelButton.type='button'
    cancelButton.setAttribute('onclick',('cancelScheduleUpdate(\'' + form.id +'\')'))
    form.appendChild(cancelButton)
    if(scheduleItem.Was_Custom_Script == true){
        form.Was_Custom_Script.checked=true
    }
    else{
        form.Was_Custom_Script.checked=false
    }
    form.Device_ID.value=deviceID
    //form.Was_Custom_Script.onchange();
    if(scheduleItem.Script_ID!=null){
        form.Job.value=scheduleItem.Script_ID
    }
    else{
        form.Job.value=scheduleItem.Task_ID
    }
    var beginH = scheduleItem.Start_Time.toString().split(':')
    var endH = scheduleItem.End_Time.toString().split(':')
    form.Day.value=scheduleItem.Day

    form.beginH.value=beginH[0]
    form.beginM.value=beginH[1]
    form.beginS.value=beginH[2]
    form.endH.value=endH[0]
    form.endM.value=endH[1]
    form.endS.value=endH[2]

    var listWrapper = document.createElement('li')
    listWrapper.append(form)
    console.log(scheduleItem.Start_Time)
   var inserting = document.getElementsByClassName('scheduleList')[0].childNodes
   console.log(inserting)

   var index=[...inserting].findIndex(listItem=>{
       console.log(listItem.id)
    if(listItem.id==callerID){
        return true;
    }
})
console.log(index)
   document.getElementsByClassName('scheduleList')[0].childNodes[index].insertAdjacentElement('afterend',listWrapper)
   document.querySelector('#' + form.id+' input[type=checkbox]').onchange()
}

function cancelScheduleUpdate(callerID){
    var removedForm = document.getElementById(callerID).parentElement
    removedForm.remove()
}