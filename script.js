const WA="916207120625";
const CHANNEL_URL="#"; // बाद में अपना वास्तविक WhatsApp Channel link यहाँ डालें

const districts=["अररिया","अरवल","औरंगाबाद","बांका","बेगूसराय","भागलपुर","भोजपुर","बक्सर","दरभंगा","पूर्वी चंपारण","गया","गोपालगंज","जमुई","जहानाबाद","कैमूर","कटिहार","खगड़िया","किशनगंज","लखीसराय","मधेपुरा","मधुबनी","मुंगेर","मुजफ्फरपुर","नालंदा","नवादा","पटना","पूर्णिया","रोहतास","सहरसा","समस्तीपुर","सारण","शेखपुरा","शिवहर","सीतामढ़ी","सिवान","सुपौल","वैशाली","पश्चिमी चंपारण"];
const sampleBlocks=["मुख्य अंचल","नगर अंचल","सदर अंचल","ग्रामीण अंचल"];
const sampleHalka=["हल्का 01","हल्का 02","हल्का 03","हल्का 04"];
const sampleVillages=["मौजा / गाँव 01","मौजा / गाँव 02","मौजा / गाँव 03","मौजा / गाँव 04"];

const district=document.querySelector("#district"), block=document.querySelector("#block"), halka=document.querySelector("#halka"), village=document.querySelector("#village");
districts.forEach(d=>district.add(new Option(d,d)));
function fill(sel, arr, placeholder){sel.innerHTML="";sel.add(new Option(placeholder,""));arr.forEach(x=>sel.add(new Option(x,x)));sel.disabled=false}
district.addEventListener("change",()=>{block.disabled=true;halka.disabled=true;village.disabled=true;if(district.value)fill(block,sampleBlocks,"अंचल / प्रखंड चुनें")});
block.addEventListener("change",()=>{halka.disabled=true;village.disabled=true;if(block.value)fill(halka,sampleHalka,"हल्का (पंचायत) चुनें")});
halka.addEventListener("change",()=>{village.disabled=true;if(halka.value)fill(village,sampleVillages,"मौजा / गाँव चुनें")});

let current=1;
const steps=[...document.querySelectorAll(".step")];
function showStep(n){
 current=n;steps.forEach(s=>s.classList.toggle("active-step",+s.dataset.step===n));
 document.querySelectorAll(".progress span").forEach((s,i)=>s.classList.toggle("active",i<n));
 if(n===4) buildReview();
 document.querySelector("#application").scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll(".next").forEach(b=>b.addEventListener("click",()=>{
 if(current===1 && (!district.value||!block.value||!halka.value||!village.value)){alert("कृपया जमीन का स्थान पूरा भरें।");return}
 if(current===3){
  const m=document.querySelector("#mobile").value.trim();
  if(!/^\d{10}$/.test(m)){alert("कृपया 10 अंकों का सही मोबाइल नंबर भरें।");return}
 }
 showStep(Math.min(4,current+1));
}));
document.querySelectorAll(".back").forEach(b=>b.addEventListener("click",()=>showStep(Math.max(1,current-1))));

document.querySelector("#sameWa").addEventListener("change",e=>{
 const w=document.querySelector("#whatsapp"),m=document.querySelector("#mobile");
 if(e.target.checked){w.value=m.value;w.readOnly=true}else{w.readOnly=false}
});
document.querySelector("#mobile").addEventListener("input",e=>{
 e.target.value=e.target.value.replace(/\D/g,"").slice(0,10);
 if(document.querySelector("#sameWa").checked)document.querySelector("#whatsapp").value=e.target.value;
});
document.querySelector("#whatsapp").addEventListener("input",e=>e.target.value=e.target.value.replace(/\D/g,"").slice(0,10));

document.querySelectorAll(".add").forEach(btn=>btn.addEventListener("click",()=>{
 const target=document.getElementById(btn.dataset.target), label=target.querySelector("label").cloneNode(true);
 label.querySelector("input").value="";
 target.appendChild(label);
}));

let selectedService="पुराना खतियान";
document.querySelectorAll("[data-service]").forEach(el=>el.addEventListener("click",()=>{
 selectedService=el.dataset.service;
 document.querySelector("#application").scrollIntoView({behavior:"smooth"});
}));

function values(name){return [...document.querySelectorAll(`[name="${name}"]`)].map(x=>x.value.trim()).filter(Boolean).join(", ")||"उपलब्ध नहीं";}
function buildReview(){
 const mobile=document.querySelector("#mobile").value.trim();
 const wa=document.querySelector("#sameWa").checked?mobile:(document.querySelector("#whatsapp").value.trim()||"उपलब्ध नहीं");
 document.querySelector("#review").innerHTML=`
 <p><b>सेवा:</b> ${selectedService}</p>
 <p><b>जमीन का स्थान:</b><br>राज्य: बिहार<br>जिला: ${district.value}<br>अंचल/प्रखंड: ${block.value}<br>हल्का (पंचायत): ${halka.value}<br>मौजा/गाँव: ${village.value}</p>
 <p><b>जमीन की जानकारी:</b><br>रैयत: ${document.querySelector("#raiyat").value||"उपलब्ध नहीं"}<br>खाता: ${values("khata[]")}<br>प्लॉट/खेसरा: ${values("plot[]")}<br>जमाबंदी: ${values("jamabandi[]")}<br>पृष्ठ: ${document.querySelector("#page").value||"उपलब्ध नहीं"}<br>भाग: ${document.querySelector("#part").value||"उपलब्ध नहीं"}<br>कम्प्यूटरीकृत जमाबंदी: ${document.querySelector("#computerized").value||"उपलब्ध नहीं"}</p>
 <p><b>आवेदक:</b><br>नाम: ${document.querySelector("#applicant").value}<br>मोबाइल: ${mobile}<br>WhatsApp: ${wa}</p>
 <p><b>अतिरिक्त जानकारी:</b> ${document.querySelector("#extra").value||"नहीं"}</p>`;
}
document.querySelector("#landForm").addEventListener("submit",e=>{
 e.preventDefault(); buildReview();
 const mobile=document.querySelector("#mobile").value.trim();
 const wa=document.querySelector("#sameWa").checked?mobile:(document.querySelector("#whatsapp").value.trim()||"उपलब्ध नहीं");
 const msg=`नया भूमि रिकॉर्ड आवेदन

सेवा: ${selectedService}

जमीन का स्थान:
जिला: ${district.value}
अंचल/प्रखंड: ${block.value}
हल्का (पंचायत): ${halka.value}
मौजा/गाँव: ${village.value}

जमीन की जानकारी:
रैयत का नाम: ${document.querySelector("#raiyat").value||"उपलब्ध नहीं"}
खाता संख्या: ${values("khata[]")}
प्लॉट/खेसरा: ${values("plot[]")}
जमाबंदी संख्या: ${values("jamabandi[]")}
पृष्ठ संख्या: ${document.querySelector("#page").value||"उपलब्ध नहीं"}
भाग संख्या: ${document.querySelector("#part").value||"उपलब्ध नहीं"}
कम्प्यूटरीकृत जमाबंदी: ${document.querySelector("#computerized").value||"उपलब्ध नहीं"}

आवेदक:
नाम: ${document.querySelector("#applicant").value}
मोबाइल: ${mobile}
WhatsApp: ${wa}

अतिरिक्त जानकारी: ${document.querySelector("#extra").value||"नहीं"}

कृपया मेरे आवेदन की आगे की प्रक्रिया और भुगतान की जानकारी दें।`;
 window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank");
});

document.querySelector(".menu-btn").addEventListener("click",()=>document.querySelector(".nav-links").classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".nav-links").classList.remove("open")));

function setChannel(el){el.href=CHANNEL_URL;if(CHANNEL_URL==="#")el.addEventListener("click",e=>{e.preventDefault();alert("अपना WhatsApp Channel link script.js में CHANNEL_URL पर डालें।")})}
setChannel(document.querySelector("#channelBtn"));setChannel(document.querySelector("#popupChannel"));

const popup=document.querySelector("#channelPopup");
if(!sessionStorage.getItem("channelDismissed"))setTimeout(()=>popup.style.display="block",1800);
document.querySelector("#closePopup").onclick=()=>{popup.style.display="none";sessionStorage.setItem("channelDismissed","1")};
document.querySelector("#laterPopup").onclick=()=>{popup.style.display="none";sessionStorage.setItem("channelDismissed","1")};
