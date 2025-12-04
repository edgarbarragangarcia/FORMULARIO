# Formulario de Onboarding - Ingenes

Formulario multi-paso moderno y responsive para captura de información de pacientes.

## 🚀 Características

- ✨ **Diseño Multi-Paso**: Una pregunta por página con navegación fluida
- 📊 **Barra de Progreso**: Indicador visual del avance (Paso X de 8)
- 🎴 **Tarjetas Visuales**: Grid de cards con iconos para selección de necesidades
- 🏥 **20 Sucursales**: Todas las ubicaciones reales de Ingenes (México y USA)
- 🔗 **Integración n8n**: Envío automático de datos al webhook
- 💫 **Animaciones Premium**: Transiciones suaves y efectos visuales
- 📱 **Responsive**: Adaptado a móvil, tablet y desktop
- ✅ **Validación en Tiempo Real**: Por cada paso antes de avanzar

## 📝 Estructura del Formulario

### Paso 1: Nombre
¿Cómo te llamas?

### Paso 2: Edad
¿Cuál es tu edad?

### Paso 3: Necesidades
Queremos entender qué necesitas (selección múltiple con tarjetas visuales)

### Paso 4: Razón
¿Por qué crees que requieres este servicio?

### Paso 5: Código Postal
¿Cuál es tu código postal?

### Paso 6: Ubicación
¿Dónde quieres ser atendido/a? (20 sucursales disponibles)

### Paso 7: Teléfono
¿Cuál es tu teléfono?

### Paso 8: Email
¿Cuál es tu correo electrónico?

## 🧪 Modo de Prueba

Para llenar automáticamente el formulario con datos de prueba:

**Presiona:** `Ctrl + Shift + T` (Windows/Linux) o `Cmd + Shift + T` (Mac)

Esto llenará todos los campos con datos de ejemplo:
- Nombre: María García López
- Edad: 32
- Necesidades: "Me operaron antes" + "Evaluar salud"
- Razón: "Queremos tener mucho un bebe y no hemos podido porque somos operados"
- Código Postal: 06600
- Ubicación: Ciudad de México
- Teléfono: 5512345678
- Email: maria.garcia@ejemplo.com

## 🔗 Integración con n8n

El formulario envía los datos automáticamente al webhook de n8n cuando se completa:

**Webhook URL:** `https://n8nqa.ingenes.com:5689/webhook-test/scoreN8N`

**Método:** POST

**Formato de datos enviados:**
```json
{
  "nombre": "string",
  "edad": "number",
  "necesidades": ["array", "of", "values"],
  "razon": "string",
  "codigoPostal": "string",
  "ubicacion": "string",
  "telefono": "string",
  "email": "string",
  "timestamp": "ISO 8601 date string"
}
```

## 🎨 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Glassmorphism, gradientes, animaciones
- **JavaScript (Vanilla)**: Sin dependencias externas
- **Google Fonts**: Inter (typography)

## 📦 Archivos

```
FORMULARIO/
├── index.html          # Estructura del formulario
├── styles.css          # Estilos y animaciones
├── script.js           # Lógica y validación
└── README.md           # Este archivo
```

## 🚀 Uso

1. Abre `index.html` en cualquier navegador moderno
2. Navega por los pasos usando los botones "Siguiente" y "Atrás"
3. Presiona Enter para avanzar rápidamente
4. Al finalizar, los datos se envían automáticamente al webhook

## 🔧 Desarrollo

Para trabajar en el proyecto:

```bash
# Clonar el repositorio
git clone https://github.com/edgarbarragangarcia/FORMULARIO.git

# Abrir el archivo
open index.html

# Para modo de prueba rápida
Presiona Ctrl+Shift+T (o Cmd+Shift+T en Mac)
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (grid de 3 columnas en tarjetas)
- **Tablet**: 481px - 768px (grid de 2 columnas)
- **Mobile**: < 480px (grid de 1 columna)

## ✨ Características UX

- Auto-focus en el primer campo de cada paso
- Validación antes de avanzar
- Mensajes de error personalizados
- Notificaciones visuales
- Confetti al completar exitosamente
- Scrollbar personalizado
- Efectos hover premium
- Animaciones de entrada/salida

## 📄 Licencia

©2025 Instituto Ingenes - Todos los derechos reservados

## 🤝 Soporte

Para soporte o preguntas, contacta al equipo de desarrollo de Ingenes.
