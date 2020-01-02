
async function validateAdmin(username){
        var pass= window.prompt('PODAJ PONOWNIE HASLO');
        var returned = false
        var xhr = new XMLHttpRequest();  
        return new Promise(function(resolve,reject){
            xhr.onreadystatechange = function() { // Call a function when the state changes.
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    console.log(xhr.responseText)
                    if( xhr.responseText=='true'){
                        returned = true
                        resolve(returned)
                    }
                    else if(xhr.responseText=='false'){
                        resolve(returned)
                    }
                    else{
                        reject(returned) 
                    }
                }
            }
            xhr.open("POST",'/revalidateAdmin',true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");    
            xhr.send('password=' + pass+'&login=' + username)   
        }) 
    }


//module.exports=functions;