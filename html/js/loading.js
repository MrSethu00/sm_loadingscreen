(function() {
    "use strict";

    // DOM Elements
    const progressFill = document.getElementById('loadingBar');
    const percentLabel = document.getElementById('progressPercent');
    const statusMsg = document.getElementById('statusMessage');

    // Loading steps configuration
    const statusList = [
        { progress: 10, text: 'BAĞLANTI KURULUYOR...' },
        { progress: 25, text: 'SUNUCUYA BAĞLANIYOR...' },
        { progress: 45, text: 'KARDEŞLER KONTROL EDİLİYOR...' },
        { progress: 65, text: 'MOTORLAR ISITILIYOR...' },
        { progress: 80, text: 'VERİLER YÜKLENİYOR...' },
        { progress: 92, text: 'NEREDEYSE HAZIR...' },
        { progress: 100, text: 'HAZIR! MOTORA BİN!' }
    ];

    let currentStep = 0;
    let progressValue = 0;
    let loadingInterval = null;

    // Update UI function
    function updateLoading(progress, statusText) {
        if (progress > 100) progress = 100;
        progressFill.style.width = progress + '%';
        percentLabel.innerText = Math.round(progress) + '%';
        
        if (statusText) {
            statusMsg.innerHTML = '<i class="fas fa-motorcycle"></i> ' + statusText;
        }
        
        if (progress >= 100) {
            statusMsg.innerHTML = '<i class="fas fa-check-circle" style="color: #f5c542;"></i> HAZIR! MOTORA BİN!';
            if (loadingInterval) {
                clearInterval(loadingInterval);
                loadingInterval = null;
            }
        }
    }

    // Simulate loading with smooth animation
    function simulateLoading() {
        if (currentStep >= statusList.length) {
            if (progressValue < 100) {
                progressValue = 100;
                updateLoading(100, 'HAZIR! MOTORA BİN!');
            }
            return;
        }

        const step = statusList[currentStep];
        const targetProgress = step.progress;
        const statusText = step.text;
        const startProgress = progressValue;
        const duration = 700;
        const startTime = performance.now();

        function animateStep(time) {
            const elapsed = time - startTime;
            const t = Math.min(elapsed / duration, 1);
            const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            const currentVal = startProgress + (targetProgress - startProgress) * eased;
            progressValue = Math.min(currentVal, targetProgress);
            updateLoading(progressValue, statusText);

            if (t < 1) {
                requestAnimationFrame(animateStep);
            } else {
                progressValue = targetProgress;
                updateLoading(progressValue, statusText);
                currentStep++;
                if (currentStep < statusList.length) {
                    setTimeout(() => simulateLoading(), 400);
                } else {
                    if (progressValue < 100) {
                        progressValue = 100;
                        updateLoading(100, 'HAZIR! MOTORA BİN!');
                    }
                }
            }
        }
        requestAnimationFrame(animateStep);
    }

    // Start loading sequence
    setTimeout(() => {
        progressValue = 0;
        currentStep = 0;
        updateLoading(0, 'BAŞLATILIYOR...');
        setTimeout(() => simulateLoading(), 500);
    }, 600);

    // Fallback: force complete after 25 seconds
    setTimeout(() => {
        if (progressValue < 100) {
            progressValue = 100;
            updateLoading(100, 'HAZIR! MOTORA BİN!');
            if (loadingInterval) {
                clearInterval(loadingInterval);
                loadingInterval = null;
            }
        }
    }, 25000);

    // Expose for ESX/NUI integration
    window.updateLoadingScreen = function(progress, status) {
        if (progress !== undefined) {
            progressValue = Math.min(progress, 100);
            updateLoading(progressValue, status || 'YÜKLENİYOR...');
        }
        if (status) {
            statusMsg.innerHTML = '<i class="fas fa-motorcycle"></i> ' + status;
        }
        if (progressValue >= 100) {
            statusMsg.innerHTML = '<i class="fas fa-check-circle" style="color: #f5c542;"></i> HAZIR!';
        }
    };

    console.log('sm_loadingscreen — Motor ve Para!');
})();
