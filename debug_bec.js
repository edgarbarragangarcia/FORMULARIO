// Script de prueba para verificar el procesamiento del BEC
// Pega esto en la consola del navegador después de enviar el formulario

console.log('='.repeat(50));
console.log('🔍 SCRIPT DE DEBUG - Verificando BEC');
console.log('='.repeat(50));

// Obtener la última respuesta del localStorage
const lastResponse = localStorage.getItem('lastWebhookResponse');
if (lastResponse) {
    const parsed = JSON.parse(lastResponse);
    console.log('\n📦 Respuesta guardada en localStorage:');
    console.log(parsed);

    console.log('\n📋 BEC:');
    console.log(parsed.bec);

    if (parsed.bec) {
        console.log('\n📝 Propiedades del BEC:');
        console.log('  - Recomendacion_Principal:', typeof parsed.bec.Recomendacion_Principal, parsed.bec.Recomendacion_Principal);
        console.log('  - Alternativa_Viable:', typeof parsed.bec.Alternativa_Viable, parsed.bec.Alternativa_Viable);
        console.log('  - Argumento_Venta:', typeof parsed.bec.Argumento_Venta, parsed.bec.Argumento_Venta);
        console.log('  - Complementos_Sugeridos:', typeof parsed.bec.Complementos_Sugeridos, parsed.bec.Complementos_Sugeridos);
        console.log('  - Analisis_Perfil:', typeof parsed.bec.Analisis_Perfil, parsed.bec.Analisis_Perfil);
    }
} else {
    console.log('❌ No hay respuesta guardada en localStorage');
}

console.log('\n' + '='.repeat(50));

// También mostrar lo que hay en el DOM
const successMessage = document.getElementById('successMessage');
if (successMessage && successMessage.classList.contains('show')) {
    console.log('\n📄 Contenido HTML actual:');
    console.log(successMessage.innerHTML);
}
