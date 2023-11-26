import React from 'react';

function searchbar (){}
document.addEventListener("keyup", e=>{
    if(e.target.matches('#search')){
        document.querySelectorAll(".users").forEach(user=>{
            user.textContent.toLowerCase().includes(e.target.value.toLowerCase())
            ?user.classList.remove("filter")
            :user.classList.add("filter")
        })
    }
})