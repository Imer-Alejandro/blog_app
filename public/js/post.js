document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newPostForm');
    const postsContainer = document.getElementById('postsContainer');
    const categorySelect = document.getElementById('categorySelect');
    
    // Funciones de almacenamiento
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];
    const savePosts = (posts) => localStorage.setItem('posts', JSON.stringify(posts));
    const getCategories = () => JSON.parse(localStorage.getItem('categories')) || [];
    
    // Generar ID autoincremental
    const generatePostId = () => {
      const posts = getPosts();
      return posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    };
    
    // Rellenar el select de categorías
    if (categorySelect) {
      const categories = getCategories();
      if (categories.length > 0) {
        categorySelect.innerHTML = categories
          .map(c => `<option value="${c.name}">${c.name}</option>`)  // Ahora c.name funciona correctamente
          .join('');
      } else {
        categorySelect.innerHTML = `<option disabled selected>No hay categorías registradas</option>`;
        categorySelect.disabled = true;
    
        // Crear y mostrar el botón para ir a agregar categorías
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-warning mt-2';
        btn.textContent = 'Agregar categoría';
        btn.onclick = () => window.location.href = '/categories';
    
        categorySelect.parentNode.appendChild(btn); // Insertar debajo del select
      }
    }
    
    // Registrar publicación
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        if (categorySelect.disabled) {
          alert('Debe haber al menos una categoría registrada para publicar.');
          return;
        }
    
        const newPost = {
          id: generatePostId(),
          title: form.title.value.trim(),
          content: form.content.value.trim(),
          category: form.category.value,
          createdAt: new Date().toISOString()
        };
    
        const posts = getPosts();
        posts.push(newPost);
        savePosts(posts);
    
        alert('¡Publicación registrada con éxito!');
        form.reset();
        window.location.href = '/';
      });
    }
    
    // Renderizar publicaciones en el home
    if (postsContainer) {
      renderPosts();
    }
    
    function renderPosts() {
      const posts = getPosts();
      postsContainer.innerHTML = '';
    
      if (posts.length === 0) {
        postsContainer.innerHTML = `<p class="text-center text-muted">No hay publicaciones todavía.</p>`;
        return;
      }
    
      posts.forEach(post => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
    
        col.innerHTML = `
                <div class="card h-100 shadow border-0">
                  <div class="card-body">
                    <h5 class="card-title text-primary">${post.title}</h5>
                    <div class="mb-2">
                      <span class="badge bg-blue text-dark"><i class="bi bi-tag"></i> ${post.category}</span>
                      <small class="text-muted float-end">
                        <i class="bi bi-clock"></i> ${new Date(post.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <p class="card-text">${post.content}</p>
                  </div>
                  <div class="card-footer bg-white d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editPost(${post.id})">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="confirmDeletePost(${post.id})">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              `;
                  
        postsContainer.appendChild(col);
      });
    }
    
    // Funciones globales para edición y eliminación
    window.editPost = (id) => {
      const posts = getPosts();
      const postToEdit = posts.find(post => post.id === id);
      
      if (postToEdit) {
        // Redirigir al formulario de edición
        window.location.href = `/post/edit/${id}`;
      } else {
        alert('Publicación no encontrada.');
      }
    };
    
    window.confirmDeletePost = (id) => {
      if (confirm('¿Estás seguro de eliminar esta publicación?')) {
        let posts = getPosts();
        posts = posts.filter(p => p.id !== id);
        savePosts(posts);
        renderPosts();
      }
    };
  });
  
  