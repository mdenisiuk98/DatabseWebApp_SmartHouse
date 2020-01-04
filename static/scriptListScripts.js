function toogleCode(scriptID){
    var codeWrapper = document.querySelector('#' + scriptID +  ' .scriptListElement .scriptCodeWrapper')
    var toogleButton = document.querySelector('#' + scriptID +  ' .toogleBtn')
  if(codeWrapper.classList.length>1){
    codeWrapper.classList.remove('hiddenElement')
    toogleButton.innerHTML='Ukryj kod'
  }
  else{
    codeWrapper.classList.add('hiddenElement')
    toogleButton.innerHTML='Pokaz kod'
  }
}

function editCode(scriptID, maxPrivilege){
    //window.alert('Edytowanie skryptu ' + scriptID)
    var oldDiv = document.getElementById(scriptID).innerHTML
    var inputWrapper= document.querySelector('#' + scriptID +' .scriptListElement .scriptCodeWrapper')
    var oldCode = document.querySelector('#' + scriptID +' .scriptListElement .scriptCodeWrapper .scriptCode').innerHTML
  //  window.alert(oldCode)
    //inputWrapper.innerHTML =''
    var textFieldCode = document.createElement('input')
    textFieldCode.type='text'
    textFieldCode.name='Code'
    textFieldCode.value=oldCode.trim()
    inputWrapper.append(textFieldCode)

    var nameWrapper = document.querySelector('#' + scriptID +' .nameDiv')
    var oldName = nameWrapper.innerHTML
   
    var textFieldName = document.createElement('input')
    textFieldName.type='text'
    textFieldName.name='Script_Name'
    textFieldName.value=oldName.trim()
    //nameWrapper.innerHTML=''
    nameWrapper.append(textFieldName)


    var privilegeWrapper = document.querySelector('#' + scriptID +' .privilegeDiv')
    var oldPrivilege = privilegeWrapper.innerHTML.trim()    
    var numberFieldPrivilege = document.createElement('input')
    numberFieldPrivilege.type='number'
    numberFieldPrivilege.name='Authorization_Level'
    numberFieldPrivilege.value=oldPrivilege
    numberFieldPrivilege.min=1
    numberFieldPrivilege.max=maxPrivilege
   // privilegeWrapper.innerHTML=''
    privilegeWrapper.append(numberFieldPrivilege)


    var submissionButton = document.createElement('button')
    submissionButton.classList.add('formBtn')
    submissionButton.setAttribute('onclick','updateScript("'+scriptID+'","'+oldName.trim()+'")')
    submissionButton.innerHTML='Zapisz'
    var resetButton = document.createElement('button')
    resetButton.innerHTML = 'Anuluj'
    resetButton.classList.add('formBtn')
    resetButton.setAttribute('onclick','cancelForm(\''+scriptID+'\')')
    inputWrapper.append(submissionButton)
    inputWrapper.append(resetButton)

    document.querySelector('#' + scriptID +' .editBtn').classList.add('hiddenElement')
    document.querySelector('#' + scriptID +' .toogleBtn').classList.add('hiddenElement')
    document.querySelector('#' + scriptID +' .deleteBtn').classList.add('hiddenElement')
}

function cancelForm(scriptID){
    document.querySelector('#' + scriptID +' .editBtn').classList.remove('hiddenElement')
    document.querySelector('#' + scriptID +' .toogleBtn').classList.remove('hiddenElement')
    document.querySelector('#' + scriptID +' .deleteBtn').classList.remove('hiddenElement')

    var toRemove=[...document.querySelectorAll('#' + scriptID +' input'),...document.querySelectorAll('#' + scriptID +' .formBtn')]
    toRemove.forEach(element=>{
        element.remove()
    })
}

async function updateScript(identifier,oldName){
   // window.alert(identifier)


   var inputs = document.querySelectorAll('#'+identifier+' input')
  // window.alert(inputs[1].value)

   var xhr = new XMLHttpRequest();
    xhr.open("POST",'/modifyScript',true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('Script_Name=' + inputs[0].value + '&Code=' + inputs[2].value + '&Authorization_Level=' + inputs[1].value +'&oldName=' + oldName);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload()
        }
    }
}

function removeScript(scriptName){
    var xhr = new XMLHttpRequest();
    xhr.open("POST",'/removeScript',true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('Script_Name=' + scriptName);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            location.reload()
        }
    }
}