const WA_NUMBER="916207120625";
const CHANNEL_URL="https://whatsapp.com/channel/0029VbBiWLTHbFVA9MesXj3f";
const districts=["अररिया","अरवल","औरंगाबाद","बांका","बेगूसराय","भागलपुर","भोजपुर","बक्सर","दरभंगा","पूर्वी चंपारण","गया","गोपालगंज","जमुई","जहानाबाद","कैमूर","कटिहार","खगड़िया","किशनगंज","लखीसराय","मधेपुरा","मधुबनी","मुंगेर","मुजफ्फरपुर","नालंदा","नवादा","पटना","पूर्णिया","रोहतास","सहरसा","समस्तीपुर","सारण","शेखपुरा","शिवहर","सीतामढ़ी","सिवान","सुपौल","वैशाली","पश्चिमी चंपारण"];
let currentService="खतियान", step=1;

document.addEventListener("DOMContentLoaded",()=>{
  const d=document.getElementById("district");
  districts.forEach(x=>{const o=document.createElement("option");o.value=x;o.textContent=x;d.appendChild(o)});
  d.addEventListener("change",()=>{document.getElementById("block").innerHTML='<option value="">अंचल / प्रखंड चुनें</option><option>उपलब्ध जानकारी के अनुसार</option>'});
  document.getElementById("sameWa").addEventListener("change",e=>{
    if(e.target.checked) document.getElementById("whatsapp").value=document.getElementById("mobile").value;
  });
  document.getElementById("mobile").addEventListener("input",e=>{
    if(document.getElementById("sameWa").checked) document.getElementById("whatsapp").value=e.target.value;
  });
  document.querySelectorAll(".next").forEach(b=>b.addEventListener("click",()=>goStep(step+1)));
  document.querySelectorAll(".prev").forEach(b=>b.addEventListener("click",()=>goStep(step-1)));
  setTimeout(()=>{ if(!sessionStorage.getItem("anmolChannelClosed")) document.getElementById("channelPopup").style.display="grid"; },900);
});

function toggleMenu(){
  const nav=document.getElementById("nav");
  if(getComputedStyle(nav).display==="none"){
    nav.style.display="flex";nav.style.position="absolute";nav.style.top="72px";nav.style.left="0";nav.style.right="0";
    nav.style.background="#fff";nav.style.padding="18px";nav.style.flexDirection="column";nav.style.boxShadow="0 15px 30px #003d2e18";
  }else nav.removeAttribute("style");
}
function closeChannel(){document.getElementById("channelPopup").style.display="none";sessionStorage.setItem("anmolChannelClosed","1")}
function openForm(service){
  currentService=service;step=1;
  document.getElementById("formTitle").textContent=service==="खतियान"?"पुराना खतियान":service;
  document.getElementById("formIcon").textContent=service==="खतियान"?"▤":service==="केवाला"?"▧":service==="जमाबंदी"?"☷":"▣";
  document.getElementById("formModal").classList.add("open");
  document.body.style.overflow="hidden";goStep(1);
}
function closeForm(){document.getElementById("formModal").classList.remove("open");document.body.style.overflow=""}
function goStep(n){
  if(n<1||n>3)return;
  step=n;
  document.querySelectorAll(".form-step").forEach(x=>x.classList.toggle("active",+x.dataset.step===step));
  document.querySelectorAll(".steps b").forEach((x,i)=>x.classList.toggle("active",i<step));
}
function val(id){return document.getElementById(id).value.trim()}
function submitApplication(e){
  e.preventDefault();
  const mobile=val("mobile"), wa=val("whatsapp")||mobile;
  if(!/^\d{10}$/.test(mobile)||!/^\d{10}$/.test(wa)){alert("कृपया 10 अंकों का सही मोबाइल / WhatsApp नंबर भरें।");return false}
  const now=new Date(), pad=n=>String(n).padStart(2,"0");
  const id=`ABS-BH-${String(now.getFullYear()).slice(-2)}${pad(now.getMonth()+1)}${pad(now.getDate())}-${Math.floor(1000+Math.random()*9000)}`;
  const msg=`नया भूमि रिकॉर्ड आवेदन
Application ID: ${id}

सेवा: ${currentService}

जमीन का स्थान:
राज्य: बिहार
जिला: ${val("district")||"उपलब्ध नहीं"}
अंचल/प्रखंड: ${val("block")||"उपलब्ध नहीं"}
हल्का/पंचायत: ${val("halka")||"उपलब्ध नहीं"}
मौजा/गाँव: ${val("village")||"उपलब्ध नहीं"}

रिकॉर्ड की जानकारी:
रैयत/जमीन मालिक: ${val("owner")||"उपलब्ध नहीं"}
खाता संख्या: ${val("khata")||"उपलब्ध नहीं"}
प्लॉट/खेसरा संख्या: ${val("khesra")||"उपलब्ध नहीं"}
जमाबंदी संख्या: ${val("jamabandi")||"उपलब्ध नहीं"}
पृष्ठ संख्या: ${val("page")||"उपलब्ध नहीं"}
भाग संख्या: ${val("part")||"उपलब्ध नहीं"}
कम्प्यूटरीकृत जमाबंदी: ${val("computerJamabandi")||"उपलब्ध नहीं"}
अतिरिक्त जानकारी: ${val("extra")||"—"}

आवेदक:
नाम: ${val("applicant")}
मोबाइल: ${mobile}
WhatsApp: ${wa}
अतिरिक्त जानकारी: ${val("customerExtra")||"—"}

कृपया मेरे आवेदन की आगे की प्रक्रिया की जानकारी दें।`;
  localStorage.setItem("lastApplicationId",id);
  closeForm();
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
  setTimeout(()=>alert(`आवेदन तैयार है ✅\nApplication ID: ${id}\n\nWhatsApp खुल रहा है। वहाँ केवल Send दबाएँ।`),300);
  return false;
}
