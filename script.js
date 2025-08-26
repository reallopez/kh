let loadedPlugins = []; 

/* Element(s?) */ 
const splashScreen = document.createElement('splashScreen'); 

/* Misc Styles */ 
document.head.appendChild(Object.assign(document.createElement("style"),{innerHTML:"@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}" })); 
document.head.appendChild(Object.assign(document.createElement('style'),{innerHTML:"::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"})); 
document.querySelector("link[rel~='icon']").href = 'https://edusolver.com.br/static/images/logo.png'; 

/* Emmiter */ 
class EventEmitter{constructor(){this.events={}}on(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]||(this.events[t]=[]),this.events[t].push(e)})}off(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]&&(this.events[t]=this.events[t].filter(t=>t!==e))})}emit(t,...e){this.events[t]&&this.events[t].forEach(t=>{t(...e)})}once(t,e){"string"==typeof t&&(t=[t]);let s=(...i)=>{e(...i),this.off(t,s)};this.on(t,s)}}; 
const plppdo = new EventEmitter(); 

new MutationObserver((mutationsList) => { for (let mutation of mutationsList) if (mutation.type === 'childList') plppdo.emit('domChanged'); }).observe(document.body, { childList: true, subtree: true }); 

/* Misc Functions */ 
const delay = (min, max) => new Promise(resolve => {
    const randomTime = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, randomTime);
});
const playAudio = url => { const audio = new Audio(url); audio.play(); }; 
const findAndClickBySelector = selector => { const element = document.querySelector(selector); if (element) { element.click(); sendToast(`⭕ Pressionando ${selector}...`, 1000); } }; 

function sendToast(text, duration=1000, gravity='bottom') { Toastify({ text: text, duration: duration, gravity: gravity, position: "center", stopOnFocus: true, style: { background: "#000000" } }).showToast(); }; 

async function showSplashScreen() { splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:white;font-family:MuseoSans,sans-serif;font-size:30px;text-align:center;"; splashScreen.innerHTML = '<span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span>'; document.body.appendChild(splashScreen); setTimeout(() => splashScreen.style.opacity = '1', 10);}; 
async function hideSplashScreen() { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 1000); }; 

async function loadScript(url, label) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            loadedPlugins.push(label);
            resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
    });
}
async function loadCss(url) { 
    return new Promise((resolve) => { 
        const link = document.createElement('link'); 
        link.rel = 'stylesheet'; 
        link.type = 'text/css'; 
        link.href = url; 
        link.onload = () => resolve(); 
        document.head.appendChild(link); 
    }); 
} 

/* Main Functions */ 
function setupMain(){ 
    /* QuestionSpoof (Controlada por F8) */ 
    (function () { 
        const phrases = [ 
            "🔥 Get good, get [Khanware](https://github.com/Niximkk/khanware/)!", 
            "🤍 Made by [@im.nix](https://e-z.bio/sounix).", 
            "☄️ By [Niximkk/khanware](https://github.com/Niximkk/khanware/).", 
            "🌟 Star the project on [GitHub](https://github.com/Niximkk/khanware/)!", 
            "🪶 Lite mode @ KhanwareMinimal.js", 
        ]; 
        
        let isQuestionSpoofActive = false; 

        const originalFetch = window.fetch; 
        
        window.fetch = async function (input, init) { 
            let body; 
            if (input instanceof Request) body = await input.clone().text(); 
            else if (init && init.body) body = init.body; 
        
            const originalResponse = await originalFetch.apply(this, arguments); 
            const clonedResponse = originalResponse.clone(); 
        
            if (isQuestionSpoofActive) {
                try { 
                    const responseBody = await clonedResponse.text(); 
                    let responseObj = JSON.parse(responseBody); 
                    if (responseObj?.data?.assessmentItem?.item?.itemData) { 
                        let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData); 
                        if(itemData.question.content[0] === itemData.question.content[0].toUpperCase()){ 
                            itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false } 
                            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`; 
                            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "Resposta correta.", correct: true }, { content: "Resposta incorreta.", correct: false } ] } } }; 
                            responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData); 
                            return new Response(JSON.stringify(responseObj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers }); 
                        } 
                    } 
                } catch (e) { } 
            }
            return originalResponse; 
        }; 

        document.addEventListener('keydown', (event) => {
            if (event.key === 'F8') {
                event.preventDefault(); 
                isQuestionSpoofActive = !isQuestionSpoofActive;
                const status = isQuestionSpoofActive ? 'ativado' : 'desativado';
                sendToast(`Question Spoof ${status}.`, 200);
            }
        });
    })(); 

    /* VideoSpoof */ 
    (function () { 
        const originalFetch = window.fetch; 

        window.fetch = async function (input, init) { 
            let body; 
            if (input instanceof Request) body = await input.clone().text(); 
            else if (init && init.body) body = init.body; 
            if (body && body.includes('"operationName":"updateUserVideoProgress"')) { 
                try { 
                    let bodyObj = JSON.parse(body); 
                    if (bodyObj.variables && bodyObj.variables.input) { 
                        const durationSeconds = bodyObj.variables.input.durationSeconds; 
                        bodyObj.variables.input.secondsWatched = durationSeconds; 
                        bodyObj.variables.input.lastSecondWatched = durationSeconds; 
                        body = JSON.stringify(bodyObj); 
                        if (input instanceof Request) { input = new Request(input, { body: body }); } 
                        else init.body = body; 
                    } 
                } catch (e) { console.error(`🚨 Error @ videoSpoof.js\n${e}`); } 
            } 
            return originalFetch.apply(this, arguments); 
        }; 
    })(); 

    /* MinuteFarm */ 
    (function () { 
        const originalFetch = window.fetch; 

        window.fetch = async function (input, init = {}) { 
            let body; 
            if (input instanceof Request) body = await input.clone().text(); 
            else if (init.body) body = init.body; 
            if (body && input.url.includes("mark_conversions")) { 
                try { 
                    if (body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; } 
                } catch (e) { console.error(`🚨 Error @ minuteFarm.js\n${e}`); } 
            } 
            return originalFetch.apply(this, arguments); 
        }; 
    })(); 

    /* AutoAnswer (Controlada por F9) */ 
    (function () { 
        const baseSelectors = [ 
            `[data-testid="choice-icon__library-choice-icon"]`, 
            `[data-testid="exercise-check-answer"]`, 
            `[data-testid="exercise-next-question"]`, 
            `._1udzurba`, 
            `._awve9b`,
            `._1wi2tma4`,
            `._yxvt1q8`, 
        ]; 
        
        let intervalId = null; 
        let isAutoAnswerActive = false;

        const startAutoAnswer = () => {
            if (intervalId === null) {
                intervalId = setInterval(() => {
                    for (const q of baseSelectors) { 
                        findAndClickBySelector(q); 
                        if (document.querySelector(q + "> div") && document.querySelector(q + "> div").innerText === "Mostrar resumo") { 
                            playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                            stopAutoAnswer();
                        } 
                    } 
                }, Math.floor(Math.random() * (5000 - 1500 + 1)) + 1500);
            }
        };

        const stopAutoAnswer = () => {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'F9') {
                event.preventDefault(); 
                isAutoAnswerActive = !isAutoAnswerActive;
                const status = isAutoAnswerActive ? 'ativada' : 'desativada';
                sendToast(`Função de Auto-Resposta ${status}.`, 200);
                
                if (isAutoAnswerActive) {
                    startAutoAnswer();
                } else {
                    stopAutoAnswer();
                }
            }
        });
    })(); 
} 

/* Inject */ 
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)"); window.location.href = "https://pt.khanacademy.org/"; } 

showSplashScreen(); 

// Carrega os scripts de forma assíncrona e em sequência
(async function() {
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin');
    DarkReader.setFetchMethod(window.fetch);

    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'); 
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin');
    
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav'); 
    
    await delay(100); 

    hideSplashScreen(); 
    setupMain(); 
    console.log("OK")
})().catch(error => console.error("Erro na injeção do script:", error));
