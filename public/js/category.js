document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('categoryForm');
  const list = document.getElementById('categoryList');
  const input = form.querySelector('input[name="name"]');

  let editingIndex = null;

  // Obtener categorías del localStorage
  function getCategories() {
    return JSON.parse(localStorage.getItem('categories')) || [];
  }

  // Guardar categorías en localStorage
  function saveCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  // Obtener publicaciones del localStorage
  function getPosts() {
    return JSON.parse(localStorage.getItem('posts')) || [];
  }

  // Guardar publicaciones al localStorage
  function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
  }

  // Renderizar lista de categorías
  function renderCategories() {
    const categories = getCategories();
    list.innerHTML = '';

    categories.forEach((category, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span>${category.name}</span>
        <div>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editCategory(${index})">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      list.appendChild(li);
    });
  }

  // Agregar o editar categoría
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;

    const categories = getCategories();

    if (editingIndex !== null) {
      const oldName = categories[editingIndex].name;
      categories[editingIndex].name = name;

      // Actualizar nombre de categoría en los posts
      const posts = getPosts();
      const updatedPosts = posts.map(post => {
        if (post.category === oldName) {
          return { ...post, category: name };
        }
        return post;
      });
      savePosts(updatedPosts);

      editingIndex = null;
    } else {
      categories.push({ name });
    }

    saveCategories(categories);
    form.reset();
    renderCategories();
  });

  // Inicializar
  renderCategories();

  // Exponer funciones globales
  window.editCategory = (index) => {
    const categories = getCategories();
    input.value = categories[index].name;
    editingIndex = index;
  };

  window.deleteCategory = (index) => {
    const categories = getCategories();
    const categoryToDelete = categories[index].name;

    if (confirm(`¿Eliminar la categoría "${categoryToDelete}" y todos los posts asociados?`)) {
      // 1. Eliminar la categoría
      categories.splice(index, 1);
      saveCategories(categories);

      // 2. Eliminar los posts asociados
      const posts = getPosts();
      const filteredPosts = posts.filter(post => post.category !== categoryToDelete);
      savePosts(filteredPosts);

      // 3. Renderizar
      renderCategories();
    }
  };
});
