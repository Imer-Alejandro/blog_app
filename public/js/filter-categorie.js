document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('postsContainer');
  
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];
    const getCategories = () => JSON.parse(localStorage.getItem('categories')) || [];
  
    // Crear el filtro de categorías
    const createCategoryFilter = () => {
      const categories = getCategories();
      if (categories.length === 0) return;
  
      const filterContainer = document.createElement('div');
      filterContainer.className = 'mb-4 text-center';
  
      const select = document.createElement('select');
      select.className = 'form-select w-auto d-inline-block';
      select.innerHTML = `
        <option value="all">Todas las categorías</option>
        ${categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
      `;
  
      select.addEventListener('change', () => {
        renderPosts(select.value);
      });
  
      filterContainer.appendChild(select);
      postsContainer.parentNode.insertBefore(filterContainer, postsContainer);
    };
  
    // Renderizar publicaciones filtradas
    const renderPosts = (category = 'all') => {
      const posts = getPosts();
      postsContainer.innerHTML = '';
  
      const filtered = category === 'all' ? posts : posts.filter(p => p.category === category);
  
      if (filtered.length === 0) {
        postsContainer.innerHTML = `<p class="text-center text-muted">No hay publicaciones para esta categoría.</p>`;
        return;
      }
  
      filtered.forEach(post => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
  
        col.innerHTML = `
          <div class="card h-100 shadow border-0">
            <div class="card-body">
              <h5 class="card-title text-primary">${post.title}</h5>
              <p class="card-text small text-muted mb-2">
                <i class="bi bi-tag"></i> ${post.category} <br>
                <i class="bi bi-clock"></i> ${new Date(post.createdAt).toLocaleString()}
              </p>
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
    };
  
    // Inicializar
    if (postsContainer) {
      createCategoryFilter();
      renderPosts(); // Mostrar todos al inicio
    }
  });
  