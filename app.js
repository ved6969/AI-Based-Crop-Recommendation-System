// DOM Elements
const cropForm = document.getElementById('cropForm');
const resultsSection = document.getElementById('results');
const learnMoreModal = document.getElementById('learnMoreModal');
const learnMoreBtn = document.querySelector('.btn-learn-more');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const recommendationBtn = document.querySelector('.btn-recommendation');
const loadingSpinner = document.querySelector('.loading-spinner');
const btnText = document.querySelector('.btn-text');
const navLinks = document.querySelectorAll('.nav-link');

// Crop recommendation data based on different conditions
const cropRecommendations = {
  clay: {
    high_rainfall: {
      acidic: ['Rice', 'Sugarcane', 'Jute'],
      neutral: ['Wheat', 'Barley', 'Cotton'],
      alkaline: ['Cotton', 'Sunflower', 'Safflower']
    },
    low_rainfall: {
      acidic: ['Finger Millet', 'Sweet Potato', 'Cassava'],
      neutral: ['Sorghum', 'Pearl Millet', 'Chickpea'],
      alkaline: ['Barley', 'Mustard', 'Linseed']
    }
  },
  sandy: {
    high_rainfall: {
      acidic: ['Pineapple', 'Cashew', 'Coconut'],
      neutral: ['Groundnut', 'Sesame', 'Watermelon'],
      alkaline: ['Date Palm', 'Pomegranate', 'Citrus']
    },
    low_rainfall: {
      acidic: ['Cassava', 'Sweet Potato', 'Yam'],
      neutral: ['Pearl Millet', 'Sorghum', 'Groundnut'],
      alkaline: ['Barley', 'Mustard', 'Cumin']
    }
  },
  loamy: {
    high_rainfall: {
      acidic: ['Rice', 'Maize', 'Sugarcane'],
      neutral: ['Wheat', 'Rice', 'Cotton'],
      alkaline: ['Wheat', 'Barley', 'Mustard']
    },
    low_rainfall: {
      acidic: ['Maize', 'Sweet Potato', 'Tomato'],
      neutral: ['Wheat', 'Chickpea', 'Pea'],
      alkaline: ['Barley', 'Mustard', 'Safflower']
    }
  },
  silt: {
    high_rainfall: {
      acidic: ['Rice', 'Jute', 'Sugarcane'],
      neutral: ['Wheat', 'Maize', 'Soybean'],
      alkaline: ['Cotton', 'Sunflower', 'Wheat']
    },
    low_rainfall: {
      acidic: ['Tomato', 'Potato', 'Carrot'],
      neutral: ['Wheat', 'Barley', 'Chickpea'],
      alkaline: ['Mustard', 'Safflower', 'Linseed']
    }
  },
  peaty: {
    high_rainfall: {
      acidic: ['Rice', 'Tea', 'Coffee'],
      neutral: ['Vegetables', 'Herbs', 'Berries'],
      alkaline: ['Cabbage', 'Lettuce', 'Spinach']
    },
    low_rainfall: {
      acidic: ['Blueberry', 'Cranberry', 'Azalea'],
      neutral: ['Carrot', 'Onion', 'Garlic'],
      alkaline: ['Brassicas', 'Root Vegetables', 'Herbs']
    }
  },
  chalky: {
    high_rainfall: {
      acidic: ['Potato', 'Tomato', 'Pepper'],
      neutral: ['Wheat', 'Barley', 'Oats'],
      alkaline: ['Sugar Beet', 'Cabbage', 'Turnip']
    },
    low_rainfall: {
      acidic: ['Strawberry', 'Raspberry', 'Gooseberry'],
      neutral: ['Barley', 'Wheat', 'Pea'],
      alkaline: ['Mustard', 'Radish', 'Turnip']
    }
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Add event listeners
  cropForm.addEventListener('submit', handleFormSubmission);
  learnMoreBtn.addEventListener('click', openLearnMoreModal);
  modalClose.addEventListener('click', closeLearnMoreModal);
  modalOverlay.addEventListener('click', closeLearnMoreModal);
  
  // Navigation functionality
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });

  // Add input animations
  addInputAnimations();
  
  // Add scroll effects
  addScrollEffects();
}

// Handle form submission
async function handleFormSubmission(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(cropForm);
  const data = {
    soilType: formData.get('soilType'),
    temperature: parseFloat(formData.get('temperature')),
    rainfall: parseFloat(formData.get('rainfall')),
    phLevel: parseFloat(formData.get('phLevel')),
    location: formData.get('location')
  };
  
  // Validate form data
  if (!validateFormData(data)) {
    showError('Please fill in all fields with valid values.');
    return;
  }
  
  // Show loading state
  showLoadingState(true);
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate recommendations
    const recommendations = generateRecommendations(data);
    
    // Display results
    displayRecommendations(recommendations, data);
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
  } catch (error) {
    showError('Sorry, there was an error processing your request. Please try again.');
  } finally {
    showLoadingState(false);
  }
}

// Validate form data
function validateFormData(data) {
  return data.soilType && 
         data.temperature >= -10 && data.temperature <= 50 &&
         data.rainfall >= 0 && data.rainfall <= 3000 &&
         data.phLevel >= 0 && data.phLevel <= 14 &&
         data.location.trim().length > 0;
}

// Generate crop recommendations
function generateRecommendations(data) {
  const { soilType, temperature, rainfall, phLevel, location } = data;
  
  // Determine rainfall category
  const rainfallCategory = rainfall > 1000 ? 'high_rainfall' : 'low_rainfall';
  
  // Determine pH category
  let phCategory;
  if (phLevel < 6.5) {
    phCategory = 'acidic';
  } else if (phLevel > 7.5) {
    phCategory = 'alkaline';
  } else {
    phCategory = 'neutral';
  }
  
  // Get recommendations based on soil type
  const soilRecommendations = cropRecommendations[soilType];
  if (!soilRecommendations) {
    return ['Wheat', 'Rice', 'Maize']; // Default recommendations
  }
  
  const categoryRecommendations = soilRecommendations[rainfallCategory];
  if (!categoryRecommendations) {
    return ['Wheat', 'Rice', 'Maize'];
  }
  
  let crops = categoryRecommendations[phCategory] || ['Wheat', 'Rice', 'Maize'];
  
  // Filter by temperature (simplified logic)
  crops = crops.filter(crop => {
    if (temperature < 15) {
      return ['Wheat', 'Barley', 'Oats', 'Pea', 'Potato'].includes(crop);
    } else if (temperature > 35) {
      return ['Rice', 'Sugarcane', 'Cotton', 'Sorghum', 'Pearl Millet'].includes(crop);
    }
    return true; // Most crops grow in moderate temperatures
  });
  
  // Return top 3 recommendations
  return crops.slice(0, 3);
}

// Display recommendations
function displayRecommendations(crops, data) {
  const recommendationsContainer = document.querySelector('.crop-recommendations');
  
  recommendationsContainer.innerHTML = '';
  
  crops.forEach((crop, index) => {
    const cropElement = document.createElement('div');
    cropElement.className = 'crop-recommendation';
    cropElement.style.animationDelay = `${index * 0.1}s`;
    
    const cropEmojis = {
      'Rice': '🌾',
      'Wheat': '🌾',
      'Maize': '🌽',
      'Cotton': '🌱',
      'Sugarcane': '🎋',
      'Sorghum': '🌾',
      'Barley': '🌾',
      'Groundnut': '🥜',
      'Soybean': '🫘',
      'Chickpea': '🫛',
      'Tomato': '🍅',
      'Potato': '🥔',
      'Onion': '🧅',
      'Carrot': '🥕',
      'Sunflower': '🌻',
      'Mustard': '🌼',
      'Tea': '🍵',
      'Coffee': '☕',
      'Coconut': '🥥'
    };
    
    const emoji = cropEmojis[crop] || '🌱';
    
    cropElement.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 8px;">${emoji}</div>
      <h4 style="color: var(--color-primary-green); margin-bottom: 4px;">${crop}</h4>
      <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
        Recommended for your conditions
      </p>
    `;
    
    recommendationsContainer.appendChild(cropElement);
  });
  
  // Show results section
  resultsSection.classList.remove('hidden');
  
  // Add success message
  const resultsContent = document.querySelector('.results-content p');
  resultsContent.innerHTML = `
    Based on your farm conditions in <strong>${data.location}</strong> with ${data.soilType} soil, 
    ${data.temperature}°C temperature, ${data.rainfall}mm rainfall, and pH ${data.phLevel}, 
    we recommend these crops for optimal yield:
  `;
}

// Show loading state
function showLoadingState(isLoading) {
  if (isLoading) {
    recommendationBtn.disabled = true;
    loadingSpinner.classList.remove('hidden');
    btnText.textContent = 'Analyzing...';
  } else {
    recommendationBtn.disabled = false;
    loadingSpinner.classList.add('hidden');
    btnText.textContent = 'Get Crop Recommendation';
  }
}

// Show error message
function showError(message) {
  // Create error element
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.style.cssText = `
    background: rgba(192, 21, 47, 0.1);
    border: 1px solid rgba(192, 21, 47, 0.3);
    color: var(--color-error);
    padding: var(--space-12);
    border-radius: var(--radius-base);
    margin-top: var(--space-16);
    animation: slideInUp 0.3s ease-out;
  `;
  errorElement.textContent = message;
  
  // Remove existing error messages
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  
  // Add error message
  cropForm.appendChild(errorElement);
  
  // Remove error message after 5 seconds
  setTimeout(() => {
    errorElement.remove();
  }, 5000);
}

// Modal functionality
function openLearnMoreModal() {
  learnMoreModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLearnMoreModal() {
  learnMoreModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Navigation functionality
function handleNavigation(e) {
  e.preventDefault();
  
  // Remove active class from all nav links
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Add active class to clicked link
  e.currentTarget.classList.add('active');
  
  const href = e.currentTarget.getAttribute('href');
  
  if (href === '#home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (href === '#about') {
    openLearnMoreModal();
  } else if (href === '#contact') {
    // Simulate contact action
    showContactMessage();
  }
}

function showContactMessage() {
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--color-secondary-green);
    color: white;
    padding: var(--space-16);
    border-radius: var(--radius-base);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    animation: slideInUp 0.3s ease-out;
  `;
  message.innerHTML = `
    <strong>Contact Us:</strong><br>
    📧 info@agriai.com<br>
    📞 +1-800-CROP-AI<br>
    🌐 www.agriai.com
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.remove();
  }, 4000);
}

// Add input animations
function addInputAnimations() {
  const inputs = document.querySelectorAll('.form-control');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
    
    input.addEventListener('input', function() {
      if (this.value) {
        this.parentElement.classList.add('has-value');
      } else {
        this.parentElement.classList.remove('has-value');
      }
    });
  });
}

// Add scroll effects
function addScrollEffects() {
  let ticking = false;
  
  function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    
    if (scrolled > 50) {
      navbar.style.background = 'rgba(46, 125, 50, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.background = 'rgba(46, 125, 50, 0.95)';
      navbar.style.boxShadow = 'none';
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
}

// Add interactive particle effects
function createParticleEffect(x, y) {
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 6px;
    height: 6px;
    background: var(--color-secondary-green);
    border-radius: 50%;
    pointer-events: none;
    z-index: 1000;
    animation: particleFade 0.6s ease-out forwards;
  `;
  
  document.body.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 600);
}

// Add particle fade animation
const style = document.createElement('style');
style.textContent = `
  @keyframes particleFade {
    0% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    100% {
      opacity: 0;
      transform: scale(0.3) translateY(-30px);
    }
  }
  
  .form-group.focused .form-label {
    color: var(--color-secondary-green);
    transform: translateY(-2px);
  }
  
  .form-group.has-value .form-control {
    border-color: var(--color-light-green);
  }
`;
document.head.appendChild(style);

// Add click particle effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createParticleEffect(e.clientX, e.clientY);
  });
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (!learnMoreModal.classList.contains('hidden')) {
      closeLearnMoreModal();
    }
  }
});

// Add some extra interactivity to the floating crops
document.querySelectorAll('.crop-icon').forEach((icon, index) => {
  icon.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.5) rotate(15deg)';
    this.style.transition = 'transform 0.3s ease';
  });
  
  icon.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1) rotate(0deg)';
  });
});

// Add weather-based background effects (simplified)
function addWeatherEffects() {
  const temperature = parseFloat(document.getElementById('temperature').value);
  const rainfall = parseFloat(document.getElementById('rainfall').value);
  
  if (temperature && rainfall) {
    const hero = document.querySelector('.hero');
    
    if (rainfall > 1500) {
      // Rainy effect
      hero.style.filter = 'brightness(0.8) saturate(1.2)';
    } else if (temperature > 35) {
      // Hot/sunny effect
      hero.style.filter = 'brightness(1.2) saturate(1.3)';
    } else {
      // Normal conditions
      hero.style.filter = 'brightness(1) saturate(1)';
    }
  }
}

// Add event listeners for weather effects
document.getElementById('temperature').addEventListener('input', addWeatherEffects);
document.getElementById('rainfall').addEventListener('input', addWeatherEffects);