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
    // Filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.id === 'btnNuevoPedido') {
                abrirModalNuevoPedido();
                return;
            }
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filtroActual = button.dataset.filter;
            renderPedidos();
        });
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        pedidoModal.style.display = 'none';
    });

    // Cerrar modal de detalles
    closeDetalles.addEventListener('click', () => {
        detallesModal.style.display = 'none';
    });

    // Guardar pedido
    pedidoForm.addEventListener('submit', guardarPedido);

    // Búsqueda
    searchInput.addEventListener('input', (e) => {
        terminoBusqueda = e.target.value.toLowerCase().trim();
        clearSearch.style.display = terminoBusqueda ? 'block' : 'none';
        renderPedidos();
    });

    // Limpiar búsqueda
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        terminoBusqueda = '';
        clearSearch.style.display = 'none';
        renderPedidos();
    });

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

    // Event listeners para el modal de confirmación de eliminación
    cancelarEliminar.addEventListener('click', () => {
        confirmarEliminarModal.style.display = 'none';
        pedidoAEliminar = null;
    });

    confirmarEliminar.addEventListener('click', () => {
        if (pedidoAEliminar) {
            eliminarPedidoConfirmado(pedidoAEliminar);
        }
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
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
    });
}

// Actualizar contadores de pedidos
function actualizarContadores() {
    const total = pedidos.length;
    const pendientes = pedidos.filter(p => p.estado === 'pendiente').length;
    const entregados = pedidos.filter(p => p.estado === 'entregado').length;

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

    // Agregar event listeners a los botones de editar
    document.querySelectorAll('.btn-editar').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            abrirModalEditarPedido(id);
        });
    });

    // Agregar event listeners a los botones de cambiar estado
    document.querySelectorAll('.btn-cambiar-estado').forEach(button => {
        console.log('Agregando event listeners al botón:', button.dataset.id); // Debug
        
        // Función para manejar el cambio de estado
        const handleStateChange = (e) => {
            console.log('Evento detectado:', e.type, 'en botón:', button.dataset.id); // Debug
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const id = parseInt(button.dataset.id);
            if (id && !isNaN(id)) {
                cambiarEstadoPedido(id);
            }
        };
        
        // Agregar múltiples eventos para mejor compatibilidad móvil
        button.addEventListener('click', handleStateChange, { passive: false });
        button.addEventListener('touchend', handleStateChange, { passive: false });
        
        // Agregar feedback visual inmediato
        button.addEventListener('touchstart', (e) => {
            console.log('Touch start en botón:', button.dataset.id); // Debug
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
        });
        
        button.addEventListener('touchend', () => {
            setTimeout(() => {
                button.style.transform = '';
                button.style.opacity = '';
            }, 150);
        });
    });

    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            eliminarPedido(id);
        });
    });

    // Agregar event listeners a los botones de ver detalles
    document.querySelectorAll('.btn-detalles').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            mostrarDetallesPedido(id);
        });
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

// Abrir modal para nuevo pedido
function abrirModalNuevoPedido() {
    modalTitulo.textContent = 'Nuevo Pedido';
    pedidoForm.reset();
    document.getElementById('pedidoId').value = '';
    document.getElementById('fechaEntrega').value = '';
    document.getElementById('estadoPago').value = 'pendiente';
    document.getElementById('montoAbono').value = '0';
    abonoGroup.style.display = 'none';
    montoAbonoInput.required = false;
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
    
    // Formatear la fecha para el input datetime-local
    const fecha = new Date(pedido.fechaEntrega);
    const fechaFormateada = fecha.toISOString().slice(0, 16);
    document.getElementById('fechaEntrega').value = fechaFormateada;
    
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
function guardarPedido(e) {
    e.preventDefault();
    
    const id = document.getElementById('pedidoId').value;
    const esEdicion = id !== '';
    
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
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    // Actualizar interfaz
    actualizarContadores();
    renderPedidos();
    verificarAlertas();
    
    // Cerrar modal
    pedidoModal.style.display = 'none';
    
    // Mostrar mensaje de éxito
    alert(`Pedido ${esEdicion ? 'actualizado' : 'creado'} correctamente.`);
}

// Cambiar estado del pedido
function cambiarEstadoPedido(id) {
    console.log('Cambiando estado del pedido:', id); // Debug
    
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
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
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
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    
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
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    // Actualizar interfaz
    actualizarContadores();
    renderPedidos();
    verificarAlertas();
    
    // Cerrar modal
    confirmarEliminarModal.style.display = 'none';
    pedidoAEliminar = null;
    
    // Mostrar mensaje de éxito
    alert(`Pedido #${id} eliminado correctamente.`);
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
                // Pedido atrasado
                alertas.push({
                    tipo: 'crítica',
                    mensaje: `¡Pedido #${pedido.id} está atrasado! Debería haberse entregado el ${formatFecha(fechaEntrega)}`,
                    pedidoId: pedido.id
                });
            } else if (diffHoras < 24) {
                // Entrega en menos de 24 horas
                alertas.push({
                    tipo: 'advertencia',
                    mensaje: `Pedido #${pedido.id} debe entregarse hoy a las ${formatFecha(fechaEntrega).split(' ')[1]}`,
                    pedidoId: pedido.id
                });
            } else if (diffHoras < 48) {
                // Entrega en menos de 48 horas
                alertas.push({
                    tipo: 'advertencia',
                    mensaje: `Pedido #${pedido.id} debe entregarse mañana a las ${formatFecha(fechaEntrega).split(' ')[1]}`,
                    pedidoId: pedido.id
                });
            }
        }
    });
    
    if (alertas.length === 0) {
        alertasLista.innerHTML = `
            <div class="alerta-item">
                <i class="fas fa-check-circle"></i> No hay alertas en este momento. Todos los pedidos están bajo control.
            </div>
        `;
        return;
    }
    
    alertas.forEach(alerta => {
        const alertaElement = document.createElement('div');
        alertaElement.classList.add('alerta-item', alerta.tipo, 'clickeable');
        alertaElement.innerHTML = `
            <i class="fas ${alerta.tipo === 'crítica' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
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
    
    // Manejar el clic del botón
    scrollToTopBtn.addEventListener('click', () => {
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
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    init();
    initScrollToTop();
});