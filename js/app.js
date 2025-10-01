// ==============================================
// THE SUNROOM EXPERTS - QUOTE CALCULATOR
// ==============================================

// Global state management
let calculatorState = {
    currentScreen: 'landing',
    selectedRoom: null,
    roomTypeName: '',
    roomPricing: {
        screen: {
            name: 'Screen Only',
            minTotal: 2800,
            maxTotal: 4000,
            minPerSqFt: 35,
            maxPerSqFt: 50
        },
        '3season': {
            name: '3-Season Eze Breeze',
            minTotal: 6000,
            maxTotal: 10000,
            minPerSqFt: 50,
            maxPerSqFt: 65
        },
        glass: {
            name: 'Glass',
            minTotal: 12000,
            maxTotal: 20000,
            minPerSqFt: 75,
            maxPerSqFt: 100
        }
    },
    dimensions: {
        wall1: 0,
        wall2: 0,
        wall3: 0,
        height: 8 // Standard height
    },
    calculatedPrice: {
        min: 0,
        max: 0,
        totalLinearFeet: 0,
        totalSquareFeet: 0
    }
};

// ==============================================
// SCREEN NAVIGATION
// ==============================================

function showScreen(screenId) {
    // Hide all screens with fade out
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show selected screen with fade in
    setTimeout(() => {
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            calculatorState.currentScreen = screenId;
            
            // Scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 100);
}

function showRoomSelection() {
    showScreen('calculator');
}

function showLanding() {
    showScreen('landing');
}

function showContactForm() {
    if (calculatorState.calculatedPrice.min > 0) {
        showScreen('contact');
        updateFinalPriceDisplay();
    } else {
        alert('Please select a room type and enter measurements first.');
    }
}

function showCalculator() {
    showScreen('calculator');
}

// ==============================================
// ROOM TYPE SELECTION
// ==============================================

function selectRoomType(type, minPrice, maxPrice, minRate, maxRate) {
    // Update state
    calculatorState.selectedRoom = type;
    calculatorState.roomTypeName = calculatorState.roomPricing[type].name;
    
    // Update UI - Remove previous selection
    document.querySelectorAll('.room-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.currentTarget.classList.add('selected');
    
    // Enable measurement section
    const measurementSection = document.getElementById('measurement-section');
    measurementSection.classList.remove('disabled');
    
    // Enable all input fields
    document.getElementById('wall1').disabled = false;
    document.getElementById('wall2').disabled = false;
    document.getElementById('wall3').disabled = false;
    
    // Focus on first input after short delay
    setTimeout(() => {
        document.getElementById('wall2').focus(); // Focus top input first
    }, 300);
    
    // Initialize calculation if there are existing values
    calculatePrice();
}

// ==============================================
// PRICE CALCULATION
// ==============================================

function calculatePrice() {
    if (!calculatorState.selectedRoom) return;
    
    // Get wall dimensions
    const wall1 = parseFloat(document.getElementById('wall1').value) || 0;
    const wall2 = parseFloat(document.getElementById('wall2').value) || 0;
    const wall3 = parseFloat(document.getElementById('wall3').value) || 0;
    const height = calculatorState.dimensions.height;
    
    // Update state
    calculatorState.dimensions = {
        wall1: wall1,
        wall2: wall2,
        wall3: wall3,
        height: height
    };
    
    // Calculate totals
    const totalLinearFeet = wall1 + wall2 + wall3;
    const totalSquareFeet = totalLinearFeet * height;
    
    calculatorState.calculatedPrice.totalLinearFeet = totalLinearFeet;
    calculatorState.calculatedPrice.totalSquareFeet = totalSquareFeet;
    
    if (totalLinearFeet > 0) {
        // Get pricing for selected room type
        const pricing = calculatorState.roomPricing[calculatorState.selectedRoom];
        
        // Calculate price range based on square footage
        let minPrice = totalSquareFeet * pricing.minPerSqFt;
        let maxPrice = totalSquareFeet * pricing.maxPerSqFt;
        
        // Ensure minimum pricing thresholds
        minPrice = Math.max(minPrice, pricing.minTotal);
        maxPrice = Math.max(maxPrice, pricing.maxTotal);
        
        // Round to nearest hundred
        minPrice = Math.round(minPrice / 100) * 100;
        maxPrice = Math.round(maxPrice / 100) * 100;
        
        // Update state
        calculatorState.calculatedPrice.min = minPrice;
        calculatorState.calculatedPrice.max = maxPrice;
        
        // Update UI
        updatePriceDisplay();
    } else {
        // Reset if no dimensions
        resetPriceDisplay();
    }
}

function updatePriceDisplay() {
    // Update total feet display
    const totalFeetSpan = document.querySelector('#total-feet span');
    if (totalFeetSpan) {
        totalFeetSpan.textContent = `${calculatorState.calculatedPrice.totalLinearFeet.toFixed(1)} ft`;
    }
    
    // Show price display only if there are measurements
    const priceDisplay = document.getElementById('price-display');
    if (calculatorState.calculatedPrice.totalLinearFeet > 0) {
        priceDisplay.classList.remove('hidden');
        
        const priceRange = priceDisplay.querySelector('.price-range');
        priceRange.textContent = 
            `${calculatorState.calculatedPrice.min.toLocaleString()} - ${calculatorState.calculatedPrice.max.toLocaleString()}`;
    }
    
    // Enable/disable continue button based on all fields having values
    const continueBtn = document.getElementById('continue-btn');
    const wall1 = parseFloat(document.getElementById('wall1').value) || 0;
    const wall2 = parseFloat(document.getElementById('wall2').value) || 0;
    const wall3 = parseFloat(document.getElementById('wall3').value) || 0;
    
    if (wall1 > 0 && wall2 > 0 && wall3 > 0) {
        continueBtn.disabled = false;
    } else {
        continueBtn.disabled = true;
    }
}

function resetPriceDisplay() {
    const totalFeetSpan = document.querySelector('#total-feet span');
    if (totalFeetSpan) {
        totalFeetSpan.textContent = '0 ft';
    }
    document.getElementById('price-display').classList.add('hidden');
    document.getElementById('continue-btn').disabled = true;
}

function updateFinalPriceDisplay() {
    document.querySelector('.final-price-range').textContent = 
        `$${calculatorState.calculatedPrice.min.toLocaleString()} - $${calculatorState.calculatedPrice.max.toLocaleString()}`;
}

// ==============================================
// FORM VALIDATION & SUBMISSION
// ==============================================

function validateContactForm() {
    const requiredFields = ['fullName', 'address', 'city', 'state', 'zip', 'phone', 'email'];
    let isValid = true;
    let errors = [];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            errors.push(field.placeholder || fieldId);
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        emailField.style.borderColor = '#e74c3c';
        errors.push('Valid email address');
        isValid = false;
    }
    
    // Validate phone format
    const phoneField = document.getElementById('phone');
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (phoneField.value && !phoneRegex.test(phoneField.value)) {
        phoneField.style.borderColor = '#e74c3c';
        errors.push('Valid phone number');
        isValid = false;
    }
    
    if (!isValid) {
        alert('Please complete all required fields:\n• ' + errors.join('\n• '));
    }
    
    return isValid;
}

function submitForm() {
    if (!validateContactForm()) {
        return;
    }
    
    // Collect all form data
    const formData = {
        // Personal information
        contact: {
            fullName: document.getElementById('fullName').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            projectDetails: document.getElementById('project-details').value,
            timeline: document.getElementById('timeline').value
        },
        
        // Calculator data
        sunroom: {
            roomType: calculatorState.selectedRoom,
            roomTypeName: calculatorState.roomTypeName,
            dimensions: calculatorState.dimensions,
            totalLinearFeet: calculatorState.calculatedPrice.totalLinearFeet,
            totalSquareFeet: calculatorState.calculatedPrice.totalSquareFeet,
            priceRange: {
                min: calculatorState.calculatedPrice.min,
                max: calculatorState.calculatedPrice.max
            }
        },
        
        // Metadata
        meta: {
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        }
    };
    
    // Log the submission (for debugging)
    console.log('Quote Request Submitted:', formData);
    
    // Show loading state
    const submitButton = event.currentTarget;
    submitButton.innerHTML = '<span class="spinner"></span> Submitting...';
    submitButton.disabled = true;
    
    // Simulate submission (replace with actual API call)
    setTimeout(() => {
        // Show thank you screen
        showScreen('thankyou');
        
        // You would typically send this to your server here:
        // submitToServer(formData);
    }, 1000);
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

function formatPhoneNumber(input) {
    // Remove all non-numeric characters
    let value = input.value.replace(/\D/g, '');
    
    // Format as (xxx) xxx-xxxx
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    
    input.value = value;
}

// Function to submit data to server (placeholder)
function submitToServer(data) {
    // Example using fetch API
    /*
    fetch('/api/quote-request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    */
}

// ==============================================
// EVENT LISTENERS
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    // Add phone formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add Enter key support for inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculatePrice();
            }
        });
    });
    
    // Initialize with focus on landing page
    showScreen('landing');
});

// ==============================================
// PLACEHOLDER IMAGE HANDLING
// ==============================================

// Add placeholder images if actual images aren't available
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        // Use placeholder image
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0U4RTBENiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMyNTVFNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlN1bnJvb20gSW1hZ2U8L3RleHQ+PC9zdmc+';
    }
}, true);