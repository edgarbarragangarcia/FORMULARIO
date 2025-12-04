// Estado del formulario
const formState = {
    currentStep: 1,
    totalSteps: 8,
    selectedNeeds: new Set(),
    formData: {}
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    setupNavigation();
    setupOptionsList();
    setupFormValidation();
    updateProgressBar();
    setupTestMode();
});

// Configurar modo de prueba con botón visible
function setupTestMode() {
    const testBtn = document.getElementById('testModeBtn');

    if (testBtn) {
        testBtn.addEventListener('click', function () {
            if (!this.classList.contains('running')) {
                startAnimatedTestFill();
            }
        });
    }
}

// Iniciar llenado animado del test
async function startAnimatedTestFill() {
    const testBtn = document.getElementById('testModeBtn');
    testBtn.classList.add('running');
    testBtn.textContent = '⏳ Llenando...';

    // Ir al paso 1 primero
    goToStep(1);
    await sleep(500);

    // Paso 1: Nombre (con efecto de escritura)
    await typeText(document.getElementById('nombre'), 'María García López');
    await sleep(800);

    // Avanzar al paso 2
    document.querySelector('.btn-next[data-next="2"]').click();
    await sleep(600);

    // Paso 2: Edad
    await typeText(document.getElementById('edad'), '32');
    await sleep(800);

    // Avanzar al paso 3
    document.querySelector('.btn-next[data-next="3"]').click();
    await sleep(600);

    // Paso 3: Necesidades (seleccionar con delay)
    const needsToSelect = ['operacion-hijos', 'evaluar-salud'];
    for (const value of needsToSelect) {
        const card = document.querySelector(`.need-card[data-value="${value}"]`);
        if (card && !card.classList.contains('selected')) {
            card.click();
            await sleep(500);
        }
    }
    await sleep(800);

    // Avanzar al paso 4
    document.querySelector('.btn-next[data-next="4"]').click();
    await sleep(600);

    // Paso 4: Razón (con efecto de escritura)
    await typeText(document.getElementById('razon'), 'Queremos tener mucho un bebe y no hemos podido porque somos operados');
    await sleep(800);

    // Avanzar al paso 5
    document.querySelector('.btn-next[data-next="5"]').click();
    await sleep(600);

    // Paso 5: Código Postal
    await typeText(document.getElementById('codigoPostal'), '06600');
    await sleep(800);

    // Avanzar al paso 6
    document.querySelector('.btn-next[data-next="6"]').click();
    await sleep(600);

    // Paso 6: Ubicación
    document.getElementById('ubicacion').value = 'ciudad-mexico';
    document.getElementById('ubicacion').dispatchEvent(new Event('change'));
    await sleep(800);

    // Avanzar al paso 7
    document.querySelector('.btn-next[data-next="7"]').click();
    await sleep(600);

    // Paso 7: Teléfono
    await typeText(document.getElementById('telefono'), '5512345678');
    await sleep(800);

    // Avanzar al paso 8
    document.querySelector('.btn-next[data-next="8"]').click();
    await sleep(600);

    // Paso 8: Email
    await typeText(document.getElementById('email'), 'maria.garcia@ejemplo.com');
    await sleep(500);

    // Restaurar botón
    testBtn.classList.remove('running');
    testBtn.textContent = '🧪 Modo Test';

    showNotification('✅ Formulario completado en modo test', 'info');
    console.log('✅ Test completado - Formulario listo para enviar');
}

// Función auxiliar para simular escritura
function typeText(element, text) {
    return new Promise((resolve) => {
        element.value = '';
        let index = 0;

        const interval = setInterval(() => {
            if (index < text.length) {
                element.value += text[index];
                index++;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, 30); // 30ms por carácter
    });
}

// Función auxiliar para delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Inicializar el formulario
function initializeForm() {
    const form = document.getElementById('onboardingForm');
    form.addEventListener('submit', handleFormSubmit);

    // Agregar listener al botón de restart
    const btnRestart = document.getElementById('btnRestart');
    if (btnRestart) {
        btnRestart.addEventListener('click', resetForm);
    }
}

// Configurar navegación entre pasos
function setupNavigation() {
    // Botones "Siguiente"
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const nextStep = parseInt(this.getAttribute('data-next'));
            if (validateCurrentStep()) {
                goToStep(nextStep);
            }
        });
    });

    // Botones "Atrás"
    const backButtons = document.querySelectorAll('.btn-back');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const backStep = parseInt(this.getAttribute('data-back'));
            goToStep(backStep);
        });
    });

    // Enter para avanzar
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const currentStepElement = document.querySelector('.form-step.active');
                const nextBtn = currentStepElement.querySelector('.btn-next');
                if (nextBtn) {
                    nextBtn.click();
                }
            }
        });
    });
}

// Ir a un paso específico
function goToStep(stepNumber) {
    const currentStepElement = document.querySelector('.form-step.active');
    const nextStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);

    if (!nextStepElement) return;

    // Animación de salida
    currentStepElement.classList.add('exiting');

    setTimeout(() => {
        currentStepElement.classList.remove('active', 'exiting');
        nextStepElement.classList.add('active');

        formState.currentStep = stepNumber;
        updateProgressBar();

        // Focus en el primer input del nuevo paso
        const firstInput = nextStepElement.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }, 400);
}

// Actualizar barra de progreso
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    const percentage = (formState.currentStep / formState.totalSteps) * 100;

    progressBar.style.width = percentage + '%';
    progressText.textContent = `Paso ${formState.currentStep} de ${formState.totalSteps}`;
}

// Validar el paso actual
function validateCurrentStep() {
    const currentStepElement = document.querySelector('.form-step.active');
    const inputs = currentStepElement.querySelectorAll('input:required, select:required, textarea:required');

    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // Validación especial para el paso de necesidades
    if (formState.currentStep === 3 && formState.selectedNeeds.size === 0) {
        showNotification('Por favor selecciona al menos una necesidad', 'warning');
        return false;
    }

    return isValid;
}

// Configurar el grid de tarjetas de necesidades
function setupOptionsList() {
    const needsGrid = document.getElementById('needsGrid');
    if (!needsGrid) return;

    const needCards = needsGrid.querySelectorAll('.need-card');

    // Configurar cada tarjeta
    needCards.forEach(card => {
        card.addEventListener('click', function () {
            toggleNeedCard(this);
        });

        // Animación de entrada escalonada
        const index = Array.from(needCards).indexOf(card);
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            requestAnimationFrame(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, index * 50);
    });
}

// Toggle de una tarjeta de necesidad
function toggleNeedCard(card) {
    const value = card.getAttribute('data-value');

    if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        formState.selectedNeeds.delete(value);
    } else {
        card.classList.add('selected');
        formState.selectedNeeds.add(value);
    }

    console.log('Necesidades seleccionadas:', Array.from(formState.selectedNeeds));
}

// Validación del formulario
function setupFormValidation() {
    const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validar un campo individual
function validateField(field) {
    const isValid = field.checkValidity();

    if (!isValid && field.value !== '') {
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
            justify-content: center;
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

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'warning' ? '#f5576c' : '#667eea'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar animaciones de notificación
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(notificationStyle);

// Manejar envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateCurrentStep()) {
        return;
    }

    // Recopilar datos del formulario
    const formData = collectFormData();

    // Mostrar animación de carga
    showLoadingState();

    // Enviar datos al webhook de n8n
    fetch('https://n8nqa.ingenes.com:5689/webhook-test/scoreN8N', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            console.log('Datos enviados:', formData);
            showSuccessMessage();
        })
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
            console.log('Datos que se intentaron enviar:', formData);

            // Mostrar mensaje de error al usuario
            showErrorMessage('Hubo un problema al enviar el formulario. Por favor, intenta de nuevo.');

            // Restaurar el botón de envío
            resetSubmitButton();
        });
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
    const submitBtn = document.querySelector('.btn-submit');
    const buttonText = submitBtn.childNodes[0];
    const buttonIcon = submitBtn.querySelector('.btn-arrow');

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';

    buttonText.textContent = 'Enviando... ';
    buttonIcon.textContent = '⏳';
}

// Mostrar mensaje de error
function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error-notification';
    notification.innerHTML = `
        <strong>⚠️ Error</strong><br>
        ${message}
    `;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1.5rem 2rem;
        background: linear-gradient(135deg, #f5576c 0%, #e63946 100%);
        color: white;
        border-radius: 16px;
        box-shadow: 0 12px 32px rgba(245, 87, 108, 0.4);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        max-width: 400px;
        line-height: 1.5;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Resetear botón de envío
function resetSubmitButton() {
    const submitBtn = document.querySelector('.btn-submit');
    const buttonText = submitBtn.childNodes[0];
    const buttonIcon = submitBtn.querySelector('.btn-arrow');

    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';

    buttonText.textContent = 'Enviar Formulario ';
    buttonIcon.textContent = '✓';
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const form = document.querySelector('.multi-step-form');
    const progressBar = document.querySelector('.progress-bar-container');
    const successMessage = document.getElementById('successMessage');

    form.style.animation = 'fadeOut 0.4s ease forwards';
    progressBar.style.animation = 'fadeOut 0.4s ease forwards';

    setTimeout(() => {
        form.style.display = 'none';
        progressBar.style.display = 'none';
        successMessage.classList.add('show');

        // Confetti effect
        createConfetti();
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

// Agregar animación de confetti
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
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
`;
document.head.appendChild(confettiStyle);

// Reiniciar el formulario
function resetForm() {
    const form = document.querySelector('.multi-step-form');
    const progressBar = document.querySelector('.progress-bar-container');
    const successMessage = document.getElementById('successMessage');

    successMessage.style.animation = 'fadeOut 0.4s ease forwards';

    setTimeout(() => {
        successMessage.classList.remove('show');
        form.style.display = 'block';
        form.style.animation = '';
        progressBar.style.display = 'block';
        progressBar.style.animation = '';

        document.getElementById('onboardingForm').reset();

        // Limpiar selecciones de tarjetas
        document.querySelectorAll('.need-card.selected').forEach(card => {
            card.classList.remove('selected');
        });
        formState.selectedNeeds.clear();

        // Volver al paso 1
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector('.form-step[data-step="1"]').classList.add('active');

        formState.currentStep = 1;
        updateProgressBar();

        // Restaurar botón de envío
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.childNodes[0].textContent = 'Enviar Formulario ';
        submitBtn.querySelector('.btn-arrow').textContent = '✓';
    }, 400);
}

// Formateo automático de teléfono
document.getElementById('telefono')?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    e.target.value = value;
});

// Formateo automático de código postal
document.getElementById('codigoPostal')?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.slice(0, 5);
    }
    e.target.value = value;
});
