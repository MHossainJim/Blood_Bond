// auth.js — simple client-side auth helpers using localStorage
(function(){
  function getSession(){
    try{
      return JSON.parse(localStorage.getItem('bb_session') || 'null');
    }catch(e){return null}
  }

  function saveSession(session){
    localStorage.setItem('bb_session', JSON.stringify(session));
  }

  function logout(){
    localStorage.removeItem('bb_session');
    window.location.href = 'login.html';
  }

  function requireLogin(){
    const session = getSession();
    if(!session){
      window.location.href = 'login.html';
      return null;
    }
    // show user info in header if present
    const userInfoEl = document.getElementById('user-info');
    const logoutLink = document.getElementById('logout-link');
    if(userInfoEl) userInfoEl.textContent = `${session.role} · ${session.identifier}`;
    if(logoutLink){
      logoutLink.style.display = 'inline-block';
      logoutLink.addEventListener('click', e=>{e.preventDefault(); logout();});
    }
    return session;
  }

  function findUserByIdentifier(identifier){
    if(!identifier) return null;
    const users = JSON.parse(localStorage.getItem('bb_users') || '[]');
    return users.find(u=>u.email === identifier || u.phone === identifier || u.identifier === identifier) || null;
  }

  function saveUser(user){
    const users = JSON.parse(localStorage.getItem('bb_users') || '[]');
    users.push(user);
    localStorage.setItem('bb_users', JSON.stringify(users));
  }

  window.BBAuth = { getSession, saveSession, requireLogin, logout, findUserByIdentifier, saveUser };
})();
