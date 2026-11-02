var C=[
{id:1,n:"Toyota Land Cruiser V8",cat:"premium",s:7,tr:"Automatic",f:"Diesel",p:180000,img:"images/car-1.jpg"},
{id:2,n:"Toyota RAV4 Hybrid",cat:"suv",s:5,tr:"Automatic",f:"Hybrid",p:90000,img:"images/car-2.jpg"},
{id:3,n:"Kia Sorento 2021",cat:"premium",s:7,tr:"Automatic",f:"Petrol",p:95000,img:"images/car-3.jpg"},
{id:4,n:"Land Cruiser V8 Safari",cat:"premium",s:7,tr:"Automatic",f:"Diesel",p:170000,img:"images/car-4.jpg"},
{id:5,n:"Toyota Prius",cat:"economy",s:5,tr:"Automatic",f:"Hybrid",p:45000,img:"images/car-5.jpg"},
{id:6,n:"Toyota Land Cruiser Prado",cat:"premium",s:7,tr:"Automatic",f:"Diesel",p:150000,img:"images/car-6.jpg"},
{id:7,n:"Toyota RAV4 2004",cat:"suv",s:5,tr:"Automatic",f:"Petrol",p:55000,img:"images/car-7.jpg"},
{id:8,n:"Kia Sorento 2011",cat:"suv",s:7,tr:"Automatic",f:"Petrol",p:65000,img:"images/car-8.jpg"},
{id:9,n:"Hyundai Santa Fe",cat:"suv",s:7,tr:"Automatic",f:"Petrol",p:75000,img:"images/car-9.jpg"},
{id:10,n:"Toyota RAV4 White",cat:"suv",s:5,tr:"Automatic",f:"Petrol",p:80000,img:"images/car-10.jpg"},
{id:11,n:"Toyota RAV4 Blue 2004",cat:"suv",s:5,tr:"Automatic",f:"Petrol",p:55000,img:"images/car-11.jpg"},
{id:12,n:"Kia Sorento Grey",cat:"suv",s:7,tr:"Automatic",f:"Diesel",p:90000,img:"images/car-12.jpg"},
{id:13,n:"Mercedes-Benz C-Class Silver",cat:"premium",s:5,tr:"Automatic",f:"Petrol",p:85000,img:"images/car-13.jpg"},
{id:14,n:"Hyundai Santa Fe Bronze",cat:"suv",s:7,tr:"Automatic",f:"Petrol",p:80000,img:"images/car-14.jpg"},
{id:15,n:"Land Cruiser Safari Green",cat:"safari",s:9,tr:"Manual",f:"Diesel",p:140000,img:"images/car-15.jpg"},
{id:16,n:"Kia Sorento Silver",cat:"suv",s:7,tr:"Automatic",f:"Petrol",p:65000,img:"images/car-16.jpg"},
{id:17,n:"Mercedes-Benz S-Class",cat:"premium",s:5,tr:"Automatic",f:"Petrol",p:200000,img:"images/car-17.jpg"},
{id:18,n:"Toyota RAV4 Black",cat:"suv",s:5,tr:"Automatic",f:"Petrol",p:85000,img:"images/car-18.jpg"},
{id:19,n:"Land Cruiser Safari Lime",cat:"safari",s:9,tr:"Manual",f:"Diesel",p:140000,img:"images/car-19.jpg"},
{id:20,n:"Toyota Land Cruiser V8 Silver",cat:"premium",s:7,tr:"Automatic",f:"Diesel",p:180000,img:"images/car-20.jpg"},
{id:21,n:"Land Cruiser Prado Safari",cat:"safari",s:7,tr:"Manual",f:"Diesel",p:160000,img:"images/car-21.jpg"},
{id:22,n:"Mercedes-Benz C-Class Black",cat:"premium",s:5,tr:"Automatic",f:"Petrol",p:90000,img:"images/car-22.jpg"},
{id:23,n:"Toyota Land Cruiser V8 White",cat:"premium",s:7,tr:"Automatic",f:"Diesel",p:190000,img:"images/car-23.jpg"},
{id:24,n:"Toyota Hiace",cat:"van",s:15,tr:"Manual",f:"Diesel",p:110000,img:"images/car-24.jpg"},
{id:25,n:"Kia Sorento Black",cat:"suv",s:7,tr:"Automatic",f:"Diesel",p:85000,img:"images/car-25.jpg"},
{id:26,n:"Toyota RAV4 Classic Blue",cat:"suv",s:5,tr:"Manual",f:"Petrol",p:45000,img:"images/car-26.jpg"},
{id:27,n:"Toyota Land Cruiser Prado Black",cat:"premium",s:7,tr:"Automatic",f:"Diesel",p:160000,img:"images/car-27.jpg"},
{id:28,n:"GAC Trumpchi GS3",cat:"suv",s:5,tr:"Automatic",f:"Petrol",p:70000,img:"images/car-28.jpg"},
{id:29,n:"Kia Sorento Grey 2010",cat:"suv",s:7,tr:"Automatic",f:"Petrol",p:65000,img:"images/car-29.jpg"},
{id:30,n:"Kia Niro Hybrid",cat:"economy",s:5,tr:"Automatic",f:"Hybrid",p:65000,img:"images/car-30.jpg"}];
var LOC=["Kigali International Airport","Kigali city centre","Musanze","Huye","Rubavu"];
var $=function(i){return document.getElementById(i)};
var fmt=function(n){return "RWF "+n.toLocaleString("en-US")};
var iso=function(add){var d=new Date();d.setDate(d.getDate()+add);return d.toISOString().slice(0,10)};
var S={loc:LOC[0],d1:iso(1),d2:iso(4)},filter="all",cur=null;
function body(t,c){
 var B={
 hatch:["M12 76V58Q12 52 20 50L48 46L64 28H128Q136 28 142 36L156 48L182 52Q190 54 190 62V76Z","M68 33H100V46H56Z M106 33H126Q131 33 135 38L142 46H106Z"],
 sedan:["M10 76V60Q10 54 18 52L50 48L68 30H122Q130 30 136 36L150 48L184 54Q192 56 192 64V76Z","M72 34H100V48H58Z M106 34H122L136 48H106Z"],
 suv:["M12 76V56Q12 50 20 48L44 44L58 24H146Q152 24 156 30L166 46L184 50Q190 52 190 60V76Z","M62 29H98V44H52Z M104 29H144L156 44H104Z"],
 van:["M10 78V38Q10 28 20 28H138Q146 28 152 36L170 54L184 58Q190 60 190 66V78Z","M18 34H60V52H18Z M66 34H104V52H66Z M110 34H138L156 52H110Z"]}[t];
 return '<ellipse cx="100" cy="92" rx="88" ry="5" fill="rgba(0,0,0,.18)"/><path d="'+B[0]+'" fill="'+c+'" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><path d="'+B[1]+'" fill="#CFE9F6"/><circle cx="48" cy="78" r="14" fill="#14202C"/><circle cx="152" cy="78" r="14" fill="#14202C"/><circle cx="48" cy="78" r="6" fill="#B9C4CF"/><circle cx="152" cy="78" r="6" fill="#B9C4CF"/>';
}
function art(c){return '<img src="'+c.img+'" alt="'+c.n+'" loading="lazy">'}
function opts(id){$(id).innerHTML=LOC.map(function(l){return '<option>'+l+'</option>'}).join("")}
opts("bloc");
function days(){return Math.max(1,Math.round((new Date(S.d2)-new Date(S.d1))/864e5))}
function nice(d){return new Date(d+"T00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
function sync(){
 $("bloc").value=S.loc;$("bd1").value=S.d1;$("bd2").value=S.d2;$("bd1").min=iso(0);$("bd2").min=S.d1;
 $("range").textContent="Choose your dates and pick-up place when you book.";
 render();if(cur)totals();
}
var query="",shown=9,rkey="";
function render(){
 var q=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 var list=C.filter(function(c){if(filter!=="all"&&c.cat!==filter)return false;var s=[c.n,c.cat,c.f,c.tr,c.s+" seats"].join(" ").toLowerCase();return q.every(function(w){return s.indexOf(w)>-1})});
 var key=filter+"|"+query;if(key!==rkey){rkey=key;shown=9}
 $("grid").innerHTML=list.slice(0,shown).map(function(c){
  return '<article class="card"><div class="img">'+art(c)+'</div><div class="body"><h3>'+c.n+'</h3><p class="specs">'+c.s+' seats · '+c.tr+' · '+c.f+'</p><div class="row"><div class="price">'+fmt(c.p)+'<small>per day</small></div><button class="btn" data-id="'+c.id+'">Book</button></div></div></article>';
 }).join("")||'<p class="nores">No cars match your search.</p>';
 $("more").hidden=shown>=list.length;
}
function totals(){
 var d=days(),r=cur.p+($("drv").checked?30000:0);
 $("line1").textContent=cur.n+" · "+fmt(cur.p)+" × "+d+(d>1?" days":" day");
 $("line2").textContent=$("drv").checked?"Driver · "+fmt(30000)+" × "+d:"Self-drive, insurance included";
 $("total").textContent=fmt(r*d);
 $("send").disabled=!($("nm").value.trim()&&$("ph").value.trim());
}
function toast(m){var e=$("toast");e.textContent=m;e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove("on")},2800)}
function open_(o){$("book").classList.toggle("on",o);$("scrim").classList.toggle("on",o);$("book").setAttribute("aria-hidden",!o);if(o)$("close").focus();else{cur=null;resetPay()}}
document.addEventListener("click",function(e){
 var t=e.target.closest("button");if(!t)return;
 if(t.dataset.id){cur=C.filter(function(c){return c.id==t.dataset.id})[0];$("bname").textContent="Book the "+cur.n;if(ME&&USERS[ME]){if(!$("nm").value)$("nm").value=USERS[ME].name;if(!$("ph").value)$("ph").value=ME}totals();open_(true)}
 else if(t.classList.contains("tab")){filter=t.dataset.f;document.querySelectorAll(".tab").forEach(function(b){b.setAttribute("aria-pressed",b===t)});render()}
});
document.addEventListener("change",function(e){
 var k=e.target.dataset.k;if(!k)return;
 S[k]=e.target.value;
 if(S.d2<=S.d1){var d=new Date(S.d1+"T00:00");d.setDate(d.getDate()+1);S.d2=d.toISOString().slice(0,10)}
 sync();
});
["drv","nm","ph"].forEach(function(i){$(i).addEventListener("input",function(){if(cur)totals()})});
$("close").onclick=$("scrim").onclick=function(){open_(false)};
document.addEventListener("keydown",function(e){if(e.key==="Escape")open_(false)});
function total(){if(cur.only)return 1e9;return (cur.p+($("drv").checked?30000:0))*days()}
function pm(){return document.querySelector('input[name=pm]:checked').value}
function step(n){["p1","p2","p3"].forEach(function(i,k){$(i).hidden=k!==n-1})}
function resetPay(){$("book").classList.remove("paying");$("pay").hidden=true;step(1);$("code").value="";$("e1").textContent=$("e2").textContent=""}
function openPay(){
 if($("book").classList.contains("paying"))return;
 var m=pm();$("pmname").textContent="Pay with "+m;$("pmlogo").className="pl "+(m==="Airtel Money"?"lg-airtel":"lg-mtn");
 $("amt").value=cur.only?"":total();$("mm").value=$("ph").value;$("pnm").value=$("nm").value;$("bname").textContent=cur.only?"Mobile money payment":"Pay for the "+cur.n;document.querySelector(".quick").style.display=cur.only?"none":"flex";
 $("book").classList.add("paying");$("pay").hidden=false;step(1);$("book").scrollTop=0;$("mm").dispatchEvent(new Event("input"));$("amt").focus()}
$("send").onclick=openPay;
document.addEventListener("click",function(e){var o=e.target.closest(".opt");if(!o||!cur)return;o.querySelector("input").checked=true;openPay()});
function net(n){n=n.replace(/[\s+]/g,"").replace(/^250/,"0");return /^07[89]/.test(n)?"MTN Mobile Money":/^07[23]/.test(n)?"Airtel Money":""}
function setPM(m){document.querySelectorAll("input[name=pm]").forEach(function(r){r.checked=r.value===m});$("pmname").textContent="Pay with "+m;$("pmlogo").className="pl "+(m==="Airtel Money"?"lg-airtel":"lg-mtn")}
$("mm").addEventListener("input",function(){
 $("ph").value=$("mm").value;var m=net($("mm").value);
 if(m&&m!==pm())setPM(m);
 $("netnote").textContent=m?"This is an "+(m==="Airtel Money"?"Airtel":"MTN")+" number, so "+m+" is selected.":"";
 $("e1").textContent="";if(cur)totals()});
$("ph").addEventListener("input",function(){$("mm").value=$("ph").value});
$("pnm").addEventListener("input",function(){$("nm").value=$("pnm").value;if(cur)totals()});
document.addEventListener("click",function(e){var b=e.target.closest("[data-pay]");if(!b)return;
 cur={only:true,n:"",p:0};$("drv").checked=false;setPM(b.dataset.pay);open_(true);openPay()});
$("full").onclick=function(){$("amt").value=total()};
$("dep").onclick=function(){$("amt").value=Math.round(total()*0.3/100)*100};
$("back1").onclick=function(){if(cur.only){open_(false);return}resetPay();$("bname").textContent="Book the "+cur.n};
$("sendcode").onclick=function(){
 var a=+$("amt").value,t=total(),n=$("mm").value.replace(/\s/g,"");
 if(!$("pnm").value.trim()){$("e1").textContent="Enter your full name.";return}
 if(!(a>0)||(!cur.only&&a>t)){$("e1").textContent=cur.only?"Enter the amount you want to pay.":"Enter an amount between RWF 1 and "+fmt(t)+".";return}
 if(!/^(\+?250|0)7\d{8}$/.test(n)){$("e1").textContent="Enter a valid Rwanda mobile number, for example 0783 553 434.";return}
 $("e1").textContent="";$("nm").value=$("pnm").value.trim();if(!$("ph").value.trim())$("ph").value=$("mm").value;$("sent").textContent="A payment code is being sent to "+$("mm").value+" for "+fmt(a)+" with "+pm()+". Enter it below to confirm.";step(2);$("code").focus()};
$("resend").onclick=function(){toast("Code sent again to "+$("mm").value)};
$("confirm").onclick=function(){
 if(!/^\d{4,6}$/.test($("code").value.trim())){$("e2").textContent="Enter the 4 to 6 digit code from your phone.";return}
 var ref="KCR-"+Math.random().toString(36).slice(2,8).toUpperCase();
 var nm2=$("pnm").value.trim(),ph2=normPhone($("ph").value||$("mm").value),amt2=+$("amt").value;
 PAY.unshift({ref:ref,ts:Date.now(),name:nm2,phone:ph2,m:pm(),amount:amt2,car:cur.only?"":cur.n});ss("kcr_pay",PAY);
 if(!cur.only){BK.unshift({ref:ref,car:cur.n,d1:S.d1,d2:S.d2,loc:S.loc,paid:amt2,total:total(),m:pm(),drv:$("drv").checked,name:nm2,phone:ph2,ts:Date.now(),status:"Booked"});saveBK();renderBK()}
 if(cur.only){addNote("admin","Payment received",fmt(amt2)+" via "+pm()+" from "+nm2+" ("+ph2+"), ref "+ref+".");addNote(ph2,"Payment received","Your payment of "+fmt(amt2)+" via "+pm()+" was received. Reference "+ref+".")}
 else{addNote("admin","New booking "+ref,nm2+" ("+ph2+") booked the "+cur.n+", "+nice(S.d1)+" to "+nice(S.d2)+". Paid "+fmt(amt2)+" of "+fmt(total())+".");addNote(ph2,"Booking confirmed","Your booking "+ref+" for the "+cur.n+" is saved. We will call you to confirm pick-up.")}
 var wa=cur.only?"Payment "+ref+": "+fmt(amt2)+" via "+pm()+" from "+ph2+" ("+nm2+")":"New booking "+ref+": "+cur.n+", "+nice(S.d1)+" to "+nice(S.d2)+", pick-up "+S.loc+($("drv").checked?", with driver":"")+". Paid "+fmt(amt2)+" of "+fmt(total())+" via "+pm()+". "+nm2+", "+ph2+".";
 $("wasend").href="https://wa.me/250783553434?text="+encodeURIComponent(wa);
 $("rcpt").textContent=cur.only?fmt(+$("amt").value)+" paid with "+pm()+" from "+$("mm").value+". Reference "+ref+". Thank you.":fmt(+$("amt").value)+" paid with "+pm()+" for the "+cur.n+", "+nice(S.d1)+" to "+nice(S.d2)+". Booking reference "+ref+". We will call you on "+$("ph").value+" to confirm pick-up.";step(3)};
$("finish").onclick=function(){var was=cur&&!cur.only;$("nm").value=$("ph").value="";open_(false);};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function ls(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function ss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var USERS=ls("kcr_users",{}),ME=ls("kcr_me",null),PAY=ls("kcr_pay",[]),BK=ls("kcr_bk",[]),adminIn=(function(){try{return sessionStorage.getItem("kcr_ai")==="1"}catch(e){return false}})(),amode="login",atab="bookings";
function saveBK(){ss("kcr_bk",BK)}
function normPhone(n){return String(n).replace(/[\s+\-]/g,"").replace(/^250/,"0")}
function hex(a){return Array.from(new Uint8Array(a)).map(function(x){return ("0"+x.toString(16)).slice(-2)}).join("")}
function rnd(){return hex(crypto.getRandomValues(new Uint8Array(8)))}
function sha(s){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)).then(hex)}
function drawAuth(){var u=ME&&USERS[ME],d='';$("auth").innerHTML=d+(u?'<a class="btn ghost" href="#account">Hi, '+esc(u.name.split(" ")[0])+'</a><button class="btn ghost" id="lo">Log out</button>':'<button class="btn ghost" id="login">Log in</button><button class="btn" id="signup">Sign up</button>');$("chatlink").hidden=!u;dotUpdate()}
function authUI(){var ad=amode==="admin",su=amode==="signup",first=ad&&!ls("kcr_admin",null);
 $("amt2").textContent=ad?(first?"Create admin password":"Admin login"):su?"Sign up":"Log in";
 $("aname").hidden=!su;$("aphone").hidden=ad;$("aerr").textContent="";
 $("asub").textContent=ad?(first?"Create password":"Open dashboard"):su?"Create account":"Log in";
 $("apw").autocomplete=(su||first)?"new-password":"current-password";
 document.querySelectorAll("[data-am]").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.am===amode)});
 $("anote").textContent=ad?(first?"Choose a password for the owner. It is saved on this device only.":"For the owner of Kigali Car Rent."):"Accounts are saved on this device only for now."}
function openAuth(m){amode=m;$("an").value=$("ap").value=$("apw").value="";$("aerr").textContent="";authUI();$("authm").hidden=false;$("ascrim").classList.add("on");setTimeout(function(){(m==="signup"?$("an"):m==="admin"?$("apw"):$("ap")).focus()},50)}
function closeAuth(){$("authm").hidden=true;$("ascrim").classList.remove("on")}
function signIn(ph){ME=ph;ss("kcr_me",ph);closeAuth();drawAuth();renderBK();toast("Welcome, "+USERS[ph].name);location.hash="#account";route()}
function signOut(){ME=null;ss("kcr_me",null);drawAuth();renderBK();toast("You are logged out.");if(location.hash==="#account"||location.hash==="#chat"){location.hash="#top";route()}}
$("asub").onclick=function(){
 var pw=$("apw").value,er=$("aerr");er.textContent="";
 if(pw.length<6){er.textContent="Use a password with at least 6 characters.";return}
 if(amode==="admin"||(amode==="login"&&!$("ap").value.trim())){var A=ls("kcr_admin",null);
  if(!A){var s0=rnd();sha(s0+pw).then(function(x){ss("kcr_admin",{s:s0,h:x});openAdmin();toast("Admin password created.")});return}
  sha(A.s+pw).then(function(x){if(x===A.h)openAdmin();else er.textContent="Wrong password."});return}
 var ph=normPhone($("ap").value);
 if(amode==="signup"&&!/^07\d{8}$/.test(ph)){er.textContent="Enter a valid Rwanda mobile number, for example 0783 553 434.";return}
 if(amode==="signup"){var nm=$("an").value.trim();
  if(!nm){er.textContent="Enter your full name.";return}
  if(USERS[ph]){er.textContent="This number already has an account. Please log in.";return}
  var s1=rnd(),A2=ls("kcr_admin",null);
  (A2?sha(A2.s+pw).then(function(x){return x===A2.h}):Promise.resolve(false)).then(function(isAdminPw){
   if(isAdminPw){er.textContent="Please choose a different password.";return}
   return sha(s1+pw).then(function(x){USERS[ph]={name:nm,s:s1,h:x,t:Date.now()};ss("kcr_users",USERS);signIn(ph)})});return}
 var u=USERS[ph],A3=ls("kcr_admin",null);
 Promise.all([u?sha(u.s+pw):Promise.resolve(""),A3?sha(A3.s+pw):Promise.resolve("")]).then(function(r){
  if(u&&r[0]===u.h)signIn(ph);
  else if(A3&&r[1]===A3.h)openAdmin();
  else er.textContent=u?"Wrong phone number or password.":"No account for this number. Please sign up first."})};
function openAdmin(){adminIn=true;try{sessionStorage.setItem("kcr_ai","1")}catch(e){}drawAuth();closeAuth();$("admin").hidden=false;document.body.style.overflow="hidden";adRender()}
function closeAdmin(){$("admin").hidden=true;document.body.style.overflow=""}
function tbl(head,rows){return '<table><thead><tr>'+head.map(function(x){return '<th>'+x+'</th>'}).join("")+'</tr></thead><tbody>'+(rows.length?rows.join(""):'<tr><td class="none" colspan="'+head.length+'">Nothing here yet.</td></tr>')+'</tbody></table>'}
function tr(c){return '<tr>'+c.map(function(x){return '<td>'+x+'</td>'}).join("")+'</tr>'}
function adRender(){
 var q=$("adq").value.trim().toLowerCase(),ok=function(a){return !q||a.join(" ").toLowerCase().indexOf(q)>-1};
 var paid=PAY.reduce(function(s,p){return s+p.amount},0),due=BK.filter(function(b){return b.status!=="Cancelled"}).reduce(function(s,b){return s+Math.max(0,b.total-b.paid)},0);
 $("stats").innerHTML=[["Bookings",BK.length],["Payments received",fmt(paid)],["Balance due",fmt(due)],["Customers",Object.keys(USERS).length]].map(function(x){return '<div class="stat"><small>'+x[0]+'</small><b>'+x[1]+'</b></div>'}).join("");
 document.querySelectorAll("[data-at]").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.at===atab)});
 var dt=function(t){return new Date(t).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})},out;
 if(atab==="bookings"){out=tbl(["Reference","Customer","Phone","Car","Dates","Total","Paid","Status"],BK.filter(function(b){return ok([b.ref,b.name,b.phone,b.car])}).map(function(b){
  var sel='<select data-st="'+esc(b.ref)+'">'+["Booked","Picked up","Returned","Cancelled"].map(function(s){return '<option'+((b.status||"Booked")===s?" selected":"")+'>'+s+'</option>'}).join("")+'</select>';
  return tr([esc(b.ref),esc(b.name),esc(b.phone),esc(b.car),nice(b.d1)+" – "+nice(b.d2),fmt(b.total),fmt(b.paid),sel])}))}
 else if(atab==="payments"){out=tbl(["Date","Reference","Customer","Phone","Method","Amount","For"],PAY.filter(function(p){return ok([p.ref,p.name,p.phone,p.car,p.m])}).map(function(p){
  return tr([dt(p.ts),esc(p.ref),esc(p.name),esc(p.phone),esc(p.m),fmt(p.amount),esc(p.car||"Payment only")])}))}
 else if(atab==="chats"){out=chatTable(ok)}
 else{out=tbl(["Name","Phone","Joined","Bookings","Total paid"],Object.keys(USERS).filter(function(k){return ok([USERS[k].name,k])}).map(function(k){
  return tr([esc(USERS[k].name),esc(k),dt(USERS[k].t),BK.filter(function(b){return b.phone===k}).length,fmt(PAY.filter(function(p){return p.phone===k}).reduce(function(s,p){return s+p.amount},0))])}))}
 $("adtable").innerHTML=out;
 var al=NOTES.filter(function(n){return n.to==="admin"}).slice(0,5);
 $("alerts").innerHTML=al.length?'<div class="alerts"><b>Latest alerts</b>'+al.map(function(n){return '<p><span>'+esc(n.title)+'</span> '+esc(n.text)+' <small>'+ago(n.ts)+'</small></p>'}).join("")+'</div>':'';
 al.forEach(function(n){n.read=true});ss("kcr_notes",NOTES);dotUpdate()}
function renderAccount(){
 var u=ME&&USERS[ME];if(!u||!$("acname"))return;
 var mine=BK.filter(function(b){return b.phone===ME}),pays=PAY.filter(function(p){return p.phone===ME}),paid=pays.reduce(function(s,p){return s+p.amount},0);
 $("acname").textContent="Welcome, "+u.name;$("acphone").textContent=ME;
 $("acstats").innerHTML=[["Bookings",mine.length],["Total paid",fmt(paid)]].map(function(x){return '<div class="stat"><small>'+x[0]+'</small><b>'+x[1]+'</b></div>'}).join("");
 $("aclist").innerHTML=mine.length?'<div class="bkgrid">'+mine.map(function(b){var st=b.status||"Booked";return '<article class="bk"><div><h3>'+esc(b.car)+'</h3><p>'+nice(b.d1)+' to '+nice(b.d2)+' · pick-up: '+esc(b.loc)+'</p><p>Reference '+esc(b.ref)+(b.drv?' · with driver':'')+' · '+esc(st)+'</p></div><div class="bkr"><span class="badge">Paid '+fmt(b.paid)+'</span><small>of '+fmt(b.total)+' · '+esc(b.m)+'</small>'+(st==="Booked"?'<button class="link" data-cancel="'+esc(b.ref)+'">Cancel booking</button>':'')+'</div></article>'}).join("")+'</div>':'<div class="bkempty"><p>You have no bookings yet. Choose a car and your booking will appear here.</p><a class="btn" href="#fleet">Book a car</a></div>';
 $("acpay").innerHTML=tbl(["Date","Reference","Method","Amount","For"],pays.map(function(p){return tr([new Date(p.ts).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),esc(p.ref),esc(p.m),fmt(p.amount),esc(p.car||"Payment only")])}))}
function renderBK(){
 renderAccount();
 if(!$("bklist"))return;
 var u=ME&&USERS[ME];
 if(!u){$("bklist").innerHTML='<div class="bkempty"><p>Log in or sign up to see your bookings.</p><span class="btns"><button class="btn ghost" data-open="login">Log in</button><button class="btn" data-open="signup">Sign up</button></span></div>';return}
 var list=BK.filter(function(b){return b.phone===ME});
 $("bklist").innerHTML=list.length?'<div class="bkgrid">'+list.map(function(b){var st=b.status||"Booked";return '<article class="bk"><div><h3>'+esc(b.car)+'</h3><p>'+nice(b.d1)+' to '+nice(b.d2)+' · pick-up: '+esc(b.loc)+'</p><p>Reference '+esc(b.ref)+(b.drv?' · with driver':'')+' · '+esc(st)+'</p></div><div class="bkr"><span class="badge">Paid '+fmt(b.paid)+'</span><small>of '+fmt(b.total)+' · '+esc(b.m)+'</small>'+(st==="Booked"?'<button class="link" data-cancel="'+esc(b.ref)+'">Cancel booking</button>':'')+'</div></article>'}).join("")+'</div>':'<div class="bkempty"><p>You have no bookings yet. Choose a car and your booking will appear here.</p><a class="btn" href="#fleet">Book a car</a></div>'}
document.addEventListener("click",function(e){
 var c=e.target.closest("[data-cancel]");if(c){var b=BK.filter(function(x){return x.ref===c.dataset.cancel})[0];if(b){b.status="Cancelled";saveBK();renderBK();toast("Booking cancelled.")}return}
 var o=e.target.closest("button,a");if(!o)return;
 if(o.id==="login")openAuth("login");else if(o.id==="signup")openAuth("signup");else if(o.id==="lo")signOut();else if(o.id==="dash")openAdmin();
 else if(o.id==="adlink"){e.preventDefault();if(adminIn)openAdmin();else openAuth("admin")}
 else if(o.dataset.open)openAuth(o.dataset.open);
 else if(o.dataset.am){amode=o.dataset.am;authUI()}
 else if(o.dataset.at){atab=o.dataset.at;adRender()}});
document.addEventListener("change",function(e){var s=e.target.closest("[data-st]");if(!s)return;var b=BK.filter(function(x){return x.ref===s.dataset.st})[0];if(b){b.status=s.value;saveBK();renderBK();addNote(b.phone,"Booking "+b.ref+" updated","Your booking for the "+b.car+" is now: "+b.status+".");adRender()}});
$("aclose").onclick=$("ascrim").onclick=closeAuth;
$("adclose").onclick=function(){$("adout").onclick()};
$("adout").onclick=function(){adminIn=false;try{sessionStorage.removeItem("kcr_ai")}catch(e){}drawAuth();closeAdmin();toast("Admin logged out.")};
$("adq").addEventListener("input",adRender);
document.addEventListener("keydown",function(e){if(e.key==="Escape"){closeAuth();$("notes").hidden=true;closeMenus()}});
$("csend").onclick=function(){var t="Hello Kigali Car Rent, I am "+($("cn").value.trim()||"a customer")+". "+$("cm").value.trim();window.open("https://wa.me/250783553434?text="+encodeURIComponent(t),"_blank","noopener")};
var NOTES=ls("kcr_notes",[]);
if(!NOTES.some(function(n){return n.id==="welcome"})){NOTES.push({id:"welcome",ts:Date.now(),title:"Welcome to Kigali Car Rent",text:"Free cancellation up to 24 hours before pick-up. Pay with MTN Mobile Money or Airtel Money.",to:"all",read:false});ss("kcr_notes",NOTES)}
function myNotes(){return NOTES.filter(function(n){return n.to==="all"||(ME&&n.to===ME)||(adminIn&&n.to==="admin")})}
function dotUpdate(){var u=myNotes().filter(function(n){return !n.read}).length;$("dot").hidden=!u;$("dot").textContent=u>9?"9+":u}
function ago(t){var s=(Date.now()-t)/1000;return s<60?"Just now":s<3600?Math.floor(s/60)+" min ago":s<86400?Math.floor(s/3600)+" h ago":new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
function renderNotes(){var l=myNotes();$("notes").innerHTML='<div class="nhead">Notifications</div>'+(l.length?l.map(function(n){return '<div class="note'+(n.read?'':' new')+'"><b>'+esc(n.title)+'</b><span>'+esc(n.text)+'</span><small>'+ago(n.ts)+'</small></div>'}).join(""):'<p class="hint" style="padding:12px">No notifications yet.</p>')}
function addNote(to,title,text){NOTES.unshift({id:"n"+Date.now()+Math.random().toString(36).slice(2,5),ts:Date.now(),title:title,text:text,to:to,read:false});ss("kcr_notes",NOTES);dotUpdate();if(!$("notes").hidden)renderNotes()}
$("bell").onclick=function(e){e.stopPropagation();var o=$("notes").hidden;$("notes").hidden=!o;$("bell").setAttribute("aria-expanded",o);if(o){renderNotes();myNotes().forEach(function(n){n.read=true});ss("kcr_notes",NOTES);dotUpdate()}};
document.addEventListener("click",function(e){if(!e.target.closest(".bellwrap")){$("notes").hidden=true;$("bell").setAttribute("aria-expanded",false)}});
drawAuth();renderBK();
var LANG=ls("kcr_lang","en"),orig=new WeakMap();
var TX={
"Chat":["Discussion","Ubutumwa"],
"Follow us":["Suivez-nous","Dukurikire"],
"Home":["Accueil","Ahabanza"],"Bookings":["Réservations","Kodesha"],"Payment":["Paiement","Kwishyura"],"Contact":["Contact","Twandikire"],
"All categories":["Toutes les catégories","Ibyiciro byose"],"All cars":["Toutes les voitures","Imodoka zose"],
"Rent a car in Kigali. Drive all of Rwanda.":["Louez une voiture à Kigali. Roulez dans tout le Rwanda.","Kodesha imodoka i Kigali. Genda u Rwanda hose."],
"Clean, serviced cars with or without a driver. Pick up at Kigali airport or in the city, and return where it suits you.":["Voitures propres et entretenues, avec ou sans chauffeur. Récupérez-la à l’aéroport de Kigali ou en ville et rendez-la où cela vous arrange.","Imodoka zisukuye kandi zitunganyijwe, hamwe cyangwa nta mushoferi. Uyifatire ku kibuga cy’indege cya Kigali cyangwa mu mujyi, uyisubize aho bikubereye."],
"Book a car":["Réserver une voiture","Kodesha imodoka"],"Our cars":["Nos voitures","Imodoka zacu"],
"Choose your dates and pick-up place when you book.":["Choisissez vos dates et le lieu de prise en charge lors de la réservation.","Hitamo amatariki n’aho utwarira imodoka igihe ukodesha."],
"All":["Tout","Zose"],"Economy":["Économique","Zihendutse"],
"Pay with mobile money":["Payer par mobile money","Ishyura na Mobile Money"],
"Choose MTN or Airtel, enter your number and the amount, and we send a code to your phone.":["Choisissez MTN ou Airtel, entrez votre numéro et le montant, et nous envoyons un code sur votre téléphone.","Hitamo MTN cyangwa Airtel, andika nimero yawe n’amafaranga, maze twohereze kode kuri telefone yawe."],
"Book in three steps":["Réservez en trois étapes","Kodesha mu ntambwe eshatu"],"Choose your car":["Choisissez votre voiture","Hitamo imodoka yawe"],
"Pick the dates and a car that fits your trip and your group.":["Choisissez les dates et une voiture adaptée à votre trajet et à votre groupe.","Hitamo amatariki n’imodoka ikwiye urugendo rwawe n’itsinda ryawe."],
"Send your request":["Envoyez votre demande","Ohereza ubusabe bwawe"],
"Add your name and phone number. We confirm by call or WhatsApp within an hour.":["Ajoutez votre nom et votre numéro de téléphone. Nous confirmons par appel ou WhatsApp en moins d’une heure.","Andika izina ryawe na nimero ya telefone. Tuguhamagara cyangwa tukwandikire kuri WhatsApp mu isaha imwe."],
"Pick up and go":["Récupérez et partez","Fata imodoka ugende"],
"Show your driving licence, check the car with us and drive off.":["Présentez votre permis de conduire, vérifiez la voiture avec nous et partez.","Erekana uruhushya rwo gutwara, ugenzure imodoka natwe, maze ugende."],
"Contact us":["Contactez-nous","Twandikire"],"Call us":["Appelez-nous","Duhamagare"],"Email":["E-mail","Imeyili"],"Location":["Adresse","Aho turi"],"Kigali, Rwanda":["Kigali, Rwanda","Kigali, u Rwanda"],
"Your name":["Votre nom","Amazina yawe"],"Message":["Message","Ubutumwa"],"Send on WhatsApp":["Envoyer sur WhatsApp","Ohereza kuri WhatsApp"],"Send by email":["Envoyer par e-mail","Ohereza kuri imeyili"],
"Free cancellation":["Annulation gratuite","Guhagarika ku buntu"],"up to 24 hours before":["jusqu’à 24 heures avant","kugeza ku masaha 24 mbere"],"Insurance":["Assurance","Ubwishingizi"],"included":["incluse","burimo"],
"Pay":["Payez","Ishyura"],"with":["avec","na"],"or":["ou","cyangwa"],
"Book":["Réserver","Kodesha"],"per day":["par jour","ku munsi"],"View more":["Voir plus","Reba izindi"],"No cars match your search.":["Aucune voiture ne correspond à votre recherche.","Nta modoka ihuye n’ibyo washakishije."],
"Pick-up place":["Lieu de prise en charge","Aho utwarira imodoka"],"Pick-up date":["Date de prise en charge","Itariki yo gutwara"],"Return date":["Date de retour","Itariki yo gusubiza"],
"Add a driver (+ RWF 30,000 per day)":["Ajouter un chauffeur (+ 30 000 RWF par jour)","Ongeraho umushoferi (+ RWF 30,000 ku munsi)"],
"Full name":["Nom complet","Amazina yose"],"Phone":["Téléphone","Telefone"],"Pay with":["Payer avec","Ishyura na"],"Total":["Total","Igiteranyo"],"Continue to payment":["Continuer vers le paiement","Komeza wishyure"],
"Enter the amount you want to pay and your mobile money number. We will send a payment code to that phone.":["Saisissez le montant à payer et votre numéro mobile money. Nous enverrons un code de paiement à ce téléphone.","Andika amafaranga ushaka kwishyura na nimero yawe ya mobile money. Tuzohereza kode yo kwishyura kuri iyo telefone."],
"Amount (RWF)":["Montant (RWF)","Amafaranga (RWF)"],"Pay full amount":["Payer le montant total","Ishyura yose"],"Pay 30% deposit":["Payer un acompte de 30 %","Ishyura avansi ya 30%"],
"Mobile money number":["Numéro mobile money","Nimero ya mobile money"],"Send payment code":["Envoyer le code de paiement","Ohereza kode yo kwishyura"],"← Back to booking":["← Retour à la réservation","← Subira inyuma"],
"Payment code":["Code de paiement","Kode yo kwishyura"],"Confirm payment":["Confirmer le paiement","Emeza kwishyura"],"Send the code again":["Renvoyer le code","Ohereza kode ukundi"],
"Payment received":["Paiement reçu","Kwishyura byakiriwe"],"Send details on WhatsApp":["Envoyer les détails sur WhatsApp","Ohereza ibisobanuro kuri WhatsApp"],"Done":["Terminé","Byarangiye"],
"Log in":["Se connecter","Injira"],"Sign up":["S’inscrire","Iyandikishe"],"Log out":["Se déconnecter","Sohoka"],"Phone number":["Numéro de téléphone","Nimero ya telefone"],"Password":["Mot de passe","Ijambobanga"],
"Create account":["Créer un compte","Fungura konti"],"Admin log in":["Connexion admin","Injira nk’umuyobozi"],"Customer log in":["Connexion client","Injira nk’umukiriya"],
"Notifications":["Notifications","Amatangazo"],"No notifications yet.":["Aucune notification.","Nta matangazo ahari."],
"Search cars, e.g. RAV4, SUV, Safari":["Rechercher une voiture, ex. RAV4, SUV, Safari","Shakisha imodoka, urugero RAV4, SUV, Safari"],
"Tell us which car and which dates you need":["Dites-nous quelle voiture et quelles dates","Tubwire imodoka n’amatariki ukeneye"]};
function has(o,k){return Object.prototype.hasOwnProperty.call(o,k)}
function trN(n){var base=orig.has(n)?orig.get(n):n.nodeValue,t=base.trim();
 if(LANG!=="en"&&has(TX,t)){orig.set(n,base);n.nodeValue=base.replace(t,TX[t][LANG==="fr"?0:1])}else if(orig.has(n)){n.nodeValue=orig.get(n)}}
function walk(r,fn){if(r.nodeType===3){fn(r);return}if(r.nodeType!==1)return;var w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT,{acceptNode:function(n){return /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}}),n;while(n=w.nextNode())fn(n)}
function applyLang(l){LANG=l;ss("kcr_lang",l);document.documentElement.lang=l==="rw"?"rw":l;
 walk(document.body,trN);
 document.querySelectorAll("[placeholder]").forEach(function(e){var en=e.dataset.en||(e.dataset.en=e.getAttribute("placeholder"));e.setAttribute("placeholder",l!=="en"&&has(TX,en)?TX[en][l==="fr"?0:1]:en)});
 $("langlabel").textContent={en:"English",fr:"Français",rw:"Kinyarwanda"}[l]+"-RWF"}
new MutationObserver(function(ms){if(LANG==="en")return;ms.forEach(function(m){m.addedNodes.forEach(function(n){walk(n,trN)})})}).observe(document.body,{childList:true,subtree:true});
function goCars(){query=$("q").value;render();if(location.hash!=="#fleet")location.hash="#fleet";else $("fleet").scrollIntoView()}
$("q").addEventListener("input",function(){query=$("q").value;render();if(query&&!document.body.classList.contains("v-home"))location.hash="#fleet"});
$("q").addEventListener("keydown",function(e){if(e.key==="Enter")goCars()});
$("qgo").onclick=goCars;
function closeMenus(){$("langmenu").hidden=true;$("catmenu").hidden=true;$("langbtn").setAttribute("aria-expanded",false);$("catbtn").setAttribute("aria-expanded",false)}
$("langbtn").onclick=function(e){e.stopPropagation();var o=$("langmenu").hidden;closeMenus();$("langmenu").hidden=!o;$("langbtn").setAttribute("aria-expanded",o)};
$("catbtn").onclick=function(e){e.stopPropagation();var o=$("catmenu").hidden;closeMenus();$("catmenu").hidden=!o;$("catbtn").setAttribute("aria-expanded",o)};
document.addEventListener("click",function(e){
 var l=e.target.closest("[data-lang]");if(l){applyLang(l.dataset.lang);closeMenus();return}
 var c=e.target.closest("[data-cat]");if(c){filter=c.dataset.cat;query="";$("q").value="";document.querySelectorAll(".tab").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.f===filter)});render();closeMenus();if(location.hash!=="#fleet")location.hash="#fleet";else $("fleet").scrollIntoView();return}
 if(e.target.closest("#more")){shown+=9;render();return}
 if(!e.target.closest(".lang")&&!e.target.closest(".catwrap"))closeMenus()});
$("cmail").onclick=function(){var n=$("cn").value.trim()||"a customer";window.open("mailto:iradukundaellaherve@gmail.com?subject="+encodeURIComponent("Car rental request")+"&body="+encodeURIComponent("Hello Kigali Car Rent,\n\nI am "+n+".\n"+$("cm").value.trim()),"_blank","noopener")};

(function(){
 var box=$("bgs"),ids=[1,2,3,20,23,17],k=0,sl=ids.map(function(id,i){var c=C.filter(function(x){return x.id===id})[0],d=document.createElement("div");d.className="s";d.style.backgroundImage="url("+c.img+")";d.style.animationDelay=(-i*3)+"s";box.appendChild(d);return d});
 sl[0].classList.add("on");
 if(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)return;
 setInterval(function(){sl[k].classList.remove("on");k=(k+1)%sl.length;sl[k].classList.add("on")},6000);
 window.addEventListener("scroll",function(){var y=window.scrollY;if(y<800)box.style.transform="translate3d(0,"+Math.round(y*0.25)+"px,0)"},{passive:true});
})();
var CHAT=ls("kcr_chat",{});
function saveChat(){ss("kcr_chat",CHAT)}
function hm(t){return new Date(t).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}
function botReply(q){q=q.toLowerCase();
 if(/price|cost|how much|rwf|rate|cheap/.test(q))return "Our cars start from "+fmt(Math.min.apply(null,C.map(function(c){return c.p})))+" per day. The price is on every car card, and you can add a driver for RWF 30,000 per day.";
 if(/cancel/.test(q))return "You can cancel for free up to 24 hours before pick-up.";
 if(/pay|momo|mtn|airtel|money/.test(q))return "You can pay with MTN Mobile Money or Airtel Money. Open the Payment page, choose your network, then enter your number and the amount.";
 if(/driver/.test(q))return "Yes, you can add a driver for RWF 30,000 per day when you book.";
 if(/pick|airport|where|location|musanze|huye|rubavu/.test(q))return "Pick-up places: Kigali International Airport, Kigali city centre, Musanze, Huye and Rubavu.";
 if(/book|reserve|available|rent/.test(q))return "To book, open Home, choose a car and press Book. Pick your dates and pick-up place, then pay.";
 if(/^(hello|hi|hey|muraho|bonjour)/.test(q))return "Hello! How can we help you today? Ask about prices, booking, payment or cancellation.";
 return "Thank you for your message. For a quick answer please call or WhatsApp 0783 553 434."}
function renderChat(){
 var u=ME&&USERS[ME];if(!u||!$("msgs"))return;
 $("chatwho").textContent="Chatting as "+u.name+" ("+ME+")";
 var l=CHAT[ME]||[];if(!l.length)l=[{f:"bot",t:"Hello "+u.name.split(" ")[0]+"! Ask us about prices, booking, payment or cancellation.",ts:Date.now()}];
 $("msgs").innerHTML=l.map(function(m){return '<div class="m '+(m.f==="me"?"me":"them")+'">'+esc(m.t)+'<small>'+(m.f==="team"?"Kigali Car Rent team · ":m.f==="bot"?"Auto-reply · ":"")+hm(m.ts)+'</small></div>'}).join("");
 $("msgs").scrollTop=$("msgs").scrollHeight}
function sendChat(text){
 text=String(text).trim();var ph=ME,u=ph&&USERS[ph];if(!text||!u)return;
 (CHAT[ph]=CHAT[ph]||[]).push({f:"me",t:text,ts:Date.now()});saveChat();renderChat();
 addNote("admin","New chat message",u.name+" ("+ph+"): "+text.slice(0,80));
 setTimeout(function(){(CHAT[ph]=CHAT[ph]||[]).push({f:"bot",t:botReply(text),ts:Date.now()});saveChat();if(ME===ph&&route.v==="chat")renderChat()},700)}
$("chsend").onclick=function(){sendChat($("cin").value);$("cin").value="";$("cin").focus()};
$("cin").addEventListener("keydown",function(e){if(e.key==="Enter"){sendChat($("cin").value);$("cin").value=""}});
document.addEventListener("click",function(e){var q=e.target.closest("[data-q]");if(q)sendChat(q.dataset.q);
 var b=e.target.closest("[data-sendrep]");if(!b)return;var k=b.dataset.sendrep,inp=document.querySelector('[data-rep="'+k+'"]'),t=inp?inp.value.trim():"";if(!t)return;
 (CHAT[k]=CHAT[k]||[]).push({f:"team",t:t,ts:Date.now()});saveChat();addNote(k,"New reply from Kigali Car Rent",t.slice(0,100));adRender()});
window.addEventListener("storage",function(e){if(e.key==="kcr_chat"){CHAT=ls("kcr_chat",{});if(route.v==="chat")renderChat()}});
function chatTable(ok){
 var keys=Object.keys(CHAT).filter(function(k){return CHAT[k].length&&ok([k,(USERS[k]||{}).name||""])});
 keys.sort(function(a,b){return CHAT[b][CHAT[b].length-1].ts-CHAT[a][CHAT[a].length-1].ts});
 return tbl(["Customer","Phone","Conversation","Reply"],keys.map(function(k){var nm=(USERS[k]||{}).name||"Customer";
  var th=CHAT[k].slice(-4).map(function(m){return '<div><b>'+(m.f==="me"?esc(nm):m.f==="team"?"You":"Auto-reply")+':</b> '+esc(m.t)+'</div>'}).join("");
  return tr([esc(nm),esc(k),'<div class="thread">'+th+'</div>','<div class="rep"><input data-rep="'+esc(k)+'" placeholder="Type a reply"><button class="btn" data-sendrep="'+esc(k)+'" type="button">Send</button></div>'])}))}
function route(){
 var k=location.hash.replace("#",""),v=(k==="pay-now"||k==="how")?"payment":k==="contact"?"contact":k==="account"?"account":k==="chat"?"chat":"home";
 if((v==="account"||v==="chat")&&!(ME&&USERS[ME])){location.hash="#top";openAuth("login");return}
 document.body.className=document.body.className.replace(/\bv-\w+/g,"").trim()+" v-"+v;
 if(v==="account")renderAccount();
 if(v==="chat")renderChat();
 if(v!==route.v||k==="top"||k==="")window.scrollTo(0,0);
 if(v==="home"&&k==="fleet"&&$("fleet"))$("fleet").scrollIntoView();
 route.v=v}
window.addEventListener("hashchange",route);route();
sync();
if(LANG!=="en")applyLang(LANG);
