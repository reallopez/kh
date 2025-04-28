(function() {
    const ver = "V3.0.2";

    let device = {
        mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
        apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
    };

    /* User */
    // Disclaimer: user parameters were managed by the main injector.
    // This will not change automatically.
    let user = {
        username: "Username",
        nickname: "Nickname",
        UID: 0
    }

    let loadedPlugins = [];

    /* Elements */
    const unloader = document.createElement('unloader');
    const dropdownMenu = document.createElement('dropDownMenu');
    const watermark = document.createElement('watermark');
    const splashScreen = document.createElement('splashScreen');

    /* Globals */
    window.features = {
        questionSpoof: true,
        videoSpoof: true,
        showAnswers: false,
        autoAnswer: false,
        customBanner: false,
        nextRecomendation: false,
        repeatQuestion: false,
        minuteFarmer: false,
        rgbLogo: false,
        snowEffect: false // Added feature toggle for Snow Effect
    };
    window.featureConfigs = {
        autoAnswerDelay: 3,
        customUsername: "",
        customPfp: ""
    };


    /* Misc Styles */
    // Update fonts and scrollbar styles
    document.head.appendChild(Object.assign(document.createElement("style"),{
        innerHTML:"@font-face{font-family:'MuseoSans';src:url('https://proxy.khanware.space/r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}"
    }));
    document.head.appendChild(Object.assign(document.createElement('style'),{
        innerHTML:"::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #e0f0ff; } ::-webkit-scrollbar-thumb { background: #1e90ff; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #1c86ee; }"
    }));
    const faviconLink = document.querySelector("link[rel~='icon']");
    if (faviconLink) {
        faviconLink.href = 'https://edusolver.com.br/static/images/logo.png'; // Update favicon
    } else {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = 'https://edusolver.com.br/static/images/logo.png';
        document.head.appendChild(newFavicon);
    }

    /* EventEmitter */
    class EventEmitter{
        constructor(){
            this.events = {}
        }
        on(t, e){
            if(typeof t === "string"){
                t = [t];
            }
            t.forEach(event => {
                if(!this.events[event]){
                    this.events[event] = [];
                }
                this.events[event].push(e);
            });
        }
        off(t, e){
            if(typeof t === "string"){
                t = [t];
            }
            t.forEach(event => {
                if(this.events[event]){
                    this.events[event] = this.events[event].filter(handler => handler !== e);
                }
            });
        }
        emit(t, ...e){
            if(this.events[t]){
                this.events[t].forEach(handler => {
                    handler(...e);
                });
            }
        }
        once(t, e){
            if(typeof t === "string"){
                t = [t];
            }
            let s = (...i) => {
                e(...i);
                this.off(t, s);
            };
            this.on(t, s);
        }
    };
    const plppdo = new EventEmitter();

    new MutationObserver((mutationsList) => { 
        for (let mutation of mutationsList) 
            if (mutation.type === 'childList') plppdo.emit('domChanged'); 
    }).observe(document.body, { childList: true, subtree: true });

    /* Misc Functions */
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const playAudio = url => { const audio = new Audio(url); audio.play(); };
    const checkCollision = (obj1, obj2) => !( obj1.right < obj2.left || obj1.left > obj2.right || obj1.bottom < obj2.top || obj1.top > obj2.bottom );
    const findAndClickByClass = className => { const element = document.querySelector(`.${className}`); if (element) { element.click(); sendToast(`⭕ Clicking ${className}...`, 1000); } }

    function sendToast(text, duration=5000, gravity='bottom') { 
        Toastify({ 
            text: text, 
            duration: duration, 
            gravity: gravity, 
            position: "center", 
            stopOnFocus: true, 
            style: { background: "#1e90ff" } // Blue background
        }).showToast(); 
    };

    /* Snow Effect Functions */
    // Creates the snow container
    const createSnowContainer = () => {
      const snowContainer = document.createElement('div');
      snowContainer.id = 'snow-container';
      snowContainer.style.position = 'fixed';
      snowContainer.style.top = '0';
      snowContainer.style.left = '0';
      snowContainer.style.width = '100vw';
      snowContainer.style.height = '100vh';
      snowContainer.style.pointerEvents = 'none';
      snowContainer.style.overflow = 'hidden';
      snowContainer.style.zIndex = '999'; // Adjusted to be below watermark (1001)
      document.body.appendChild(snowContainer);
    };
    
    // Function to create snowflakes
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.textContent = '❄️'; // Snowflake symbol
      snowflake.style.position = 'absolute';
      snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;
      snowflake.style.color = '#FFFFFF';
      snowflake.style.top = '-20px';
      snowflake.style.left = `${Math.random() * 100}vw`;
      snowflake.style.opacity = Math.random();
      snowflake.style.transition = 'transform 5s linear, opacity 5s ease';
      
      // Add snowflake to container
      const snowContainer = document.getElementById('snow-container');
      if (snowContainer) {
          snowContainer.appendChild(snowflake);
      }
      
      // Animate snowflake descent
      setTimeout(() => {
        snowflake.style.transform = `translateY(${window.innerHeight + 20}px)`;
        snowflake.style.opacity = '0';
      }, 100);
      
      // Remove snowflake after animation
      setTimeout(() => {
        snowflake.remove();
      }, 5000);
    };
    
    // Starts the snowfall
    const startSnowfall = () => {
      createSnowContainer();
      window.snowfallInterval = setInterval(createSnowflake, 200);
    };
    
    // Stops the snowfall and removes the container
    const stopSnowfall = () => {
      clearInterval(window.snowfallInterval);
      const snowContainer = document.getElementById('snow-container');
      if (snowContainer) {
        snowContainer.remove();
      }
    };

    /* Splash Screen Functions */
    async function showSplashScreen() { 
        splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#001f3f;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:white;font-family:MuseoSans,sans-serif;font-size:30px;text-align:center;"; // Color change
        splashScreen.innerHTML = '<img src="https://edusolver.com.br/static/images/logo.png" alt="EduSolver KhanDead Logo" style="width:150px;height:auto;">'; // Replace logo
        document.body.appendChild(splashScreen); 
        setTimeout(() => splashScreen.style.opacity = '1', 10);
    };
    async function hideSplashScreen() { 
        splashScreen.style.opacity = '0'; 
        setTimeout(() => splashScreen.remove(), 1000); 
    };

    async function loadScript(url, label) { 
        return fetch(url)
            .then(response => response.text())
            .then(script => { 
                loadedPlugins.push(label); 
                eval(script); 
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

    /* Visual Functions */
    function setupMenu() {
        const setFeatureByPath = (path, value) => { 
            let obj = window; 
            const parts = path.split('.'); 
            while (parts.length > 1) obj = obj[parts.shift()]; 
            obj[parts[0]] = value; 
        }
        function addFeature(features) {
            features.forEach(elements => {
                const feature = document.createElement('feature');
                elements.forEach(attribute => {
                    let element = attribute.type === 'nonInput' ? document.createElement('label') : document.createElement('input');
                    if (attribute.type === 'nonInput') element.innerHTML = attribute.name;
                    else { element.type = attribute.type; element.id = attribute.name; }

                    if (attribute.attributes) {
                        attribute.attributes.split(' ').map(attr => attr.split('=')).forEach(([key, value]) => {
                            value = value ? value.replace(/"/g, '') : '';
                            key === 'style' ? element.style.cssText = value : element.setAttribute(key, value);
                        });
                    }

                    if (attribute.variable) element.setAttribute('setting-data', attribute.variable);
                    if (attribute.dependent) element.setAttribute('dependent', attribute.dependent);
                    if (attribute.className) element.classList.add(attribute.className);

                    if (attribute.labeled) {
                        const label = document.createElement('label');
                        if (attribute.className) label.classList.add(attribute.className);
                        if (attribute.attributes) {
                            attribute.attributes.split(' ').map(attr => attr.split('=')).forEach(([key, value]) => {
                                value = value ? value.replace(/"/g, '') : '';
                                key === 'style' ? label.style.cssText = value : label.setAttribute(key, value);
                            });
                        }
                        label.innerHTML = `${element.outerHTML} ${attribute.label}`;
                        feature.appendChild(label);
                    } else {
                        feature.appendChild(element);
                    }
                });
                dropdownMenu.innerHTML += feature.outerHTML;
            });
        }
        function handleInput(ids, callback = null) {
            (Array.isArray(ids) ? ids.map(id => document.getElementById(id)) : [document.getElementById(ids)])
            .forEach(element => {
                if (!element) return;
                const setting = element.getAttribute('setting-data'),
                    dependent = element.getAttribute('dependent'),
                    handleEvent = (e, value) => {
                        setFeatureByPath(setting, value);
                        if (callback) callback(value, e);
                    };

                if (element.type === 'checkbox') {
                    element.addEventListener('change', (e) => {
                        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/5os0bypi.wav');
                        handleEvent(e, e.target.checked);
                        if (dependent) dependent.split(',').forEach(dep => 
                            document.querySelectorAll(`.${dep}`).forEach(depEl => 
                                depEl.style.display = e.target.checked ? null : "none"));
                    });
                } else {
                    element.addEventListener('input', (e) => handleEvent(e, e.target.value));
                }
            });
        }
        function setupWatermark() {
            Object.assign(watermark.style, {
                position: 'fixed', 
                top: '0', 
                left: '85%', 
                width: '150px', 
                height: '30px', 
                backgroundColor: 'rgba(0, 0, 139, 0.7)', // Dark blue with transparency
                color: 'white', 
                fontSize: '15px', 
                fontFamily: 'MuseoSans, sans-serif', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                cursor: 'default', 
                userSelect: 'none', 
                padding: '0 10px',  
                borderRadius: '10px', 
                zIndex: '1001', 
                transition: 'transform 0.3s ease'
            });
            if (device.mobile) watermark.style.left = '55%'
            // Replace logo in watermark
            watermark.innerHTML = `<img src="https://edusolver.com.br/static/images/logo.png" alt="EduSolver KhanDead Logo" style="width:24px;height:auto;margin-right:5px;"> <span style="color:white; font-size:12px;">${ver}</span>`;
            document.body.appendChild(watermark);
            let isDragging = false, offsetX, offsetY;
            watermark.addEventListener('mousedown', e => { 
                if (!dropdownMenu.contains(e.target)) { 
                    isDragging = true; 
                    offsetX = e.clientX - watermark.offsetLeft; 
                    offsetY = e.clientY - watermark.offsetTop; 
                    watermark.style.transform = 'scale(0.9)'; 
                    unloader.style.transform = 'scale(1)'; 
                } 
            });
            watermark.addEventListener('mouseup', () => { 
                isDragging = false; 
                watermark.style.transform = 'scale(1)'; 
                unloader.style.transform = 'scale(0)'; 
                if (checkCollision(watermark.getBoundingClientRect(), unloader.getBoundingClientRect())) unload(); 
            });
            document.addEventListener('mousemove', e => { 
                if (isDragging) { 
                    let newX = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - watermark.offsetWidth)); 
                    let newY = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - watermark.offsetHeight)); 
                    Object.assign(watermark.style, { left: `${newX}px`, top: `${newY}px` }); 
                    dropdownMenu.style.display = 'none'; 
                } 
            });
        }
        function setupDropdown() {
            Object.assign(dropdownMenu.style, {
                position: 'absolute', 
                top: '100%', 
                left: '0', 
                width: '160px', 
                backgroundColor: 'transparent', // Removed blue background
                borderRadius: '10px', 
                color: 'white', 
                fontSize: '13px', 
                fontFamily: 'Monospace, sans-serif',
                display: 'none', 
                flexDirection: 'column', 
                zIndex: '1000', 
                padding: '5px', 
                cursor: 'default',
                userSelect: 'none', 
                transition: 'transform 0.3s ease, opacity 0.3s ease', 
                opacity: '0', // Initially invisible
                pointerEvents: 'none' // Prevent interactions when not visible
            });
            dropdownMenu.innerHTML = `
                <style>
                    feature label {
                        display: flex; 
                        align-items: center; 
                        color: #ffffff; /* White */
                        padding: 5px 0;
                        transition: background-color 0.3s, color 0.3s;
                    }
                    feature label:hover {
                        background-color: rgba(255, 255, 255, 0.1); /* Light highlight on hover */
                        color: #1e90ff; /* Dodger Blue */
                    }
                    input[type="checkbox"] {
                        appearance: none; 
                        width: 15px; 
                        height: 15px; 
                        background-color: transparent; /* Removed blue background */
                        border: 1px solid #1e90ff; /* Blue border */
                        border-radius: 3px; 
                        margin-right: 5px; 
                        cursor: pointer;
                        transition: background-color 0.3s, border-color 0.3s;
                    }
                    input[type="checkbox"]:checked {
                        background-color: #1e90ff; /* Dodger Blue */
                        border-color: #1e90ff; /* Dodger Blue */
                    }
                    input[type="text"], input[type="number"], input[type="range"] {
                        width: calc(100% - 10px); 
                        border: 1px solid #1e90ff; /* Dodger Blue */ 
                        color: white; 
                        accent-color: #00008b; /* Dark Blue */ 
                        background-color: transparent; 
                        padding: 3px; 
                        border-radius: 3px; 
                    }
                    input[type="text"]:focus, input[type="number"]:focus, input[type="range"]:focus {
                        outline: none;
                        box-shadow: 0 0 5px #1e90ff;
                    }
                </style>
            `;
            watermark.appendChild(dropdownMenu);
            let featuresList = [
                [{ name: 'questionSpoof', type: 'checkbox', variable: 'features.questionSpoof', attributes: 'checked', labeled: true, label: 'Question Spoof' },
                { name: 'videoSpoof', type: 'checkbox', variable: 'features.videoSpoof', attributes: 'checked', labeled: true, label: 'Video Spoof' },
                { name: 'showAnswers', type: 'checkbox', variable: 'features.showAnswers', labeled: true, label: 'Answer Revealer' }],
                [{ name: 'autoAnswer', type: 'checkbox', variable: 'features.autoAnswer', dependent: 'autoAnswerDelay,nextRecomendation,repeatQuestion,snowEffect', labeled: true, label: 'Auto Answer' },
                { name: 'repeatQuestion', className: 'repeatQuestion', type: 'checkbox', variable: 'features.repeatQuestion', attributes: 'style="display:none;"', labeled: true, label: 'Repeat Question' },
                { name: 'nextRecomendation', className: 'nextRecomendation', type: 'checkbox', variable: 'features.nextRecomendation', attributes: 'style="display:none;"', labeled: true, label: 'Recommendations' },
                { name: 'autoAnswerDelay', className: 'autoAnswerDelay', type: 'range', variable: 'features.autoAnswerDelay', attributes: 'style="display:none;" min="1" max="3" value="1"', labeled: false },
                { name: 'snowEffect', type: 'checkbox', variable: 'features.snowEffect', labeled: true, label: 'Snow Effect' }], // Added Snow Effect toggle
                [{ name: 'minuteFarm', type: 'checkbox', variable: 'features.minuteFarmer', labeled: true, label: 'Minute Farmer' },
                { name: 'customBanner', type: 'checkbox', variable: 'features.customBanner', labeled: true, label: 'Custom Banner' },
                { name: 'rgbLogo', type: 'checkbox', variable: 'features.rgbLogo', labeled: true, label: 'RGB Logo' }],
                [{ name: 'darkMode', type: 'checkbox', variable: 'features.darkMode', attributes: 'checked', labeled: true, label: 'Dark Mode' },
                { name: 'onekoJs', type: 'checkbox', variable: 'features.onekoJs', labeled: true, label: 'onekoJs' }]
            ]
            if (!device.apple) {
                featuresList.push(
                    [{ name: 'Custom Username', type: 'nonInput' }, { name: 'customName', type: 'text', variable: 'featureConfigs.customUsername', attributes: 'autocomplete="off"' }],
                    [{ name: 'Custom Profile Picture', type: 'nonInput' }, { name: 'customPfp', type: 'text', variable: 'featureConfigs.customPfp', attributes: 'autocomplete="off"' }]
                );
            }
            featuresList.push([{ name: `${user.username} - UID: ${user.UID}`, type: 'nonInput', attributes: 'style="font-size:10px;padding-left:5px;"' }]);

            addFeature(featuresList);
            handleInput(['questionSpoof', 'videoSpoof', 'showAnswers', 'nextRecomendation', 'repeatQuestion', 'minuteFarm', 'customBanner', 'rgbLogo', 'snowEffect']); // Added 'snowEffect' to handleInput
            if (!device.apple){
                handleInput(['customName', 'customPfp'])
            }
            handleInput('autoAnswer', checked => checked && !features.questionSpoof && (document.querySelector('[setting-data="features.questionSpoof"]').checked = features.questionSpoof = true));
            handleInput('autoAnswerDelay', value => value && (featureConfigs.autoAnswerDelay = 4 - value));
            handleInput('darkMode', checked => checked ? (DarkReader.setFetchMethod(window.fetch), DarkReader.enable()) : DarkReader.disable());
            handleInput('onekoJs', checked => { onekoEl = document.getElementById('oneko'); if (onekoEl) {onekoEl.style.display = checked ? null : "none"} });
            handleInput('snowEffect', checked => { 
                if (checked) {
                    startSnowfall();
                } else {
                    stopSnowfall();
                }
            }); // Handle Snow Effect toggle

            // Correcting menu events for watermark
            watermark.addEventListener('mouseenter', () => { 
                dropdownMenu.style.display = 'flex'; 
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.pointerEvents = 'auto';
                playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/3kd01iyj.wav'); 
            });
            watermark.addEventListener('mouseleave', e => { 
                !watermark.contains(e.relatedTarget) && (dropdownMenu.style.display = 'none', dropdownMenu.style.opacity = '0', dropdownMenu.style.pointerEvents = 'none'); 
                playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/rqizlm03.wav'); 
            });
        }
        function setupStatusPanel() {
            // Removed to eliminate FPS and Ping panel
        }
        function loadWidgetBot() {
            // Removed to eliminate Discord widget
        }
        setupWatermark(); 
        setupDropdown(); 
        // setupStatusPanel(); // Removed
        // loadWidgetBot(); // Removed
    }

    /* Main Functions */ 
    function setupMain(){
        function spoofQuestion() {
            const phrases = [ 
                "🔥 Enhance your studies with [EduSolver KhanDead](https://edusolver.com.br)!", 
                "🤍 Developed by [@im.nix](https://e-z.bio/sounix).", 
                "☄️ Visit our site: [EduSolver KhanDead](https://edusolver.com.br)" 
            ];
            const originalFetch = window.fetch;
            window.fetch = async function (input, init) {
                let body;
                if (input instanceof Request) body = await input.clone().text();
                else if (init && init.body) body = init.body;
                const originalResponse = await originalFetch.apply(this, arguments);
                const clonedResponse = originalResponse.clone();
                try {
                    const responseBody = await clonedResponse.text();
                    let responseObj = JSON.parse(responseBody);
                    if (features.questionSpoof && responseObj?.data?.assessmentItem?.item?.itemData) {
                        let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                        if(itemData.question.content[0] === itemData.question.content[0].toUpperCase()){
                            itemData.answerArea = { 
                                "calculator": false, 
                                "chi2Table": false, 
                                "periodicTable": false, 
                                "tTable": false, 
                                "zTable": false 
                            }
                            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                            itemData.question.widgets = { 
                                "radio 1": { 
                                    options: { 
                                        choices: [ 
                                            { content: "Correct Answer.", correct: true }, 
                                            { content: "Incorrect Answer.", correct: false } 
                                        ] 
                                    } 
                                } 
                            };
                            responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                            sendToast("🔓 Question modified by EduSolver KhanDead.", 1000);
                            return new Response(JSON.stringify(responseObj), { 
                                status: originalResponse.status, 
                                statusText: originalResponse.statusText, 
                                headers: originalResponse.headers 
                            });
                        }
                    }
                } catch (e) { }
                return originalResponse;
            };
        }
        function spoofVideo() {
            const originalFetch = window.fetch;
            window.fetch = async function (input, init) {
                let body;
                if (input instanceof Request) body = await input.clone().text();
                else if (init && init.body) body = init.body;
                if (features.videoSpoof && body && body.includes('"operationName":"updateUserVideoProgress"')) {
                    try {
                        let bodyObj = JSON.parse(body);
                        if (bodyObj.variables && bodyObj.variables.input) {
                            const durationSeconds = bodyObj.variables.input.durationSeconds;
                            bodyObj.variables.input.secondsWatched = durationSeconds;
                            bodyObj.variables.input.lastSecondWatched = durationSeconds;
                            body = JSON.stringify(bodyObj);
                            if (input instanceof Request) { 
                                input = new Request(input, { body: body }); 
                            } 
                            else init.body = body; 
                            sendToast("🔓 Video progress updated by EduSolver KhanDead.", 1000)
                        }
                    } catch (e) { }
                }
                return originalFetch.apply(this, arguments);
            };    
        }
        function minuteFarm() {
            const originalFetch = window.fetch;
            window.fetch = async function (input, init = {}) {
                let body;
                if (input instanceof Request) body = await input.clone().text();
                else if (init.body) body = init.body;
                if (features.minuteFarmer && body && input.url.includes("mark_conversions")) {
                    try {
                        if (body.includes("termination_event")) { 
                            sendToast("🚫 Time limiter blocked by EduSolver KhanDead.", 1000); 
                            return; 
                        }
                    } catch (e) { }
                }
                return originalFetch.apply(this, arguments);
            };
        };
        function spoofUser() {
            plppdo.on('domChanged', () => {
                if(!device.apple){
                    const pfpElement = document.querySelector('.avatar-pic');
                    const nicknameElement = document.querySelector('.user-deets.editable h2');
                    if (nicknameElement) nicknameElement.textContent = featureConfigs.customUsername || user.nickname; 
                    if (featureConfigs.customPfp && pfpElement) { 
                        Object.assign(pfpElement, { src: featureConfigs.customPfp, alt: "Invalid image URL" } );
                        pfpElement.style.borderRadius = "50%";
                    }
                }
            });
        }
        function answerRevealer() {
            const originalParse = JSON.parse;
            JSON.parse = function (e, t) {
                let body = originalParse(e, t);
                try {
                    if (body?.data) {
                        Object.keys(body.data).forEach(key => {
                            const data = body.data[key];
                            if (features.showAnswers && key === "assessmentItem" && data?.item) {
                                const itemData = JSON.parse(data.item.itemData);
                                if (itemData.question && itemData.question.widgets && itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                                    Object.keys(itemData.question.widgets).forEach(widgetKey => {
                                        const widget = itemData.question.widgets[widgetKey];
                                        if (widget.options && widget.options.choices) {
                                            widget.options.choices.forEach(choice => {
                                                if (choice.correct) {
                                                    choice.content = "✅ " + choice.content;
                                                    sendToast("🔓 Answers revealed by EduSolver KhanDead.", 1000);                
                                                }
                                            });
                                        }
                                    });
                                    data.item.itemData = JSON.stringify(itemData);
                                }
                            }
                        });
                    }
                } catch (e) { }
                return body;
            };
        }
        function rgbLogo() {
            plppdo.on('domChanged', () => {
                const khanLogo = document.querySelector('svg._1rt6g9t')?.querySelector('path:nth-last-of-type(2)');
                const styleElement = document.createElement('style');
                styleElement.className = "RGBLogo"
                styleElement.textContent = `
                    @keyframes colorShift {
                        0% { fill: rgb(30, 144, 255); } /* DodgerBlue */
                        33% { fill: rgb(65, 105, 225); } /* RoyalBlue */
                        66% { fill: rgb(100, 149, 237); } /* CornflowerBlue */
                        100% { fill: rgb(30, 144, 255); }
                    }   
                `;
                if(features.rgbLogo && khanLogo){
                    if(!document.getElementsByClassName('RGBLogo')[0]) document.head.appendChild(styleElement);
                    if(khanLogo.getAttribute('data-darkreader-inline-fill') != null) khanLogo.removeAttribute('data-darkreader-inline-fill');
                    khanLogo.style.animation = 'colorShift 5s infinite';
                }
            })
        }
        function changeBannerText() {
            const phrases = [ 
                "[🌿] EduSolver KhanDead is here to help you.", 
                "[🌿] Learn more with EduSolver KhanDead.", 
                "[🌿] Visit our site: [EduSolver KhanDead](https://edusolver.com.br)", 
                "[🌿] EduSolver KhanDead: Your study tool.", 
                "[🌿] Master concepts with EduSolver KhanDead.", 
                "[🌿] EduSolver KhanDead makes your learning easier." 
            ];
            setInterval(() => { 
                const greeting = document.querySelector('.stp-animated-banner h2');
                if (greeting && features.customBanner) greeting.textContent = phrases[Math.floor(Math.random() * phrases.length)];
            }, 3000);
        }
        async function autoAnswer() {
            const baseClasses = ["_1tuo6xk", "_ssxvf9l", "_1f0fvyce", "_rz7ls7u", "_1yok8f4", "_1e5cuk2a"];
            while (true) {
                if(features.autoAnswer && features.questionSpoof){
                    const classToCheck = [...baseClasses];
                    if (features.nextRecomendation) { 
                        device.mobile ? classToCheck.push("_ixuggsz") : classToCheck.push("_1kkrg8oi"); 
                    }
                    if (features.repeatQuestion) classToCheck.push("_1abyu0ga");
                    classToCheck.forEach(async (q) => {
                        findAndClickByClass(q);
                        const element = document.getElementsByClassName(q)[0];
                        if(element && element.textContent == 'Show summary') { 
                            sendToast("🎉 Exercise completed successfully!", 3000); 
                            playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav'); 
                        }
                    });
                }
                await delay(featureConfigs.autoAnswerDelay * 750);
            }
        }
        function setupSnowEffect() {
            // Initially start snowfall if the feature is enabled
            if (features.snowEffect) {
                startSnowfall();
            }
        }
        spoofQuestion(); 
        spoofVideo(); 
        answerRevealer(); 
        minuteFarm(); 
        spoofUser(); 
        rgbLogo(); 
        changeBannerText(); 
        autoAnswer();
        setupSnowEffect(); // Initialize Snow Effect based on toggle
    }

    /* Inject */
    if (!/^https?:\/\/pt\.khanacademy\.org/.test(window.location.href)) { 
        alert("❌ EduSolver KhanDead Failed to Inject!\n\nYou need to run EduSolver KhanDead on the Khan Academy website! (https://pt.khanacademy.org/)"); 
        window.location.href = "https://pt.khanacademy.org/";
    };

    showSplashScreen();

    loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs')
    .then(() => {
        onekoEl = document.getElementById('oneko'); 
        if (onekoEl) {
            onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')";
            onekoEl.style.display = "none";
        }
    });
    loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin')
    .then(()=>{
        DarkReader.setFetchMethod(window.fetch)
        DarkReader.enable();
    });
    loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
    loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    .then(async () => {
        sendToast("🌿 EduSolver KhanDead injected successfully!");
        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
        await delay(500);
        sendToast(`⭐ Welcome back: ${user.nickname}`);
        loadedPlugins.forEach(plugin => sendToast(`🪝 ${plugin} Loaded!`, 2000, 'top') );
        hideSplashScreen();
        setupMenu();
        setupMain();
        console.clear();
    });

})();
