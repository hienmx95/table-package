function getCookie(cname) {
  var name = cname + '=';
  var cArr = window.document.cookie.split(';');
  for (var i = 0; i < cArr.length; i++) {
    var c = cArr[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
}

function deleteCookie(cname) {
  document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const apiGateway = 'http://localhost:9060';
const urlLogin = 'http://localhost:9050/login';
const cookie = getCookie('fwork-token');
if (!cookie) {
  // window.location.href = urlLogin;
} else {
  console.log('run header');
  // let req = new XMLHttpRequest();
  // req.open("GET", `${apiGateway}/api/check-auth`, true);
  // req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  // req.setRequestHeader("access_token", cookie);
  // req.addEventListener('load', function(){
  //   console.log(req.status);
  //   // console.log('sss', JSON.parse(req.responseText));
  //   if(req.status !== 200 || JSON.parse(req.responseText).status !== 200 ){
  //     window.location.href = urlLogin;
  //   }
  // });
  // req.addEventListener('error', function(){
  //   console.log('Error occurred!');
  //   window.location.href = urlLogin;
  // });
  // req.send(null);
}
// <form class="fwork-search">
//     <input class="fwork-input" name="q" placeholder="Search..." type="search">
// </form>
function writeHeader() {
  document.write(`
    <div id="fwork-header">
      <div class="fwork-logo">
          <a class="fwork-a" href="#">FPT Work</a>
      </div>  
      <nav class="fwork-header-nav">
          <ul class="fwork-header-ul">
          <select class="fwork-language" id="language" onchange="handleChangeLang(this)">
            <option value="en">English</option>
            <option value="vi">Vietnam</option>
          </select>
          <li>
              <a class="fwork-a" href="">Mega Menu</a>
              <ul class="fwork-mega-dropdown fwork-header-ul">
              <li class="row">
                  <ul class="fwork-mega-col fwork-header-ul">
                  <li><a class="fwork-a" href="#">Home</a></li>
                  <li><a class="fwork-a" href="#">About</a></li>
                  <li><a class="fwork-a" href="#">Contact</a></li>
                  </ul>
                  <ul class="fwork-mega-col fwork-header-ul">
                  <li><a class="fwork-a" href="#">Help</a></li>
                  <li><a class="fwork-a" href="#">Pricing</a></li>
                  <li><a class="fwork-a" href="#">Team</a></li>
                  <li><a class="fwork-a" href="#">Services</a></li>
                  </ul>
                  <ul class="fwork-mega-col fwork-header-ul">
                  <li><a class="fwork-a" href="#">Coming Soon</a></li>
                  <li><a class="fwork-a" href="#">404 Error</a></li>
                  </ul>
              </li>
              </ul>        
          </li>
          <li class="fwork-dropdown">
              <a class="fwork-a" href="">Modular</a>
              <ul class="fwork-header-ul">
                  <li><a class="fwork-a" href="#">HR</a></li>
                  <li><a class="fwork-a" href="#">Wiki</a></li>
                  <li><a class="fwork-a" href="#">Office</a></li>
                  <li><a class="fwork-a" href="#">Booking</a></li>
              </ul>        
          </li>
          <li>
              <a class="fwork-a" href="">Profile</a>
          </li>
          <li>
              <a class="fwork-a" onclick="handleFworkLogout()">Logout: Admin</a>
          </li>
          </ul>
      </nav>
    </div>
  `);
}

// logout
function handleFworkLogout() {
  deleteCookie('fwork-token');
  window.location.href = urlLogin;
}

function handleChangeLang(e){
  localStorage.setItem("lng",e.value);
  window.location.reload();
}

// reponsive Header
writeHeader();
const newDiv = document.createElement('div');
const header = document.getElementById('fwork-header');
newDiv.id = 'fwork-menu-icon';
newDiv.innerHTML =
  '<span class="first"></span><span class="second"></span><span class="third"></span>';
header.insertBefore(newDiv, header.childNodes[0]);

document.addEventListener('DOMContentLoaded', function() {
  const nut = document.getElementById('fwork-menu-icon');
  const nav = document.querySelector('nav');
  nut.addEventListener('click', function() {
    nut.classList.toggle('active');
    nav.classList.toggle('active');
  });

  const lng = localStorage.getItem("lng") || "en";
  document.getElementById("language").value = lng;
});
