const API_URL = 'http://localhost:3000/api';

const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '../index.html';
}

const toggleBtn = document.getElementById('toggleFormBtn');
const formContainer = document.getElementById('formContainer');

toggleBtn.addEventListener('click', () => {
    formContainer.style.display =
        formContainer.style.display === 'block' ? 'none' : 'block';
});

async function cargarUsuarios() {

    try {

        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        const users = data.data || data.users || data;

        const table = document.getElementById('usersTable');
        table.innerHTML = '';

        users.forEach(user => {

            let roleClass = 'user';

            if (user.role === 'admin') roleClass = 'admin';
            else if (user.role === 'coach') roleClass = 'coach';

            table.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.full_name}</td>
                    <td>${user.email}</td>
                    <td>
                        <span class="badge ${roleClass}">
                            ${user.role}
                        </span>
                    </td>
                    <td>
                        <button onclick="editarUsuario(${user.id}, '${user.full_name}', '${user.role}')">
                            Editar
                        </button>

                        <button onclick="eliminarUsuario(${user.id})">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

document.getElementById('createUserForm')
.addEventListener('submit', async (e) => {

    e.preventDefault();

    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;

    const message = document.getElementById('message');

    try {

        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                full_name,
                email,
                role,
                password,
                confirm_password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message || 'Error al crear usuario';
            message.style.color = 'red';
            return;
        }

        message.textContent = 'Usuario creado correctamente';
        message.style.color = 'green';

        document.getElementById('createUserForm').reset();

        cargarUsuarios();

    } catch (error) {
        console.error(error);
    }

});
async function eliminarUsuario(id) {

    if (!confirm('¿Eliminar usuario?')) return;

    try {

        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            alert('No se pudo eliminar');
            return;
        }

        cargarUsuarios();

    } catch (error) {
        console.error(error);
    }
}


function editarUsuario(id, nombreActual, rolActual) {

    document.getElementById('edit_id').value = id;
    document.getElementById('edit_name').value = nombreActual;
    document.getElementById('edit_role').value = rolActual;

    document.getElementById('editModal').style.display = 'flex';
}
async function guardarEdicion() {

    const id = document.getElementById('edit_id').value;
    const full_name = document.getElementById('edit_name').value;
    const role = document.getElementById('edit_role').value;

    try {

        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                full_name,
                role
            })
        });

        if (!response.ok) {
            alert('Error al actualizar');
            return;
        }

        cerrarModal();
        cargarUsuarios();

    } catch (error) {
        console.error(error);
    }
}
function cerrarModal() {
    document.getElementById('editModal').style.display = 'none';
}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}
cargarUsuarios();