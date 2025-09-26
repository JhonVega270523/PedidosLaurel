// Datos de ejemplo para probar la aplicación
let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [
    {
        id: 1,
        clienteNombre: "María González",
        clienteTelefono: "3001234567",
        destinatarioNombre: "Carlos Rodríguez",
        destinatarioTelefono: "3109876543",
        direccion: "Carrera 45 # 23-12",
        barrio: "El Poblado",
        referencia: "Cerca al centro comercial",
        producto: "Ramo de rosas premium",
        caracteristicas: "24 rosas rojas, caja negra, moño dorado",
        imagenProducto: "",
        precio: 85000,
        estadoPago: "pendiente",
        montoAbono: 0,
        ocasion: "Aniversario",
        frase: "Feliz aniversario mi amor. Te amo siempre.",
        estado: "pendiente",
        fechaEntrega: "2023-08-15T14:00",
        fechaCreacion: new Date().toISOString()
    },
    {
        id: 2,
        clienteNombre: "Juan Pérez",
        clienteTelefono: "3205551234",
        destinatarioNombre: "Ana Martínez",
        destinatarioTelefono: "3154449876",
        direccion: "Calle 10 # 22-35, Apto 402",
        barrio: "Laureles",
        referencia: "Frente al parque",
        producto: "Caja de chocolates personalizada",
        caracteristicas: "Chocolates artesanales, caja corazón, tarjeta personalizada",
        imagenProducto: "",
        precio: 65000,
        estadoPago: "abono",
        montoAbono: 30000,
        ocasion: "Cumpleaños",
        frase: "Feliz cumpleaños. Que tengas un día maravilloso.",
        estado: "entregado",
        fechaEntrega: "2023-08-10T12:30",
        fechaCreacion: new Date().toISOString()
    },
    {
        id: 3,
        clienteNombre: "Laura Silva",
        clienteTelefono: "3112223344",
        destinatarioNombre: "Pedro Gómez",
        destinatarioTelefono: "3187778899",
        direccion: "Diagonal 25B # 40-55",
        barrio: "Envigado",
        referencia: "Cerca a la alcaldía",
        producto: "Arreglo de globos y cervezas",
        caracteristicas: "6 cervezas artesanales, globos temáticos, peluche",
        imagenProducto: "",
        precio: 120000,
        estadoPago: "pagado",
        montoAbono: 120000,
        ocasion: "Despedida de soltero",
        frase: "¡Felicidades por tu despedida! Que la disfrutes.",
        estado: "entregado",
        fechaEntrega: "2023-08-05T16:00",
        fechaCreacion: new Date().toISOString()
    }
];

// Referencias a elementos del DOM
const pedidosGrid = document.getElementById('pedidosGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const countTodos = document.getElementById('countTodos');
const countPendiente = document.getElementById('countPendiente');
const countEntregado = document.getElementById('countEntregado');
const btnNuevoPedido = document.getElementById('btnNuevoPedido');
const pedidoModal = document.getElementById('pedidoModal');
const pedidoForm = document.getElementById('pedidoForm');
const modalTitulo = document.getElementById('modalTitulo');
const closeModal = document.querySelector('.close');
const alertasLista = document.getElementById('alertasLista');
const detallesModal = document.getElementById('detallesModal');
const detallesTitulo = document.getElementById('detallesTitulo');
const detallesContenido = document.getElementById('detallesContenido');
const closeDetalles = document.getElementById('closeDetalles');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const estadoPagoSelect = document.getElementById('estadoPago');
const abonoGroup = document.getElementById('abonoGroup');
const montoAbonoInput = document.getElementById('montoAbono');
const confirmarEliminarModal = document.getElementById('confirmarEliminarModal');
const cancelarEliminar = document.getElementById('cancelarEliminar');
const confirmarEliminar = document.getElementById('confirmarEliminar');
const domiciliarioModal = document.getElementById('domiciliarioModal');
const domiciliarioTitulo = document.getElementById('domiciliarioTitulo');
const domiciliarioContenido = document.getElementById('domiciliarioContenido');
const closeDomiciliario = document.getElementById('closeDomiciliario');
const copiarInfo = document.getElementById('copiarInfo');
const imagenProducto = document.getElementById('imagenProducto');
const previewImagen = document.getElementById('previewImagen');
const previewImg = document.getElementById('previewImg');
const eliminarImagen = document.getElementById('eliminarImagen');
const modalImagen = document.getElementById('modalImagen');
const imagenGrande = document.getElementById('imagenGrande');
const closeImagen = document.getElementById('closeImagen');

// Filtro actual y término de búsqueda
let filtroActual = 'todos';
let terminoBusqueda = '';
let pedidoAEliminar = null;

// Inicializar la aplicación
function init() {
    actualizarContadores();
    renderPedidos();
    configurarEventListeners();
    verificarAlertas();
}

// Configurar event listeners
function configurarEventListeners() {
    // Filtros - Mejorar compatibilidad móvil
    filterButtons.forEach(button => {
        // Función unificada para manejar clics
        const handleFilterClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Click en filtro:', button.id); // Debug
            
            if (button.id === 'btnNuevoPedido') {
                console.log('Abriendo modal nuevo pedido'); // Debug
                abrirModalNuevoPedido();
                return;
            }
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filtroActual = button.dataset.filter;
            renderPedidos();
        };
        
        // Event listener principal
        button.addEventListener('click', handleFilterClick);
        
        // Event listener táctil para móvil
        button.addEventListener('touchend', handleFilterClick, { passive: false });
        
        // Mejorar feedback visual en touchstart
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }, { passive: false });
    });

    // Cerrar modal - Mejorar compatibilidad móvil
    const handleCloseModal = (e) => {
        e.preventDefault();
        e.stopPropagation();
        pedidoModal.style.display = 'none';
    };
    
    closeModal.addEventListener('click', handleCloseModal);
    closeModal.addEventListener('touchend', handleCloseModal, { passive: false });

    // Cerrar modal de detalles - Mejorar compatibilidad móvil
    const handleCloseDetalles = (e) => {
        e.preventDefault();
        e.stopPropagation();
        detallesModal.style.display = 'none';
    };
    
    closeDetalles.addEventListener('click', handleCloseDetalles);
    closeDetalles.addEventListener('touchend', handleCloseDetalles, { passive: false });

    // Cerrar modal de domiciliario - Mejorar compatibilidad móvil
    const handleCloseDomiciliario = (e) => {
        e.preventDefault();
        e.stopPropagation();
        domiciliarioModal.style.display = 'none';
    };
    
    closeDomiciliario.addEventListener('click', handleCloseDomiciliario);
    closeDomiciliario.addEventListener('touchend', handleCloseDomiciliario, { passive: false });

    // Guardar pedido - con soporte mejorado para Chrome móvil
    pedidoForm.addEventListener('submit', (e) => {
        console.log('Evento submit detectado en formulario');
        e.preventDefault();
        e.stopPropagation();
        console.log('Formulario enviado');
        guardarPedido(e);
    });
    
    // Event listener adicional para el botón de guardar en Chrome móvil
    const submitButton = pedidoForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('touchend', (e) => {
            console.log('Touch end en botón guardar pedido');
            e.preventDefault();
            e.stopPropagation();
            
            // Validar formulario antes de enviar
            if (pedidoForm.checkValidity()) {
                console.log('Formulario válido, guardando pedido');
                guardarPedido(e);
            } else {
                console.log('Formulario inválido, mostrando errores');
                pedidoForm.reportValidity();
            }
        }, { passive: false });
    }

    // Búsqueda - Mejorar compatibilidad móvil
    searchInput.addEventListener('input', (e) => {
        terminoBusqueda = e.target.value.toLowerCase().trim();
        clearSearch.style.display = terminoBusqueda ? 'block' : 'none';
        actualizarContadores(); // Actualizar contadores según búsqueda
        renderPedidos();
    });
    
    // Event listener adicional para búsqueda en móvil
    searchInput.addEventListener('keyup', (e) => {
        terminoBusqueda = e.target.value.toLowerCase().trim();
        clearSearch.style.display = terminoBusqueda ? 'block' : 'none';
        actualizarContadores(); // Actualizar contadores según búsqueda
        renderPedidos();
    });

    // Limpiar búsqueda - Mejorar compatibilidad móvil
    clearSearch.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchInput.value = '';
        terminoBusqueda = '';
        clearSearch.style.display = 'none';
        actualizarContadores(); // Actualizar contadores al limpiar búsqueda
        renderPedidos();
    });
    
    clearSearch.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchInput.value = '';
        terminoBusqueda = '';
        clearSearch.style.display = 'none';
        actualizarContadores(); // Actualizar contadores al limpiar búsqueda
        renderPedidos();
    }, { passive: false });

    // Mostrar/ocultar campo de abono según estado de pago
    estadoPagoSelect.addEventListener('change', (e) => {
        if (e.target.value === 'abono') {
            abonoGroup.style.display = 'block';
            montoAbonoInput.required = true;
        } else {
            abonoGroup.style.display = 'none';
            montoAbonoInput.required = false;
            montoAbonoInput.value = e.target.value === 'pagado' ? document.getElementById('precio').value : '0';
        }
    });

    // Event listeners para el modal de confirmación de eliminación - Mejorar compatibilidad móvil
    cancelarEliminar.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        confirmarEliminarModal.style.display = 'none';
        pedidoAEliminar = null;
    });
    
    cancelarEliminar.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        confirmarEliminarModal.style.display = 'none';
        pedidoAEliminar = null;
    }, { passive: false });

    confirmarEliminar.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (pedidoAEliminar) {
            eliminarPedidoConfirmado(pedidoAEliminar);
        }
    });
    
    confirmarEliminar.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (pedidoAEliminar) {
            eliminarPedidoConfirmado(pedidoAEliminar);
        }
    }, { passive: false });

    // Cerrar modal al hacer clic fuera - Mejorar para evitar cierre accidental
    window.addEventListener('click', (e) => {
        // Solo cerrar si el clic es directamente en el fondo del modal, no en sus hijos
        if (e.target === pedidoModal) {
            pedidoModal.style.display = 'none';
        }
        if (e.target === detallesModal) {
            detallesModal.style.display = 'none';
        }
        if (e.target === confirmarEliminarModal) {
            confirmarEliminarModal.style.display = 'none';
            pedidoAEliminar = null;
        }
        if (e.target === domiciliarioModal) {
            domiciliarioModal.style.display = 'none';
        }
    });
    
    // Prevenir que los clics dentro del contenido del modal se propaguen y cierren el modal
    // Solo prevenir propagación en el contenido, no en el fondo del modal
    const pedidoModalContent = pedidoModal.querySelector('.modal-content');
    if (pedidoModalContent) {
        pedidoModalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    const detallesModalContent = detallesModal.querySelector('.modal-content');
    if (detallesModalContent) {
        detallesModalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    const confirmarModalContent = confirmarEliminarModal.querySelector('.modal-content');
    if (confirmarModalContent) {
        confirmarModalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    const domiciliarioModalContent = domiciliarioModal.querySelector('.modal-content');
    if (domiciliarioModalContent) {
        domiciliarioModalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Delegación de eventos eliminada - usando solo onclick directo
    console.log('Usando onclick directo para todos los botones');
    
    // Configurar manejo de imágenes
    configurarManejoImagenes();
}

// Configurar manejo de imágenes
function configurarManejoImagenes() {
    const btnSeleccionarArchivo = document.getElementById('btnSeleccionarArchivo');
    const btnTomarFoto = document.getElementById('btnTomarFoto');
    
    // Verificar que los botones existen
    if (!btnSeleccionarArchivo || !btnTomarFoto) {
        console.error('Botones de imagen no encontrados');
        return;
    }
    
    console.log('Configurando botones de imagen:', btnSeleccionarArchivo, btnTomarFoto);
    
    // Función para seleccionar archivo
    function handleSeleccionarArchivo(e) {
        e.preventDefault();
        e.stopPropagation();
        imagenProducto.click();
    }
    
    // Función para tomar foto
    function handleTomarFoto(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Acceder directamente a la cámara
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment' // Cámara trasera por defecto
                } 
            })
            .then(function(stream) {
                mostrarCamara(stream);
            })
            .catch(function(error) {
                console.error('Error al acceder a la cámara:', error);
                alert('No se pudo acceder a la cámara. Por favor, selecciona un archivo desde tu equipo.');
                imagenProducto.click();
            });
        } else {
            // Fallback: abrir selector de archivos
            imagenProducto.click();
        }
    }
    
    // Event listeners para seleccionar archivo
    btnSeleccionarArchivo.addEventListener('click', handleSeleccionarArchivo);
    btnSeleccionarArchivo.addEventListener('touchend', handleSeleccionarArchivo, { passive: false });
    btnSeleccionarArchivo.addEventListener('touchstart', function(e) {
        e.preventDefault();
        btnSeleccionarArchivo.style.transform = 'scale(0.95)';
        btnSeleccionarArchivo.style.opacity = '0.8';
    }, { passive: false });
    
    // Restaurar estado visual después del touch
    btnSeleccionarArchivo.addEventListener('touchend', function(e) {
        setTimeout(() => {
            btnSeleccionarArchivo.style.transform = 'scale(1)';
            btnSeleccionarArchivo.style.opacity = '1';
        }, 150);
    }, { passive: true });
    
    // Event listeners para tomar foto
    btnTomarFoto.addEventListener('click', handleTomarFoto);
    btnTomarFoto.addEventListener('touchend', handleTomarFoto, { passive: false });
    btnTomarFoto.addEventListener('touchstart', function(e) {
        e.preventDefault();
        btnTomarFoto.style.transform = 'scale(0.95)';
        btnTomarFoto.style.opacity = '0.8';
    }, { passive: false });
    
    // Restaurar estado visual después del touch
    btnTomarFoto.addEventListener('touchend', function(e) {
        setTimeout(() => {
            btnTomarFoto.style.transform = 'scale(1)';
            btnTomarFoto.style.opacity = '1';
        }, 150);
    }, { passive: true });
    
    // Event listeners adicionales para móvil
    btnSeleccionarArchivo.addEventListener('touchstart', function(e) {
        console.log('Touch start en seleccionar archivo');
    }, { passive: true });
    
    btnTomarFoto.addEventListener('touchstart', function(e) {
        console.log('Touch start en tomar foto');
    }, { passive: true });
    
    // Verificar que los event listeners se agregaron
    console.log('Event listeners agregados a los botones de imagen');
    
    // Manejar selección de imagen
    imagenProducto.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            procesarImagen(file);
        }
    });
    
    // Función para mostrar la cámara
    function mostrarCamara(stream) {
        // Crear modal para la cámara
        const cameraModal = document.createElement('div');
        cameraModal.id = 'cameraModal';
        cameraModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;
        
        cameraModal.innerHTML = `
            <div style="background: white; border-radius: 10px; padding: 20px; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; align-items: center;">
                <h3 style="margin: 0 0 15px 0; color: var(--dark-pink);">Tomar Foto del Producto</h3>
                <video id="cameraVideo" autoplay style="max-width: 100%; max-height: 400px; border-radius: 8px;"></video>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button id="capturePhoto" style="background: var(--dark-pink); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-camera"></i> Capturar
                    </button>
                    <button id="closeCamera" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(cameraModal);
        
        const video = document.getElementById('cameraVideo');
        const captureBtn = document.getElementById('capturePhoto');
        const closeBtn = document.getElementById('closeCamera');
        
        // Mostrar el stream de video
        video.srcObject = stream;
        
        // Capturar foto
        captureBtn.addEventListener('click', function() {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            // Convertir a blob y luego a file
            canvas.toBlob(function(blob) {
                const file = new File([blob], 'foto-producto.jpg', { type: 'image/jpeg' });
                procesarImagen(file);
                
                // Cerrar modal y detener cámara
                document.body.removeChild(cameraModal);
                stream.getTracks().forEach(track => track.stop());
            }, 'image/jpeg', 0.8);
        });
        
        // Cerrar cámara
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(cameraModal);
            stream.getTracks().forEach(track => track.stop());
        });
        
        // Cerrar con ESC
        const handleKeyPress = function(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(cameraModal);
                stream.getTracks().forEach(track => track.stop());
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
    }
    
    // Función para procesar la imagen
    function procesarImagen(file) {
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido.');
            imagenProducto.value = '';
            return;
        }
        
        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB.');
            imagenProducto.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImagen.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
    
    // Manejar eliminación de imagen
    eliminarImagen.addEventListener('click', function(e) {
        e.preventDefault();
        imagenProducto.value = '';
        previewImagen.style.display = 'none';
        previewImg.src = '';
    });
    
    // Manejar cierre del modal de imagen
    closeImagen.addEventListener('click', function(e) {
        e.preventDefault();
        modalImagen.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera
    modalImagen.addEventListener('click', function(e) {
        if (e.target === modalImagen) {
            modalImagen.style.display = 'none';
        }
    });
}

// Función para mostrar imagen en grande
function mostrarImagenGrande(src) {
    imagenGrande.src = src;
    modalImagen.style.display = 'flex';
}

// Función para convertir imagen a base64
function imagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Actualizar contadores de pedidos
function actualizarContadores() {
    let pedidosParaContar = pedidos;
    
    // Si hay un término de búsqueda, filtrar los pedidos antes de contar
    if (terminoBusqueda) {
        pedidosParaContar = pedidos.filter(pedido => 
            buscarEnPedido(pedido, terminoBusqueda)
        );
    }
    
    const total = pedidosParaContar.length;
    const pendientes = pedidosParaContar.filter(p => p.estado === 'pendiente').length;
    const entregados = pedidosParaContar.filter(p => p.estado === 'entregado').length;

    countTodos.textContent = total;
    countPendiente.textContent = pendientes;
    countEntregado.textContent = entregados;
}

// Función para buscar en los campos del pedido
function buscarEnPedido(pedido, termino) {
    if (!termino) return true;
    
    const campos = [
        pedido.clienteNombre,
        pedido.clienteTelefono,
        pedido.destinatarioNombre,
        pedido.destinatarioTelefono,
        pedido.direccion,
        pedido.barrio,
        pedido.referencia,
        pedido.producto,
        pedido.caracteristicas,
        pedido.ocasion,
        pedido.frase,
        pedido.estado,
        pedido.estadoPago,
        pedido.id.toString()
    ];
    
    return campos.some(campo => 
        campo && campo.toString().toLowerCase().includes(termino)
    );
}

// Renderizar pedidos según el filtro y búsqueda
function renderPedidos() {
    pedidosGrid.innerHTML = '';

    let pedidosFiltrados = [];
    
    // Aplicar filtro por estado
    if (filtroActual === 'todos') {
        pedidosFiltrados = pedidos;
    } else {
        pedidosFiltrados = pedidos.filter(pedido => pedido.estado === filtroActual);
    }
    
    // Aplicar búsqueda
    if (terminoBusqueda) {
        pedidosFiltrados = pedidosFiltrados.filter(pedido => 
            buscarEnPedido(pedido, terminoBusqueda)
        );
    }

    // Ordenar por fecha de entrega (más próxima primero)
    pedidosFiltrados.sort((a, b) => {
        const fechaA = new Date(a.fechaEntrega);
        const fechaB = new Date(b.fechaEntrega);
        return fechaA - fechaB; // Orden ascendente (más próxima primero)
    });

    if (pedidosFiltrados.length === 0) {
        let mensaje = '';
        if (terminoBusqueda) {
            mensaje = `No se encontraron pedidos que coincidan con "${terminoBusqueda}"`;
        } else if (filtroActual !== 'todos') {
            mensaje = `No hay pedidos en estado "${getEstadoTexto(filtroActual)}"`;
        } else {
            mensaje = 'No hay pedidos registrados';
        }
        
        pedidosGrid.innerHTML = `
            <div class="no-pedidos" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas ${terminoBusqueda ? 'fa-search' : 'fa-box-open'} fa-3x" style="color: var(--primary-pink); margin-bottom: 15px;"></i>
                <p style="font-size: 1.2rem; color: var(--dark-gray);">${mensaje}</p>
                ${terminoBusqueda ? '<p style="font-size: 1rem; color: var(--text-color); margin-top: 10px;">Intenta con otros términos de búsqueda</p>' : ''}
            </div>
        `;
        return;
    }

    pedidosFiltrados.forEach(pedido => {
        const pedidoCard = document.createElement('div');
        pedidoCard.classList.add('pedido-card');
        
        pedidoCard.innerHTML = `
            <div class="card-header">
                <h3>Pedido #${pedido.id}</h3>
                <span class="status ${pedido.estado}">${getEstadoTexto(pedido.estado)}</span>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <label>Cliente</label>
                    <span>${pedido.clienteNombre} - ${pedido.clienteTelefono}</span>
                </div>
                <div class="card-field">
                    <label>Destinatario</label>
                    <span>${pedido.destinatarioNombre} - ${pedido.destinatarioTelefono}</span>
                </div>
                <div class="card-field">
                    <label>Dirección</label>
                    <span>
                        <a href="${generarURLGoogleMaps(pedido.direccion, pedido.barrio)}" 
                           target="_blank" 
                           class="direccion-link"
                           title="Abrir en Google Maps">
                            <i class="fas fa-map-marker-alt"></i>
                            ${pedido.direccion}, ${pedido.barrio}
                        </a>
                    </span>
                </div>
                <div class="card-field">
                    <label>Producto</label>
                    <span>${pedido.producto} - $${pedido.precio.toLocaleString()}</span>
                </div>
                ${pedido.imagenProducto ? `
                <div class="card-imagen">
                    <img src="${pedido.imagenProducto}" alt="Imagen del producto" onclick="mostrarImagenGrande('${pedido.imagenProducto}')">
                </div>
                ` : ''}
                <div class="card-field">
                    <label>Estado de Pago</label>
                    <span class="pago-status ${pedido.estadoPago}">
                        ${getEstadoPagoTexto(pedido.estadoPago)}
                        ${pedido.estadoPago === 'abono' ? ` ($${pedido.montoAbono.toLocaleString()})` : ''}
                    </span>
                </div>
                <div class="card-field">
                    <label>Entrega</label>
                    <span>${formatFecha(new Date(pedido.fechaEntrega))}</span>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-info btn-detalles" data-id="${pedido.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-secondary btn-editar" data-id="${pedido.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-warning btn-domiciliario" data-id="${pedido.id}" title="Ver información para domiciliario">
                    <i class="fas fa-truck"></i>
                </button>
                <button class="btn btn-primary btn-cambiar-estado" data-id="${pedido.id}">
                    <i class="fas fa-exchange-alt"></i>
                </button>
                <button class="btn btn-danger btn-eliminar" data-id="${pedido.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        pedidosGrid.appendChild(pedidoCard);
    });

    // Agregar event listeners con soporte mejorado para móvil
    document.querySelectorAll('.btn-editar').forEach(button => {
        // Event listener principal
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            console.log('Editando pedido:', id);
            abrirModalEditarPedido(id);
        });
        
        // Event listener táctil para móvil
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            console.log('Touch end - Editando pedido:', id);
            abrirModalEditarPedido(id);
        }, { passive: false });
        
        // Event listener adicional para touchstart (mejor respuesta táctil)
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }, { passive: false });
    });

    document.querySelectorAll('.btn-eliminar').forEach(button => {
        // Event listener principal
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            console.log('Eliminando pedido:', id);
            eliminarPedido(id);
        });
        
        // Event listener táctil para móvil
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            console.log('Touch end - Eliminando pedido:', id);
            eliminarPedido(id);
        }, { passive: false });
        
        // Event listener adicional para touchstart (mejor respuesta táctil)
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }, { passive: false });
    });

    document.querySelectorAll('.btn-detalles').forEach(button => {
        // Event listener principal
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            console.log('Viendo detalles del pedido:', id);
            mostrarDetallesPedido(id);
        });
        
        // Event listener táctil para móvil
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            console.log('Touch end - Viendo detalles del pedido:', id);
            mostrarDetallesPedido(id);
        }, { passive: false });
        
        // Event listener adicional para touchstart (mejor respuesta táctil)
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }, { passive: false });
    });

    document.querySelectorAll('.btn-cambiar-estado').forEach(button => {
        // Event listener principal
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            console.log('Cambiando estado del pedido:', id);
            cambiarEstadoPedido(id);
        });
        
        // Event listener táctil para móvil
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            console.log('Touch end - Cambiando estado del pedido:', id);
            cambiarEstadoPedido(id);
        }, { passive: false });
        
        // Event listener adicional para touchstart (mejor respuesta táctil)
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }, { passive: false });
    });

    document.querySelectorAll('.btn-domiciliario').forEach(button => {
        // Event listener principal
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            console.log('Mostrando información para domiciliario:', id);
            mostrarInfoDomiciliario(id);
        });
        
        // Event listener táctil para móvil
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(button.dataset.id);
            console.log('Touch end - Mostrando información para domiciliario:', id);
            mostrarInfoDomiciliario(id);
        }, { passive: false });
        
        // Event listener adicional para touchstart (mejor respuesta táctil)
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }, { passive: false });
    });
}

// Obtener texto del estado
function getEstadoTexto(estado) {
    switch(estado) {
        case 'pendiente': return 'Pendiente';
        case 'entregado': return 'Entregado';
        default: return estado;
    }
}

// Obtener texto del estado de pago
function getEstadoPagoTexto(estadoPago) {
    switch(estadoPago) {
        case 'pendiente': return 'Pendiente por pago';
        case 'abono': return 'Con abono';
        case 'pagado': return 'Pagado';
        default: return estadoPago;
    }
}

// Generar URL de Google Maps para una dirección
function generarURLGoogleMaps(direccion, barrio) {
    const direccionCompleta = `${direccion}, ${barrio}, Medellín, Colombia`;
    const direccionCodificada = encodeURIComponent(direccionCompleta);
    return `https://www.google.com/maps/search/?api=1&query=${direccionCodificada}`;
}

// Formatear fecha
function formatFecha(fecha) {
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Formatear solo la hora en formato 12 horas
function formatHora(fecha) {
    return fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Mostrar notificación personalizada
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear el contenedor de notificaciones si no existe
    let notificacionesContainer = document.getElementById('notificacionesContainer');
    if (!notificacionesContainer) {
        notificacionesContainer = document.createElement('div');
        notificacionesContainer.id = 'notificacionesContainer';
        notificacionesContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notificacionesContainer);
    }
    
    // Crear la notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.style.cssText = `
        background-color: ${tipo === 'success' ? '#27ae60' : tipo === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
        font-size: 14px;
    `;
    
    // Agregar icono según el tipo
    const icono = document.createElement('i');
    icono.className = tipo === 'success' ? 'fas fa-check-circle' : 
                     tipo === 'error' ? 'fas fa-exclamation-circle' : 
                     'fas fa-info-circle';
    icono.style.fontSize = '18px';
    
    // Agregar mensaje
    const mensajeElement = document.createElement('span');
    mensajeElement.textContent = mensaje;
    mensajeElement.style.flex = '1';
    
    // Agregar botón de cerrar
    const cerrarBtn = document.createElement('button');
    cerrarBtn.innerHTML = '×';
    cerrarBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    `;
    
    cerrarBtn.addEventListener('click', () => {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    });
    
    // Agregar elementos a la notificación
    notificacion.appendChild(icono);
    notificacion.appendChild(mensajeElement);
    notificacion.appendChild(cerrarBtn);
    
    // Agregar a la página
    notificacionesContainer.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }
    }, 3000);
}

// Abrir modal para nuevo pedido
function abrirModalNuevoPedido() {
    modalTitulo.textContent = 'Nuevo Pedido';
    pedidoForm.reset();
    document.getElementById('pedidoId').value = '';
    
    // Establecer fecha y hora actual como valor por defecto
    const ahora = new Date();
    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, '0');
    const day = String(ahora.getDate()).padStart(2, '0');
    const hours = String(ahora.getHours()).padStart(2, '0');
    const minutes = String(ahora.getMinutes()).padStart(2, '0');
    
    const fechaActual = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('fechaEntrega').value = fechaActual;
    
    document.getElementById('estadoPago').value = 'pendiente';
    document.getElementById('montoAbono').value = '0';
    abonoGroup.style.display = 'none';
    montoAbonoInput.required = false;
    
    // Limpiar imagen
    imagenProducto.value = '';
    previewImagen.style.display = 'none';
    previewImg.src = '';
    
    pedidoModal.style.display = 'flex';
    
    // Hacer scroll al top del modal
    setTimeout(() => {
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }, 10);
}

// Abrir modal para editar pedido
function abrirModalEditarPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;

    modalTitulo.textContent = `Editar Pedido #${pedido.id}`;
    document.getElementById('pedidoId').value = pedido.id;
    document.getElementById('clienteNombre').value = pedido.clienteNombre;
    document.getElementById('clienteTelefono').value = pedido.clienteTelefono;
    document.getElementById('destinatarioNombre').value = pedido.destinatarioNombre;
    document.getElementById('destinatarioTelefono').value = pedido.destinatarioTelefono;
    document.getElementById('direccion').value = pedido.direccion;
    document.getElementById('barrio').value = pedido.barrio;
    document.getElementById('referencia').value = pedido.referencia;
    document.getElementById('producto').value = pedido.producto;
    document.getElementById('caracteristicas').value = pedido.caracteristicas;
    document.getElementById('precio').value = pedido.precio;
    document.getElementById('estadoPago').value = pedido.estadoPago || 'pendiente';
    document.getElementById('montoAbono').value = pedido.montoAbono || 0;
    document.getElementById('ocasion').value = pedido.ocasion;
    document.getElementById('frase').value = pedido.frase;
    document.getElementById('estado').value = pedido.estado;
    
    // Mostrar/ocultar campo de abono según estado de pago
    if (pedido.estadoPago === 'abono') {
        abonoGroup.style.display = 'block';
        montoAbonoInput.required = true;
    } else {
        abonoGroup.style.display = 'none';
        montoAbonoInput.required = false;
    }
    
    // Formatear la fecha para el input datetime-local (mantener zona horaria local)
    const fecha = new Date(pedido.fechaEntrega);
    // Crear la fecha en formato local para el input datetime-local
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    
    const fechaFormateada = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('fechaEntrega').value = fechaFormateada;
    
    // Manejar imagen existente
    if (pedido.imagenProducto) {
        previewImg.src = pedido.imagenProducto;
        previewImagen.style.display = 'block';
    } else {
        previewImagen.style.display = 'none';
        previewImg.src = '';
    }
    
    // Limpiar el input de archivo
    imagenProducto.value = '';
    
    pedidoModal.style.display = 'flex';
    
    // Hacer scroll al top del modal
    setTimeout(() => {
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }, 10);
}

// Guardar pedido (nuevo o editado)
async function guardarPedido(e) {
    console.log('Función guardarPedido llamada');
    e.preventDefault();
    
    const id = document.getElementById('pedidoId').value;
    const esEdicion = id !== '';
    
    // Manejar imagen
    let imagenBase64 = '';
    const fileInput = document.getElementById('imagenProducto');
    if (fileInput.files[0]) {
        try {
            imagenBase64 = await imagenABase64(fileInput.files[0]);
        } catch (error) {
            console.error('Error al procesar imagen:', error);
            mostrarNotificacion('Error al procesar la imagen', 'error');
            return;
        }
    } else if (esEdicion) {
        // Si es edición y no hay nueva imagen, mantener la imagen existente
        const pedidoExistente = pedidos.find(p => p.id === parseInt(id));
        imagenBase64 = pedidoExistente?.imagenProducto || '';
    }
    
    const pedido = {
        clienteNombre: document.getElementById('clienteNombre').value,
        clienteTelefono: document.getElementById('clienteTelefono').value,
        destinatarioNombre: document.getElementById('destinatarioNombre').value,
        destinatarioTelefono: document.getElementById('destinatarioTelefono').value,
        direccion: document.getElementById('direccion').value,
        barrio: document.getElementById('barrio').value,
        referencia: document.getElementById('referencia').value,
        producto: document.getElementById('producto').value,
        caracteristicas: document.getElementById('caracteristicas').value,
        imagenProducto: imagenBase64,
        precio: parseFloat(document.getElementById('precio').value),
        estadoPago: document.getElementById('estadoPago').value,
        montoAbono: parseFloat(document.getElementById('montoAbono').value) || 0,
        ocasion: document.getElementById('ocasion').value,
        frase: document.getElementById('frase').value,
        estado: document.getElementById('estado').value,
        fechaEntrega: document.getElementById('fechaEntrega').value,
    };
    
    if (esEdicion) {
        // Editar pedido existente
        pedido.id = parseInt(id);
        pedido.fechaCreacion = pedidos.find(p => p.id === pedido.id).fechaCreacion;
        
        const index = pedidos.findIndex(p => p.id === pedido.id);
        if (index !== -1) {
            pedidos[index] = pedido;
        }
    } else {
        // Nuevo pedido
        pedido.id = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1;
        pedido.fechaCreacion = new Date().toISOString();
        pedidos.push(pedido);
    }
    
    // Guardar en localStorage
    console.log('Guardando pedidos en localStorage:', pedidos.length, 'pedidos');
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    console.log('Pedidos guardados exitosamente en localStorage');
    
    // Actualizar interfaz
    actualizarContadores();
    renderPedidos();
    verificarAlertas();
    
    // Cerrar modal
    pedidoModal.style.display = 'none';
    
    // Mostrar mensaje de éxito
    mostrarNotificacion(`Pedido ${esEdicion ? 'actualizado' : 'creado'} correctamente.`, 'success');
}

// Las funciones están disponibles localmente, no necesitamos hacerlas globales

// Cambiar estado del pedido
function cambiarEstadoPedido(id) {
    console.log('Cambiando estado del pedido:', id);
    
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) {
        console.log('Pedido no encontrado:', id);
        return;
    }
    
    console.log('Estado actual:', pedido.estado); // Debug
    
    // Encontrar el botón que fue presionado para dar feedback visual
    const button = document.querySelector(`.btn-cambiar-estado[data-id="${id}"]`);
    if (button) {
        // Agregar clase de feedback visual
        button.classList.add('btn-pressed');
        setTimeout(() => {
            button.classList.remove('btn-pressed');
        }, 200);
    }
    
    let nuevoEstado;
    switch(pedido.estado) {
        case 'pendiente':
            nuevoEstado = 'entregado';
            break;
        case 'entregado':
            nuevoEstado = 'pendiente';
            break;
        default:
            nuevoEstado = 'pendiente';
    }
    
    console.log('Nuevo estado:', nuevoEstado); // Debug
    
    // Cambiar estado directamente sin confirmación
    pedido.estado = nuevoEstado;
    
    // Guardar en localStorage
    console.log('Guardando cambio de estado en localStorage');
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    console.log('Estado guardado exitosamente en localStorage');
    
    // Actualizar interfaz
    actualizarContadores();
    renderPedidos();
    verificarAlertas();
    
    // Mostrar mensaje de confirmación
    const estadoTexto = nuevoEstado === 'entregado' ? 'Entregado' : 'Pendiente';
    console.log(`Pedido #${id} marcado como: ${estadoTexto}`);
}

// Eliminar pedido - mostrar modal de confirmación
function eliminarPedido(id) {
    console.log('Función eliminarPedido llamada con ID:', id);
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) {
        console.log('Pedido no encontrado para eliminar:', id);
        return;
    }
    
    // Guardar el ID del pedido a eliminar
    pedidoAEliminar = id;
    
    // Mostrar el modal
    confirmarEliminarModal.style.display = 'flex';
}

// Eliminar pedido confirmado
function eliminarPedidoConfirmado(id) {
    // Eliminar el pedido del array
    pedidos = pedidos.filter(p => p.id !== id);
    
    // Guardar en localStorage
    console.log('Guardando eliminación en localStorage');
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    console.log('Eliminación guardada exitosamente en localStorage');
    
    // Actualizar interfaz
    actualizarContadores();
    renderPedidos();
    verificarAlertas();
    
    // Cerrar modal
    confirmarEliminarModal.style.display = 'none';
    pedidoAEliminar = null;
    
    // Mostrar mensaje de éxito
    mostrarNotificacion(`Pedido #${id} eliminado correctamente.`, 'success');
}

// Mostrar detalles del pedido
function mostrarDetallesPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;

    detallesTitulo.textContent = `Detalles del Pedido #${pedido.id}`;
    
    const fechaCreacion = new Date(pedido.fechaCreacion);
    const fechaEntrega = new Date(pedido.fechaEntrega);
    
    detallesContenido.innerHTML = `
        <div class="detalles-section">
            <h3><i class="fas fa-user"></i> Información del Cliente</h3>
            <div class="detalles-grid">
                <div class="detalle-item">
                    <label>Nombre:</label>
                    <span>${pedido.clienteNombre}</span>
                </div>
                <div class="detalle-item">
                    <label>Teléfono:</label>
                    <span>${pedido.clienteTelefono}</span>
                </div>
            </div>
        </div>

        <div class="detalles-section">
            <h3><i class="fas fa-gift"></i> Información del Destinatario</h3>
            <div class="detalles-grid">
                <div class="detalle-item">
                    <label>Nombre:</label>
                    <span>${pedido.destinatarioNombre}</span>
                </div>
                <div class="detalle-item">
                    <label>Teléfono:</label>
                    <span>${pedido.destinatarioTelefono}</span>
                </div>
            </div>
        </div>

        <div class="detalles-section">
            <h3><i class="fas fa-map-marker-alt"></i> Dirección de Entrega</h3>
            <div class="detalles-grid">
                <div class="detalle-item">
                    <label>Dirección:</label>
                    <span>
                        <a href="${generarURLGoogleMaps(pedido.direccion, pedido.barrio)}" 
                           target="_blank" 
                           class="direccion-link"
                           title="Abrir en Google Maps">
                            <i class="fas fa-map-marker-alt"></i>
                            ${pedido.direccion}
                        </a>
                    </span>
                </div>
                <div class="detalle-item">
                    <label>Barrio/Ciudad:</label>
                    <span>${pedido.barrio}</span>
                </div>
                <div class="detalle-item">
                    <label>Referencia:</label>
                    <span>${pedido.referencia || 'No especificada'}</span>
                </div>
                <div class="detalle-item">
                    <label>Ver en Maps:</label>
                    <span>
                        <a href="${generarURLGoogleMaps(pedido.direccion, pedido.barrio)}" 
                           target="_blank" 
                           class="btn-maps"
                           title="Abrir ubicación en Google Maps">
                            <i class="fas fa-external-link-alt"></i>
                            Abrir en Google Maps
                        </a>
                    </span>
                </div>
            </div>
        </div>

        <div class="detalles-section">
            <h3><i class="fas fa-box"></i> Información del Producto</h3>
            <div class="detalles-grid">
                <div class="detalle-item">
                    <label>Producto:</label>
                    <span>${pedido.producto}</span>
                </div>
                <div class="detalle-item">
                    <label>Precio Total:</label>
                    <span>$${pedido.precio.toLocaleString()}</span>
                </div>
                <div class="detalle-item">
                    <label>Características:</label>
                    <span>${pedido.caracteristicas || 'No especificadas'}</span>
                </div>
                <div class="detalle-item">
                    <label>Ocasión:</label>
                    <span>${pedido.ocasion || 'No especificada'}</span>
                </div>
            </div>
            ${pedido.imagenProducto ? `
            <div class="imagen-producto">
                <img src="${pedido.imagenProducto}" alt="Imagen del producto" onclick="mostrarImagenGrande('${pedido.imagenProducto}')">
            </div>
            ` : ''}
        </div>

        <div class="detalles-section">
            <h3><i class="fas fa-credit-card"></i> Información de Pago</h3>
            <div class="detalles-grid">
                <div class="detalle-item">
                    <label>Estado del Pago:</label>
                    <span class="pago-status ${pedido.estadoPago || 'pendiente'}">${getEstadoPagoTexto(pedido.estadoPago || 'pendiente')}</span>
                </div>
                <div class="detalle-item">
                    <label>Monto Abonado:</label>
                    <span>$${(pedido.montoAbono || 0).toLocaleString()}</span>
                </div>
                <div class="detalle-item">
                    <label>Saldo Pendiente:</label>
                    <span class="saldo-pendiente">$${(pedido.precio - (pedido.montoAbono || 0)).toLocaleString()}</span>
                </div>
                <div class="detalle-item">
                    <label>Porcentaje Pagado:</label>
                    <span class="porcentaje-pago">${Math.round(((pedido.montoAbono || 0) / pedido.precio) * 100)}%</span>
                </div>
            </div>
        </div>

        <div class="detalles-section">
            <h3><i class="fas fa-card"></i> Mensaje de la Tarjeta</h3>
            <div class="detalle-item">
                <label>Frase:</label>
                <span class="frase-texto">${pedido.frase || 'No especificada'}</span>
            </div>
        </div>

        <div class="detalles-section">
            <h3><i class="fas fa-info-circle"></i> Estado y Fechas</h3>
            <div class="detalles-grid">
                <div class="detalle-item">
                    <label>Estado:</label>
                    <span class="status ${pedido.estado}">${getEstadoTexto(pedido.estado)}</span>
                </div>
                <div class="detalle-item">
                    <label>Fecha de Creación:</label>
                    <span>${formatFecha(fechaCreacion)}</span>
                </div>
                <div class="detalle-item">
                    <label>Fecha de Entrega:</label>
                    <span>${formatFecha(fechaEntrega)}</span>
                </div>
            </div>
        </div>
    `;
    
    detallesModal.style.display = 'flex';
    
    // Hacer scroll al top del modal
    setTimeout(() => {
        const modalContent = document.querySelector('#detallesModal .modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }, 10);
}

// Mostrar información para domiciliario
function mostrarInfoDomiciliario(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;

    domiciliarioTitulo.textContent = `Información para Domiciliario - Pedido #${pedido.id}`;
    
    const fechaEntrega = new Date(pedido.fechaEntrega);
    
    domiciliarioContenido.innerHTML = `
        <div class="domiciliario-card">
            <!-- Columna izquierda: Destinatario y Dirección -->
            <div class="domiciliario-section">
                <h3>DESTINATARIO</h3>
                <div class="domiciliario-info">
                    <div class="info-item">
                        <label>Nombre:</label>
                        <span>${pedido.destinatarioNombre}</span>
                    </div>
                    <div class="info-item">
                        <label>Teléfono:</label>
                        <span>${pedido.destinatarioTelefono}</span>
                    </div>
                </div>
            </div>

            <div class="domiciliario-section">
                <h3>DIRECCIÓN</h3>
                <div class="domiciliario-info">
                    <div class="info-item">
                        <label>Dirección:</label>
                        <span>${pedido.direccion}</span>
                    </div>
                    <div class="info-item">
                        <label>Barrio:</label>
                        <span>${pedido.barrio}</span>
                    </div>
                    <div class="info-item">
                        <label>Referencia:</label>
                        <span>${pedido.referencia || 'No especificada'}</span>
                    </div>
                    <div class="info-item">
                        <label>Maps:</label>
                        <a href="${generarURLGoogleMaps(pedido.direccion, pedido.barrio)}" 
                           target="_blank">
                            Abrir en Google Maps
                        </a>
                    </div>
                </div>
            </div>

            <!-- Columna derecha: Producto y Entrega -->
            <div class="domiciliario-section">
                <h3>PRODUCTO</h3>
                <div class="domiciliario-info">
                    <div class="info-item">
                        <label>Producto:</label>
                        <span>${pedido.producto}</span>
                    </div>
                    <div class="info-item">
                        <label>Características:</label>
                        <span>${pedido.caracteristicas || 'No especificadas'}</span>
                    </div>
                    <div class="info-item">
                        <label>Ocasión:</label>
                        <span>${pedido.ocasion || 'No especificada'}</span>
                    </div>
                </div>
            </div>

            <div class="domiciliario-section">
                <h3>ENTREGA</h3>
                <div class="domiciliario-info">
                    <div class="info-item">
                        <label>Fecha:</label>
                        <span>${fechaEntrega.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}</span>
                    </div>
                    <div class="info-item">
                        <label>Hora:</label>
                        <span>${formatHora(fechaEntrega)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    domiciliarioModal.style.display = 'flex';
    
    // Hacer scroll al top del modal
    setTimeout(() => {
        const modalContent = document.querySelector('#domiciliarioModal .modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }, 10);
}

// Configurar botones del modal de domiciliario
function configurarBotonesDomiciliario() {
    
    // Botón copiar
    copiarInfo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        copiarInfoDomiciliario();
    });
    
    copiarInfo.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        copiarInfoDomiciliario();
    }, { passive: false });
}


// Copiar información de domiciliario
function copiarInfoDomiciliario() {
    // Crear el contenido formateado como se ve en el modal
    const pedido = pedidos.find(p => p.id === parseInt(domiciliarioTitulo.textContent.match(/#(\d+)/)[1]));
    if (!pedido) return;
    
    const fechaEntrega = new Date(pedido.fechaEntrega);
    const mapsURL = generarURLGoogleMaps(pedido.direccion, pedido.barrio);
    
    // Formato optimizado para WhatsApp - incluye la URL directamente
    const contenidoFormateado = `
*INFORMACIÓN PARA DOMICILIARIO - PEDIDO #${pedido.id}*

*DESTINATARIO*
Nombre: ${pedido.destinatarioNombre}
Teléfono: ${pedido.destinatarioTelefono}

*DIRECCIÓN*
Dirección: ${pedido.direccion}
Barrio: ${pedido.barrio}
Referencia: ${pedido.referencia || 'No especificada'}
Maps: ${mapsURL}

*PRODUCTO*
Producto: ${pedido.producto}
Características: ${pedido.caracteristicas || 'No especificadas'}
Ocasión: ${pedido.ocasion || 'No especificada'}

*ENTREGA*
Fecha: ${fechaEntrega.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })}
Hora: ${formatHora(fechaEntrega)}
    `.trim();
    
    // Crear contenido HTML con enlace funcional para otras aplicaciones
    const contenidoHTML = `
*INFORMACIÓN PARA DOMICILIARIO - PEDIDO #${pedido.id}*

*DESTINATARIO*
Nombre: ${pedido.destinatarioNombre}
Teléfono: ${pedido.destinatarioTelefono}

*DIRECCIÓN*
Dirección: ${pedido.direccion}
Barrio: ${pedido.barrio}
Referencia: ${pedido.referencia || 'No especificada'}
Maps: <a href="${mapsURL}">Abrir en Google Maps</a>

*PRODUCTO*
Producto: ${pedido.producto}
Características: ${pedido.caracteristicas || 'No especificadas'}
Ocasión: ${pedido.ocasion || 'No especificada'}

*ENTREGA*
Fecha: ${fechaEntrega.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })}
Hora: ${formatHora(fechaEntrega)}
    `.trim();
    
    // Intentar copiar como HTML primero
    if (navigator.clipboard.write) {
        const clipboardItem = new ClipboardItem({
            'text/plain': new Blob([contenidoFormateado], { type: 'text/plain' }),
            'text/html': new Blob([contenidoHTML], { type: 'text/html' })
        });
        
        navigator.clipboard.write([clipboardItem]).then(() => {
            mostrarNotificacion('Información copiada al portapapeles', 'success');
        }).catch(() => {
            // Fallback a texto plano
            navigator.clipboard.writeText(contenidoFormateado).then(() => {
                mostrarNotificacion('Información copiada al portapapeles', 'success');
            }).catch(() => {
                // Fallback final
                const textArea = document.createElement('textarea');
                textArea.value = contenidoFormateado;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                mostrarNotificacion('Información copiada al portapapeles', 'success');
            });
        });
    } else {
        // Fallback para navegadores que no soportan ClipboardItem
        navigator.clipboard.writeText(contenidoFormateado).then(() => {
            mostrarNotificacion('Información copiada al portapapeles', 'success');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = contenidoFormateado;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            mostrarNotificacion('Información copiada al portapapeles', 'success');
        });
    }
}

// Verificar alertas de entrega próxima
function verificarAlertas() {
    alertasLista.innerHTML = '';
    
    const ahora = new Date();
    const alertas = [];
    
    pedidos.forEach(pedido => {
        if (pedido.estado !== 'entregado') {
            const fechaEntrega = new Date(pedido.fechaEntrega);
            const diffHoras = (fechaEntrega - ahora) / (1000 * 60 * 60);
            
            if (diffHoras < 0) {
                // Pedido atrasado - ROJO
                alertas.push({
                    tipo: 'crítica',
                    mensaje: `¡Pedido #${pedido.id} está atrasado! Debería haberse entregado el ${formatFecha(fechaEntrega)}`,
                    pedidoId: pedido.id
                });
            } else if (diffHoras < 6) {
                // Entrega en menos de 6 horas - ROJO
                alertas.push({
                    tipo: 'crítica',
                    mensaje: `¡Pedido #${pedido.id} debe entregarse en ${Math.round(diffHoras)} horas! (${formatHora(fechaEntrega)})`,
                    pedidoId: pedido.id
                });
            } else if (diffHoras < 72) {
                // Entrega en 6-72 horas - AMARILLO
                if (diffHoras < 24) {
                    alertas.push({
                        tipo: 'advertencia',
                        mensaje: `Pedido #${pedido.id} debe entregarse hoy a las ${formatHora(fechaEntrega)}`,
                        pedidoId: pedido.id
                    });
                } else {
                    alertas.push({
                        tipo: 'advertencia',
                        mensaje: `Pedido #${pedido.id} debe entregarse en ${Math.round(diffHoras / 24)} días (${formatHora(fechaEntrega)})`,
                        pedidoId: pedido.id
                    });
                }
            }
            // No mostrar alertas para pedidos con más de 72 horas
        }
    });
    
    if (alertas.length === 0) {
        alertasLista.innerHTML = `
            <div class="alerta-item info">
                <i class="fas fa-check-circle"></i> No hay alertas en este momento. Todos los pedidos están bajo control.
            </div>
        `;
        return;
    }
    
    // Determinar el color del contenedor según la urgencia
    const tieneCriticas = alertas.some(a => a.tipo === 'crítica');
    
    let containerClass = 'alertas-container';
    if (tieneCriticas) {
        containerClass += ' alertas-criticas';
    } else {
        containerClass += ' alertas-advertencia';
    }
    
    // Aplicar clase al contenedor
    const container = document.querySelector('.alertas-container');
    container.className = containerClass;
    
    alertas.forEach(alerta => {
        const alertaElement = document.createElement('div');
        alertaElement.classList.add('alerta-item', alerta.tipo, 'clickeable');
        
        // Icono según el tipo de alerta
        let icono = 'fa-exclamation-circle';
        if (alerta.tipo === 'crítica') {
            icono = 'fa-exclamation-triangle';
        } else if (alerta.tipo === 'advertencia') {
            icono = 'fa-exclamation-circle';
        }
        
        alertaElement.innerHTML = `
            <i class="fas ${icono}"></i>
            ${alerta.mensaje}
        `;
        
        // Agregar event listener para abrir detalles del pedido
        alertaElement.addEventListener('click', () => {
            mostrarDetallesPedido(alerta.pedidoId);
        });
        
        alertasLista.appendChild(alertaElement);
    });
}

// Función para manejar el scroll to top
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Función para verificar si hay un modal abierto
    function isModalOpen() {
        const modals = document.querySelectorAll('.modal');
        for (let modal of modals) {
            if (modal.style.display === 'flex' || modal.style.display === 'block') {
                return modal;
            }
        }
        return null;
    }
    
    // Función para mostrar/ocultar el botón
    function updateButtonVisibility() {
        const openModal = isModalOpen();
        
        if (openModal) {
            // Si hay un modal abierto, verificar scroll del modal
            const modalContent = openModal.querySelector('.modal-content');
            if (modalContent && modalContent.scrollTop > 100) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        } else {
            // Si no hay modal, verificar scroll de la página
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    }
    
    // Event listener para scroll de la ventana
    window.addEventListener('scroll', updateButtonVisibility);
    
    // Event listeners para scroll de modales
    document.querySelectorAll('.modal .modal-content').forEach(modalContent => {
        modalContent.addEventListener('scroll', updateButtonVisibility);
    });
    
    // Manejar el clic del botón - Mejorar compatibilidad móvil
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const openModal = isModalOpen();
        
        if (openModal) {
            // Si hay un modal abierto, hacer scroll del modal
            const modalContent = openModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        } else {
            // Si no hay modal, hacer scroll de la página
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
    
    // Event listener táctil para móvil
    scrollToTopBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const openModal = isModalOpen();
        
        if (openModal) {
            // Si hay un modal abierto, hacer scroll del modal
            const modalContent = openModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        } else {
            // Si no hay modal, hacer scroll de la página
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, { passive: false });
}

// Función para detectar Chrome móvil
function isChromeMobile() {
    const userAgent = navigator.userAgent;
    return /Chrome/.test(userAgent) && /Mobile/.test(userAgent) && !/Edge/.test(userAgent);
}

// Función para detectar dispositivos táctiles
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Función para mejorar la compatibilidad con Chrome móvil
function setupChromeMobileCompatibility() {
    const isChrome = isChromeMobile();
    const isTouch = isTouchDevice();
    
    if (isChrome) {
        console.log('Chrome móvil detectado, aplicando mejoras de compatibilidad');
        document.body.classList.add('chrome-mobile');
    }
    
    if (isTouch) {
        console.log('Dispositivo táctil detectado, aplicando mejoras de compatibilidad');
        document.body.classList.add('touch-device');
    }
    
    // Mejorar el manejo de eventos táctiles para todos los dispositivos móviles
    if (isTouch) {
        // Prevenir zoom en doble toque
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Mejorar el manejo de botones
        document.addEventListener('touchstart', function(e) {
            const button = e.target.closest('button, .btn, .filter-btn');
            if (button) {
                e.preventDefault();
                button.style.transform = 'scale(0.95)';
                button.style.opacity = '0.8';
            }
        }, { passive: false });
        
        document.addEventListener('touchend', function(e) {
            const button = e.target.closest('button, .btn, .filter-btn');
            if (button) {
                button.style.transform = 'scale(1)';
                button.style.opacity = '1';
            }
        }, { passive: false });
        
        // Mejorar el manejo de formularios en móvil
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                // Enfocar el input cuando se toca
                setTimeout(() => {
                    e.target.focus();
                }, 100);
            }
        }, { passive: true });
        
        // Prevenir zoom en doble toque en toda la aplicación
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    // Mejoras específicas para Chrome móvil
    if (isChrome) {
        // Mejorar el manejo de eventos de formulario
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                return; // Permitir que los inputs funcionen normalmente
            }
            
            // Para otros elementos, prevenir comportamientos por defecto problemáticos
            if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando aplicación');
    console.log('Dispositivo táctil detectado:', 'ontouchstart' in window);
    console.log('User agent:', navigator.userAgent);
    console.log('Chrome móvil detectado:', isChromeMobile());
    
    setupChromeMobileCompatibility();
    init();
    initScrollToTop();
    configurarBotonesDomiciliario();
    
    console.log('Aplicación inicializada correctamente');
});