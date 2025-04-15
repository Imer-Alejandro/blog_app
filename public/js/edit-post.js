document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('editPostForm');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const categorySelect = document.getElementById('categorySelect');

  const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];
  const savePosts = (posts) => localStorage.setItem('posts', JSON.stringify(posts));
  const getCategories = () => JSON.parse(localStorage.getItem('categories')) || [];

  // ✅ Extraer el ID desde la URL tipo /post/edit/3
  const pathParts = window.location.pathname.split('/');
  const postId = parseInt(pathParts[pathParts.length - 1]);

  const posts = getPosts();
  const postToEdit = posts.find(p => p.id === postId);

  if (!postToEdit) {
    alert('Publicación no encontrada');
    window.location.href = '/';
    return;
  }

  // Cargar categorías en el select
  const categories = getCategories();
  categorySelect.innerHTML = categories
    .map(c => `<option value="${c.name}">${c.name}</option>`)
    .join('');

  // Rellenar campos del formulario con los datos del post
  titleInput.value = postToEdit.title;
  contentInput.value = postToEdit.content;
  categorySelect.value = postToEdit.category;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedPost = {
      ...postToEdit,
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      category: categorySelect.value
    };

    const updatedPosts = posts.map(p => p.id === postId ? updatedPost : p);
    savePosts(updatedPosts);

    alert('Publicación actualizada con éxito');
    window.location.href = '/';
  });
});
