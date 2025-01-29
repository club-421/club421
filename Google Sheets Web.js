const scriptURL = 'https://script.google.com/macros/s/AKfycbxf-F_qOVhGEgHKDDzmOlhptf4K-j5_CpG3QbOA87WWlwYlVUcsDDai_kWnJY4Z9VfO/exec';
const form = document.getElementById('runningClubForm');

// Crear los elementos de alerta
const alertContainer = document.createElement('div');
alertContainer.className = 'alert-container';
form.parentNode.insertBefore(alertContainer, form.nextSibling);

function showAlert(message, type) {
    // Crear el elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    // Crear el contenido de la alerta
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Añadir la alerta al contenedor
    alertContainer.appendChild(alert);
    
    // Añadir evento para cerrar la alerta
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.classList.add('alert-fade-out');
        setTimeout(() => alert.remove(), 300);
    });
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.add('alert-fade-out');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

form.addEventListener('submit', e => {
    e.preventDefault();
    
    const runnerSelect = document.getElementById('runner');
    const runnerName = runnerSelect.options[runnerSelect.selectedIndex].text;
    
    const formData = new FormData(form);
    formData.set('runner', runnerName);

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        showAlert('¡Gracias por proponer un nuevo reto! Se ha enviado correctamente.', 'success');
        form.reset();
    })
    .catch(error => {
        console.error('Error!', error.message);
        showAlert('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.', 'error');
    })
    .finally(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    });
});