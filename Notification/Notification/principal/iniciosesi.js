// Datos de usuarios (cada uno con su área y contraseña)
const usuarios = {
    'mantenimiento': { password: 'mantenimientoandres', redirigirA: 'andres.html' },
    'administracion': { password: 'admiismael', redirigirA: 'ismael.html' },
    'amp': { password: 'danielamp123', redirigirA: 'daniel.html' },
    'administrador': { password: 'Vinavieja123', redirigirA: 'presentacion.html' }, 
    'laboratorio': { password: 'deyaniralaboratorio', redirigirA: 'deyanira.html' }, 
    'topico': { password: 'mariatopico123', redirigirA: 'maria.html' },
    'calidad': { password: 'calidadperla1528', redirigirA: 'perla.html' } 
};

// Manejo del inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const area = document.getElementById('area').value.toLowerCase();
    const password = document.getElementById('password').value;

    // Verificar si el área existe y si la contraseña es correcta
    if (usuarios[area] && usuarios[area].password === password) {
        // Redirigir a la página correspondiente del usuario según el área
        window.location.href = usuarios[area].redirigirA;
    } else {
        // Si no se encuentra el área o la contraseña es incorrecta
        alert('Área o contraseña incorrectos');
    }
});
