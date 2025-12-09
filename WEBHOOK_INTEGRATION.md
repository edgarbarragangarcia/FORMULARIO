# Integración con Webhook de n8n

## Descripción General

El formulario ahora está completamente integrado con el webhook de n8n para recibir análisis de IA en tiempo real.

## Flujo de Datos

### 1. Envío del Formulario
Cuando el usuario completa el formulario, se envían los siguientes datos:

```json
{
  "nombre": "María García López",
  "edad": "32",
  "necesidades": ["cirugias-previas", "infertilidad"],
  "razon": "Queremos tener mucho un bebé...",
  "codigoPostal": "06600",
  "ubicacion": "ciudad-mexico",
  "telefono": "5512345678",
  "email": "maria.garcia@ejemplo.com",
  "timestamp": "2025-12-09T20:53:45.000Z"
}
```

### 2. Procesamiento en n8n
El webhook procesa los datos a través del flujo:
- **Webhook** → Recibe datos
- **Edit Fields** → Normaliza campos
- **Sentiment Analysis** → Analiza intención
- **AI Agent** → Genera recomendaciones
- **Google Sheets** → Almacena datos
- **Respond to Webhook** → Devuelve resultados

### 3. Respuesta del Webhook
La respuesta contiene el análisis completo:

```json
[
  {
    "RESPUESTAS IA": "Alto",
    "ID": "María García López",
    "Persona - Nombre": "María García López",
    "Persona - Correo electrónico - Trabajo": "maria.garcia@ejemplo.com",
    "Persona - Teléfono - Otro": "5512345678",
    "Persona - Código postal": "06600",
    "Persona - Analisis de Intencion": "Alto",
    "BEC": "```json\n{\n  \"Analisis_Perfil\": \"...\",\n  \"Recomendacion_Principal\": \"Consulta Diagnóstico + FIV\",\n  \"Alternativa_Viable\": \"FIV con ICSI/PICSI\",\n  \"Complementos_Sugeridos\": [\"Salud Emocional\", \"Score de Implantación\"],\n  \"Argumento_Venta\": \"...\"\n}\n```",
    "RESPUESTAS USUARIO": "Queremos tener mucho un bebé..."
  }
]
```

## Procesamiento de la Respuesta

### Función `processWebhookResponse()`
Esta función:

1. **Extrae los datos** de la respuesta (maneja tanto arrays como objetos)
2. **Parsea el BEC** (Business Evaluation Criteria) desde JSON embebido
3. **Guarda en localStorage** para referencia futura
4. **Muestra los resultados** al usuario de forma visual

### Datos Extraídos

```javascript
{
  // Datos personales
  nombre: "María García López",
  email: "maria.garcia@ejemplo.com",
  telefono: "5512345678",
  codigoPostal: "06600",
  
  // Análisis de IA
  nivelIntencion: "Alto", // Alto, Medio, Bajo
  respuestaUsuario: "Queremos tener mucho un bebé...",
  
  // BEC parseado
  bec: {
    Analisis_Perfil: "Pareja joven con infertilidad...",
    Recomendacion_Principal: "Consulta Diagnóstico + FIV",
    Alternativa_Viable: "FIV con ICSI/PICSI",
    Complementos_Sugeridos: ["Salud Emocional", "Score de Implantación"],
    Argumento_Venta: "Entendemos profundamente su desesperación..."
  }
}
```

## Visualización de Resultados

### Pantalla de Éxito
Muestra:

#### 1. **Análisis de Intención**
- Badge con nivel (Alto/Medio/Bajo)
- Colores distintivos:
  - 🔥 **Alto**: Rojo (#f5576c) - Urgencia clara
  - 💭 **Medio**: Naranja (#ffa726) - Explorando opciones
  - 📋 **Bajo**: Azul (#4facfe) - Solo información

#### 2. **Recomendación Principal**
- 🎯 Tratamiento sugerido por la IA
- Basado en el análisis del perfil

#### 3. **Alternativa Viable**
- 💡 Opción secundaria de tratamiento
- Consideraciones adicionales

#### 4. **Complementos Sugeridos**
- 🌟 Lista de servicios complementarios
- Hover effect interactivo

#### 5. **Información de Contacto**
- 👤 Confirmación de datos recibidos
- Verificación visual para el usuario

## Almacenamiento Local

Los datos se guardan en `localStorage` para:

1. **Referencia futura**: Consultar últimos resultados
2. **Analytics**: Rastrear conversiones
3. **Debug**: Facilitar troubleshooting

```javascript
// Recuperar última respuesta
const lastResponse = JSON.parse(localStorage.getItem('lastWebhookResponse'));
const lastDate = localStorage.getItem('lastSubmissionDate');
```

## Manejo de Errores

### Casos Contemplados:

1. **Respuesta vacía**: Muestra datos del formulario original
2. **BEC malformado**: Guarda como string crudo
3. **Campos faltantes**: Usa valores por defecto del formulario
4. **Error de red**: Muestra mensaje de error y restaura botón de envío

### Logs en Consola:

```javascript
✅ Respuesta completa del webhook: {...}
📤 Datos enviados: {...}
🔍 Procesando respuesta del webhook...
📊 Datos procesados: {...}
📋 BEC parseado: {...}
```

## Modo Test

El modo test respeta los mismos flujos:

1. Usuario selecciona nivel de intención (Alto/Medio/Bajo)
2. Formulario se llena automáticamente con datos de prueba
3. Se envía al webhook real
4. Se espera respuesta y se procesa normalmente

### Datos de Test:

- **Alto**: "Queremos tener mucho un bebé... estamos desesperados"
- **Medio**: "Considerando tener un bebé... queremos evaluar opciones"
- **Bajo**: "Solo buscando información sobre fertilidad"

## Integración con Google Sheets

Todos los datos se almacenan automáticamente en Google Sheets a través del flujo de n8n, incluyendo:

- Datos del formulario
- Análisis de intención
- Recomendaciones BEC
- Timestamp de envío

## Próximos Pasos

Posibles mejoras:

1. ✅ **Animaciones de entrada** para resultados
2. 📊 **Dashboard** de resultados históricos
3. 📧 **Email** automático con resultados
4. 📱 **SMS** de confirmación
5. 🔔 **Notificaciones** push para seguimiento

---

**Última actualización**: 2025-12-09  
**Endpoint**: `https://n8nqa.ingenes.com:5689/webhook/scoreN8N`  
**Método**: POST
