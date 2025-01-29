const scriptURL = 'https://script.google.com/macros/s/AKfycbwWDlPzksFXrLtwAvmsJ5Rte-vOeu9YpAv3bDluxYg17n66ITlZplniyyw3ZCWqBRSkNw/exec';
const form = document.getElementById('contactForm');
const alertContainer = document.querySelector('.alert-container');

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    alertContainer.appendChild(alert);
    
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.classList.add('alert-fade-out');
        setTimeout(() => alert.remove(), 300);
    });
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.add('alert-fade-out');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

form.addEventListener('submit', e => {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    fetch(scriptURL, {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => {
        // No intentamos parsear la respuesta como JSON
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        // Si la respuesta es ok, mostramos el mensaje de éxito y reseteamos el form
        showAlert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo lo más rápido que podamos.', 'success');
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