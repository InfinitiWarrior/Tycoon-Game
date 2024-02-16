// Define constants and variables
const moneyElement = document.getElementById('money');
const websitesElement = document.getElementById('websites');
const buildWebsiteBtn = document.getElementById('build-website-btn');
const upgradeShop = document.getElementById('upgrade-shop');
const progressBarInner = document.getElementById('progress-bar-inner');
const websitePreview = document.getElementById('website-preview');
const gameScreen = document.getElementById('game-screen');

let money = 0;
let websites = [];
let progress = 0;
let fasterDevelopmentLevel = 0;
let betterDesignLevel = 0; // Track Better Design upgrade level
let unpaidWorkersLevel = 0; // Track Unpaid Workers upgrade level
let workerInterval = 10010;

// Event listeners
buildWebsiteBtn.addEventListener('click', buildWebsite);

// Define upgrades
const upgrades = [
    { title: 'Faster Development', description: '+10% per click on website development.', baseCost: 50, maxLevel: 9 },
    { title: 'Better Design', description: 'Improve the design quality of your websites. +5$', baseCost: 100, maxLevel: 18 },
    { title: 'Hire Unpaid Workers', description: 'They click for you once every 10 seconds.-0.5s each upgrade', baseCost: 150, effect: 'worker', maxLevel: Infinity }
    // Add more upgrades here...
];

// Functions
function buildWebsite() {
    if (progress >= 100) {
        progress = 0;
        updateProgress();
        money += 10; // Default money earned without upgrades
        money += betterDesignLevel * 5; // Increase money earned based on the level of the "Better Design" upgrade
        updateUI();
    } else {
        progress += calculateProgressIncrease();
        updateProgress();
    }
}

function updateUI() {
    moneyElement.textContent = money;
    // Update the text of the "Build Website" button with the current money earned
    buildWebsiteBtn.textContent = `Build Website (+$${10 + betterDesignLevel * 5})`;
    websitesElement.textContent = websites.length;
    renderUpgrades();
}

function renderUpgrades() {
    upgradeShop.innerHTML = '';
    upgrades.forEach((upgrade, index) => {
        const upgradeItem = document.createElement('div');
        upgradeItem.classList.add('upgrade-item');
        upgradeItem.innerHTML = `
            <div class="upgrade-title">${upgrade.title}</div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-price">$${getUpgradeCost(upgrade)}</div> <!-- Include the upgrade price -->
            <button id="upgrade-${index}" class="purchase-btn" data-index="${index}" ${canPurchaseUpgrade(upgrade) ? '' : 'disabled'}>Purchase</button>
        `;
        const purchaseButton = upgradeItem.querySelector('.purchase-btn');
        purchaseButton.addEventListener('click', () => {
            purchaseUpgrade(index);
        });
        upgradeShop.appendChild(upgradeItem);
    });
}

function calculateProgressIncrease() {
    return 10 * (fasterDevelopmentLevel + 1);
}

function purchaseUpgrade(index) {
    const upgrade = upgrades[index];
    const upgradeCost = getUpgradeCost(upgrade);
    if (money >= upgradeCost && (!upgrade.maxLevel || getUpgradeLevel(upgrade) < upgrade.maxLevel)) {
        money -= upgradeCost; // Deduct money
        if (upgrade.effect === 'worker') {
            if (unpaidWorkersLevel >= 20) {
                alert("This upgrade is maxed out. Changes coming soon!"); 
                document.getElementById("myBtn" + index).disabled = true;
            } else {
                hireWorker(); // Increase Faster Development level
                workerInterval -= 500
            }    
        } else if (upgrade.title === 'Faster Development') {
            if (fasterDevelopmentLevel >= 9) {
                alert("This upgrade is maxed out. Changes coming soon!"); 
                document.getElementById("myBtn" + index).disabled = true;
            } else {
                fasterDevelopmentLevel++; // Increase Faster Development level
            }        
        } else if (upgrade.title === 'Better Design') {
            if (betterDesignLevel >= 18) {
                alert("This upgrade is maxed out. Changes coming soon!"); 
                document.getElementById("myBtn" + index).disabled = true;
            } else {
                betterDesignLevel++; // Increase Faster Development level
            }  
        } else if (upgrade.title === 'Hire Unpaid Workers') {
            unpaidWorkersLevel += 1; // Increase Unpaid Workers level
            decreaseWorkerInterval(); // Decrease the worker interval
        }
        increaseUpgradeCost(upgrade); // Increase the upgrade cost
        renderUpgrades(); // Update UI
        updateUI();
    }
}

function getUpgradeCost(upgrade) {
    const currentLevel = getUpgradeLevel(upgrade);
    return Math.round(upgrade.baseCost * Math.pow(1.2, currentLevel));
}

function canPurchaseUpgrade(upgrade) {
    return (getUpgradeCost(upgrade) <= money && (!upgrade.maxLevel || getUpgradeLevel(upgrade) < upgrade.maxLevel));
}

function getUpgradeLevel(upgrade) {
    return websites.filter(website => website.upgrade === upgrade).length;
}

function increaseUpgradeCost(upgrade) {
    upgrade.baseCost *= 1.2;
}

function hireWorker() {
    unpaidWorkersLevel++;
    setInterval(() => {
        buildWebsiteBtn.click();
    }, workerInterval);
}


function updateProgress() {
    progressBarInner.style.width = `${progress}%`;
    progressBarInner.style.backgroundColor = 'green';
    websitePreview.innerHTML = websiteContent.substring(0, Math.ceil(progress / 100 * websiteContent.length));
}

// Example website content
let websiteContent = `
    <h2>Welcome to my website!</h2>
    <p>This is just a sample text.</p>
    <p>As you upgrade your website, more content will become visible here.</p>
`;

// Initialize UI
updateUI();
