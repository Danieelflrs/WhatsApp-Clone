document.addEventListener('DOMContentLoaded', function() {
  const socket = io();
  
  const contentWrap =  document.getElementById('content-wrap');
  const messageForm = document.getElementById('message-form');
  const messageBox = document.getElementById('message');
  const chat = document.getElementById('chat');

  const preloadPage = document.getElementById('preload-page');
  const preloader = document.getElementById('preloader');

  const nickWrap =  document.getElementById('nick-wrap');
  const nickForm = document.getElementById('nick-form');
  const nickName = document.getElementById('nickname');
  const nickError = document.getElementById('nick-error'); 

  const usernames =  document.getElementById('usernames')
  
  const handleSubmit = function(e) {
    e.preventDefault();
    socket.emit('send message', messageBox.value, data =>{
      chat.insertAdjacentHTML('beforeend', `<p>${data}</p>`)
    });
    messageBox.value = '';
  };
  
  const handleUsersSubmit = function(e) {
    e.preventDefault();
    console.log('Enviando datos');
    socket.emit('new user', nickName.value, data =>{
      if (data){
        nickWrap.style.display = 'none';
        preloadPage.style.display = 'block';
        setTimeout(()=>{
          preloadPage.style.display = 'none';
          contentWrap.style.display = 'block';                
        },3700);
        socket.on('usernames', data => {
          let html = '';
          let addedUsers = [];
          for (let i = 0; i < data.length; i++){
            if (!addedUsers[data[i]]) {
              html += `<p>${data[i]}</p><br/>`;
              addedUsers[data[i]] = true;
            }
          }
          //usernames.innerHTML = html;
        });
      } else{
        nickError.insertAdjacentHTML('beforeend', `<div>Ese Usuario ya existe</div>`);
      }
      nickName.value = '';
    });
  };
  
  nickForm.addEventListener('submit', handleUsersSubmit);

  // messageForm.addEventListener('submit', handleSubmit);

  socket.on('new message', function(data){
      chat.insertAdjacentHTML('beforeend', `<b>${data.nick} : </b>` + data.msg + '<br/>');
  });
  socket.on('whisper', data =>{
    chat.insertAdjacentHTML('beforeend', `<b>${data.nick} : </b>` + data.msg + '<br/>');
})
});
  






