// Estado del formulario
const formState = {
    selectedNeeds: new Set()
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupOptionsList();
    setupFormValidation();
});

// Inicializar el formulario
function initializeForm() {
    const form = document.getElementById('onboardingForm');
    form.addEventListener('submit', handleFormSubmit);
}

// Configurar la lista de opciones interactiva
function setupOptionsList() {
    const optionItems = document.querySelectorAll('.option-item');
    
    optionItems.forEach(item => {
        item.addEventListener('click', function() {
            toggleOption(this);
        });
        
        // Animación de entrada escalonada
        const delay = Array.from(optionItems).indexOf(item) * 50;
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.4s ease';
            
            requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            });
        }, delay);
    });
}

// Toggle de selección de opciones
function toggleOption(element) {
    const value = element.getAttribute('data-value');
    
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        formState.selectedNeeds.delete(value);
        animateDeselect(element);
    } else {
        element.classList.add('selected');
        formState.selectedNeeds.add(value);
        animateSelect(element);
    }
    
    console.log('Necesidades seleccionadas:', Array.from(formState.selectedNeeds));
}

// Animación de selección
function animateSelect(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'translateY(-2px)';
    }, 100);
}

// Animación de deselección
function animateDeselect(element) {
    element.style.transform = 'scale(0.98)';
    setTimeout(() => {
        element.style.transform = 'translateY(0)';
    }, 100);
}

// Validación del formulario
function setupFormValidation() {
    const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validar un campo individual
function validateField(field) {
    const isValid = field.checkValidity();
    
    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#f5576c';
        showFieldError(field);
    } else {
        field.classList.remove('error');
        field.style.borderColor = '#e2e8f0';
        removeFieldError(field);
    }
    
    return isValid;
}

// Mostrar error de campo
function showFieldError(field) {
    let errorMsg = field.parentElement.querySelector('.error-message');
    
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.style.cssText = `
            color: #f5576c;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: fadeIn 0.3s ease;
        `;
        field.parentElement.appendChild(errorMsg);
    }
    
    errorMsg.textContent = getErrorMessage(field);
}

// Remover error de campo
function removeFieldError(field) {
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Obtener mensaje de error personalizado
function getErrorMessage(field) {
    if (field.validity.valueMissing) {
        return '⚠️ Este campo es obligatorio';
    }
    if (field.validity.typeMismatch) {
        return '⚠️ Por favor ingresa un formato válido';
    }
    if (field.validity.patternMismatch) {
        if (field.type === 'tel') {
            return '⚠️ Ingresa un teléfono válido de 10 dígitos';
        }
        if (field.name === 'codigoPostal') {
            return '⚠️ Ingresa un código postal válido de 5 dígitos';
        }
    }
    if (field.validity.rangeUnderflow) {
        return '⚠️ La edad debe ser mayor a 18 años';
    }
    return '⚠️ Por favor verifica este campo';
}

// Manejar envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar todos los campos
    const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Validar que al menos una necesidad esté seleccionada
    if (formState.selectedNeeds.size === 0) {
        alert('Por favor selecciona al menos una necesidad');
        document.getElementById('needsList').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    if (!isValid) {
        // Scroll al primer error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Recopilar datos del formulario
    const formData = collectFormData();
    
    // Mostrar animación de carga
    showLoadingState();
    
    // Simular envío (aquí conectarías con tu backend)
    setTimeout(() => {
        console.log('Datos del formulario:', formData);
        showSuccessMessage();
    }, 1500);
}

// Recopilar datos del formulario
function collectFormData() {
    return {
        nombre: document.getElementById('nombre').value,
        edad: document.getElementById('edad').value,
        necesidades: Array.from(formState.selectedNeeds),
        razon: document.getElementById('razon').value,
        codigoPostal: document.getElementById('codigoPostal').value,
        ubicacion: document.getElementById('ubicacion').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        timestamp: new Date().toISOString()
    };
}

// Mostrar estado de carga
function showLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    const buttonText = submitBtn.querySelector('.button-text');
    const buttonIcon = submitBtn.querySelector('.button-icon');
    
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
    
    buttonText.textContent = 'Enviando...';
    buttonIcon.textContent = '⏳';
    
    // Animación de pulso
    submitBtn.style.animation = 'pulse 1s ease infinite';
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const form = document.getElementById('onboardingForm');
    const successMessage = document.getElementById('successMessage');
    
    form.style.animation = 'fadeOut 0.4s ease forwards';
    
    setTimeout(() => {
        form.style.display = 'none';
        successMessage.classList.add('show');
        
        // Confetti effect (opcional)
        createConfetti();
        
        // Reiniciar el formulario después de 5 segundos (opcional)
        setTimeout(() => {
            resetForm();
        }, 5000);
    }, 400);
}

// Crear efecto de confetti
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                border-radius: 50%;
                animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                z-index: 9999;
                opacity: 0.8;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// Agregar animación de confetti al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(style);

// Reiniciar el formulario
function resetForm() {
    const form = document.getElementById('onboardingForm');
    const successMessage = document.getElementById('successMessage');
    
    successMessage.style.animation = 'fadeOut 0.4s ease forwards';
    
    setTimeout(() => {
        successMessage.classList.remove('show');
        form.style.display = 'block';
        form.style.animation = 'fadeIn 0.6s ease forwards';
        form.reset();
        
        // Limpiar selecciones
        document.querySelectorAll('.option-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        formState.selectedNeeds.clear();
        
        // Restaurar botón
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.style.animation = '';
        submitBtn.querySelector('.button-text').textContent = 'Enviar Formulario';
        submitBtn.querySelector('.button-icon').textContent = '→';
    }, 400);
}

// Formateo automático de teléfono
document.getElementById('telefono')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    e.target.value = value;
});

// Formateo automático de código postal
document.getElementById('codigoPostal')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.slice(0, 5);
    }
    e.target.value = value;
});
