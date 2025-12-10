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
    // Mostrar selector de nivel de intención
    showIntentionLevelSelector();
}

// Mostrar selector de nivel de intención
function showIntentionLevelSelector() {
    const modal = document.createElement('div');
    modal.className = 'intention-modal';
    modal.innerHTML = `
        <div class="intention-modal-content">
            <h3>🎯 Selecciona el Nivel de Intención</h3>
            <p class="intention-subtitle">Elige el nivel para entrenar al agente:</p>
            
            <div class="intention-options">
                <button class="intention-btn high" data-level="high">
                    <span class="intention-icon">🔥</span>
                    <span class="intention-label">ALTO</span>
                    <span class="intention-desc">Urgencia clara, problema específico</span>
                </button>
                
                <button class="intention-btn medium" data-level="medium">
                    <span class="intention-icon">💭</span>
                    <span class="intention-label">MEDIO</span>
                    <span class="intention-desc">Interés sin urgencia, explorando</span>
                </button>
                
                <button class="intention-btn low" data-level="low">
                    <span class="intention-icon">📋</span>
                    <span class="intention-label">BAJO</span>
                    <span class="intention-desc">Curiosidad, poca información</span>
                </button>
            </div>
            
            <button class="intention-cancel">Cancelar</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Agregar event listeners
    const buttons = modal.querySelectorAll('.intention-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            const level = this.getAttribute('data-level');
            modal.remove();
            runTestWithIntentionLevel(level);
        });
    });

    modal.querySelector('.intention-cancel').addEventListener('click', () => {
        modal.remove();
    });

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Ejecutar test con nivel de intención específico
async function runTestWithIntentionLevel(level) {
    const testBtn = document.getElementById('testModeBtn');
    testBtn.classList.add('running');
    testBtn.textContent = `⏳ Llenando (${level.toUpperCase()})...`;

    // Mensajes según nivel de intención
    const intentionMessages = {
        high: 'Queremos tener mucho un bebé y no hemos podido porque somos operados. Ya llevamos 3 años intentándolo y estamos desesperados. Necesitamos ayuda urgente para cumplir nuestro sueño de ser padres.',
        medium: 'Estamos considerando tener un bebé pero queremos primero evaluar nuestras opciones y entender qué tratamientos existen. No hemos intentado aún pero nos gustaría saber más sobre el proceso.',
        low: 'Solo estoy buscando información sobre fertilidad. Quizás en el futuro consideremos tener hijos, pero por ahora solo queremos informarnos sobre las posibilidades.'
    };

    const selectedMessage = intentionMessages[level];

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

    // Paso 3: DETENER Y ESPERAR SELECCIÓN MANUAL
    testBtn.textContent = `⏸️ Selecciona opciones (${level.toUpperCase()})`;
    showNotification('👆 Selecciona las opciones que necesites y se continuará automáticamente', 'info');

    // Esperar a que el usuario seleccione opciones
    await waitForUserSelection();

    // Continuar automáticamente después de la selección
    testBtn.textContent = `⏳ Continuando (${level.toUpperCase()})...`;
    await sleep(1000);

    // Avanzar al paso 4
    document.querySelector('.btn-next[data-next="4"]').click();
    await sleep(600);

    // Paso 4: Razón (mensaje según nivel de intención)
    await typeText(document.getElementById('razon'), selectedMessage);
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

    showNotification(`✅ Formulario completado - Nivel: ${level.toUpperCase()}`, 'info');
    console.log(`✅ Test completado con nivel de intención: ${level.toUpperCase()}`);
    console.log(`📝 Respuesta generada: "${selectedMessage}"`);
}

// Esperar a que el usuario seleccione al menos una opción
function waitForUserSelection() {
    return new Promise((resolve) => {
        const needsGrid = document.getElementById('needsGrid');
        if (!needsGrid) {
            resolve();
            return;
        }

        let selectionMade = false;

        // Listener para detectar cuando se hace una selección
        const handleSelection = (event) => {
            const card = event.target.closest('.need-card');
            if (!card) return;

            // Esperar un momento para que se complete la animación de selección
            setTimeout(() => {
                // Verificar si hay al menos una selección
                const selectedCards = needsGrid.querySelectorAll('.need-card.selected');
                if (selectedCards.length > 0 && !selectionMade) {
                    selectionMade = true;
                    needsGrid.removeEventListener('click', handleSelection);

                    // Pequeño delay antes de continuar
                    setTimeout(() => {
                        resolve();
                    }, 800);
                }
            }, 100);
        };

        needsGrid.addEventListener('click', handleSelection);

        // Timeout de seguridad (30 segundos)
        setTimeout(() => {
            if (!selectionMade) {
                needsGrid.removeEventListener('click', handleSelection);
                resolve();
            }
        }, 30000);
    });
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
    fetch('https://n8nqa.ingenes.com:5689/webhook/scoreN8N', {
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
            console.log('✅ Respuesta completa del webhook:', data);
            console.log('📤 Datos enviados:', formData);

            // Procesar la respuesta del webhook
            processWebhookResponse(data, formData);
        })
        .catch(error => {
            console.error('❌ Error al enviar el formulario:', error);
            console.log('📤 Datos que se intentaron enviar:', formData);

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

// Procesar respuesta del webhook
function processWebhookResponse(responseData, originalFormData) {
    console.log('🔍 Procesando respuesta del webhook...');

    // La respuesta puede venir como array o como objeto
    let data = Array.isArray(responseData) ? responseData[0] : responseData;

    console.log('📊 Datos procesados:', data);

    // Extraer información clave
    const webhookResponse = {
        // Datos personales
        nombre: data['Persona - Nombre'] || data['ID'] || originalFormData.nombre,
        email: data['Persona - Correo electrónico - Trabajo'] || originalFormData.email,
        telefono: data['Persona - Teléfono - Otro'] || originalFormData.telefono,
        codigoPostal: data['Persona - Código postal'] || originalFormData.codigoPostal,

        // Análisis de IA
        nivelIntencion: data['Persona - Analisis de Intencion'] || data['RESPUESTAS IA'] || 'No disponible',
        respuestaUsuario: data['RESPUESTAS USUARIO'] || originalFormData.razon,

        // BEC (Business Evaluation Criteria)
        bec: null
    };

    // Parsear el BEC - puede venir como string JSON o como objeto
    if (data['BEC']) {
        try {
            // Si BEC es un objeto, usarlo directamente
            if (typeof data['BEC'] === 'object' && data['BEC'] !== null) {
                webhookResponse.bec = data['BEC'];
                console.log('📋 BEC recibido como objeto:', webhookResponse.bec);
            }
            // Si es un string, parsearlo
            else if (typeof data['BEC'] === 'string') {
                let becString = data['BEC'];
                // Limpiar el string de BEC (puede venir con ```json```)
                becString = becString.replace(/```json\n/g, '').replace(/```/g, '').trim();
                webhookResponse.bec = JSON.parse(becString);
                console.log('📋 BEC parseado desde string:', webhookResponse.bec);
            }
        } catch (error) {
            console.warn('⚠️ No se pudo parsear el BEC:', error);
            console.warn('BEC recibido:', data['BEC']);
            webhookResponse.bec = { raw: data['BEC'] };
        }
    }

    // Guardar en localStorage para referencia futura
    localStorage.setItem('lastWebhookResponse', JSON.stringify(webhookResponse));
    localStorage.setItem('lastSubmissionDate', new Date().toISOString());

    console.log('✅ Webhook response procesado:', webhookResponse);

    // Mostrar mensaje de éxito con los datos
    showSuccessWithResults(webhookResponse);
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

// Mostrar mensaje de éxito con resultados
function showSuccessWithResults(webhookResponse) {
    const form = document.querySelector('.multi-step-form');
    const progressBar = document.querySelector('.progress-bar-container');
    const successMessage = document.getElementById('successMessage');

    form.style.animation = 'fadeOut 0.4s ease forwards';
    progressBar.style.animation = 'fadeOut 0.4s ease forwards';

    setTimeout(() => {
        form.style.display = 'none';
        progressBar.style.display = 'none';

        // Actualizar el contenido del mensaje de éxito con los resultados
        updateSuccessMessageContent(successMessage, webhookResponse);

        successMessage.classList.add('show');

        // Confetti effect
        createConfetti();
    }, 400);
}

// Actualizar contenido del mensaje de éxito con resultados del webhook
function updateSuccessMessageContent(successMessage, webhookResponse) {
    // Debug: Ver qué estamos recibiendo
    console.log('🎨 Actualizando contenido de éxito con:', webhookResponse);
    console.log('📋 BEC completo:', webhookResponse.bec);
    if (webhookResponse.bec) {
        console.log('📝 Recomendacion_Principal:', webhookResponse.bec.Recomendacion_Principal);
        console.log('💡 Alternativa_Viable:', webhookResponse.bec.Alternativa_Viable);
        console.log('📢 Argumento_Venta:', webhookResponse.bec.Argumento_Venta);
        console.log('🌟 Complementos_Sugeridos:', webhookResponse.bec.Complementos_Sugeridos);
    }

    // Determinar el emoji según el nivel de intención
    const nivelEmoji = {
        'Alto': '🔥',
        'Medio': '💭',
        'Bajo': '📋'
    };

    const emoji = nivelEmoji[webhookResponse.nivelIntencion] || '✨';

    // Construir el HTML con los resultados
    let resultadosHTML = `
        <div class="success-icon">✓</div>
        <h2>¡Gracias por completar el formulario!</h2>
        <p class="success-subtitle">
            Hemos recibido tu información y la hemos analizado exitosamente.
        </p>
        
        <div class="results-container">
            <div class="result-card">
                <div class="result-header">
                    <span class="result-icon">${emoji}</span>
                    <h3>Análisis de Intención</h3>
                </div>
                <div class="result-content">
                    <div class="result-badge nivel-${webhookResponse.nivelIntencion.toLowerCase()}">
                        ${webhookResponse.nivelIntencion}
                    </div>
                </div>
            </div>
    `;

    // Agregar la respuesta del usuario
    if (webhookResponse.respuestaUsuario) {
        resultadosHTML += `
            <div class="result-card highlight-card">
                <div class="result-header">
                    <span class="result-icon">💬</span>
                    <h3>Tu Respuesta</h3>
                </div>
                <div class="result-content">
                    <p class="result-text user-response">"${webhookResponse.respuestaUsuario}"</p>
                </div>
            </div>
        `;
    }

    // Agregar información del BEC si está disponible
    if (webhookResponse.bec && webhookResponse.bec.Recomendacion_Principal) {
        resultadosHTML += `
            <div class="result-card">
                <div class="result-header">
                    <span class="result-icon">🎯</span>
                    <h3>Recomendación Principal</h3>
                </div>
                <div class="result-content">
                    <p class="result-text">${webhookResponse.bec.Recomendacion_Principal}</p>
                </div>
            </div>
        `;

        if (webhookResponse.bec.Alternativa_Viable) {
            resultadosHTML += `
                <div class="result-card">
                    <div class="result-header">
                        <span class="result-icon">💡</span>
                        <h3>Alternativa Viable</h3>
                    </div>
                    <div class="result-content">
                        <p class="result-text">${webhookResponse.bec.Alternativa_Viable}</p>
                    </div>
                </div>
            `;
        }

        // Agregar el Argumento de Venta si existe
        if (webhookResponse.bec.Argumento_Venta) {
            resultadosHTML += `
                <div class="result-card highlight-card">
                    <div class="result-header">
                        <span class="result-icon">📢</span>
                        <h3>Por Qué Te Recomendamos Esto</h3>
                    </div>
                    <div class="result-content">
                        <p class="result-text sales-argument">${webhookResponse.bec.Argumento_Venta}</p>
                    </div>
                </div>
            `;
        }

        if (webhookResponse.bec.Complementos_Sugeridos && webhookResponse.bec.Complementos_Sugeridos.length > 0) {
            resultadosHTML += `
                <div class="result-card">
                    <div class="result-header">
                        <span class="result-icon">🌟</span>
                        <h3>Complementos Sugeridos</h3>
                    </div>
                    <div class="result-content">
                        <ul class="complementos-list">
                            ${webhookResponse.bec.Complementos_Sugeridos.map(comp => `<li>${comp}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
    }

    resultadosHTML += `
            <div class="result-card contact-info">
                <div class="result-header">
                    <span class="result-icon">👤</span>
                    <h3>Información de Contacto</h3>
                </div>
                <div class="result-content">
                    <p><strong>Nombre:</strong> ${webhookResponse.nombre}</p>
                    <p><strong>Email:</strong> ${webhookResponse.email}</p>
                    <p><strong>Teléfono:</strong> ${webhookResponse.telefono}</p>
                </div>
            </div>
        </div>
        
        <button id="btnRestart" class="btn-restart">Enviar Otro Formulario</button>
    `;

    successMessage.innerHTML = resultadosHTML;

    // Agregar event listener al botón de restart
    const btnRestart = successMessage.querySelector('#btnRestart');
    if (btnRestart) {
        btnRestart.addEventListener('click', resetForm);
    }
}

// Mostrar mensaje de éxito (versión simple, mantenida para compatibilidad)
function showSuccessMessage() {
    showSuccessWithResults({
        nombre: 'Usuario',
        email: 'No especificado',
        telefono: 'No especificado',
        nivelIntencion: 'Medio',
        bec: null
    });
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
