document.addEventListener("DOMContentLoaded", function() {
  const postList = document.getElementById('post-list');
  const postModal = document.getElementById('post-modal');
  const postComments = document.getElementById('post-comments');
  const searchInput = document.getElementById('searchInput');
  let postsData = []; // store all posts data

  // fetch posts from the api
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(posts => {
      postsData = posts; // store posts data for filtering
      displayPosts(postsData);
    })
    .catch(error => console.error('Error fetching data:', error));

  // function to display filtered posts
  function displayPosts(posts) {
    postList.innerHTML = ''; //clear the current list

    posts.forEach(post => {
      const listItem = document.createElement('li');
      listItem.classList.add('post-item'); // add a class for each list item

      const titleNode = document.createElement('p');
      titleNode.textContent = post.title;
      titleNode.classList.add('post-title'); // add a class for the title

      const bodyNode = document.createElement('p');
      bodyNode.textContent = post.body;
      bodyNode.classList.add('post-body'); // add a class for the body

      listItem.appendChild(titleNode);
      listItem.appendChild(bodyNode);

      // create the delete icon
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa-solid', 'fa-trash', 'delete-icon');
      deleteIcon.addEventListener('click', () => deletePost(post.id));
      listItem.appendChild(deleteIcon);

      // adding info icon for showing modals
      const modalIcon = document.createElement('i');
      modalIcon.classList.add('fa-solid', 'fa-circle-info', 'modal-icon');
      listItem.appendChild(modalIcon); 

      // add click event to each post item to display modal
      modalIcon.addEventListener('click', () => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`)
          .then(response => response.json())
          .then(post => {
            displayPostDetails(post);
            fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`)
              .then(response => response.json())
              .then(comments => {
                const commentsHtml = comments.map(comment => `<p>${comment.body}</p>`).join('');
                postComments.innerHTML = commentsHtml;
                openModal();
              })
              .catch(error => console.error('Error fetching comments:', error));
          })
          .catch(error => console.error('Error fetching post:', error));
      });
      postList.appendChild(listItem);
    });
  }

  function displayPostDetails(post) {
    const postDetails = `
      <p><strong>User ID:</strong> ${post.userId}</p>
      <p><strong>Post ID:</strong> ${post.id}</p>
      <p><strong>Title:</strong> ${post.title}</p>
      <p><strong>Body:</strong> ${post.body}</p>
    `;
    document.getElementById('post-details').innerHTML = postDetails;
  }

  // function to delete a post
  function deletePost(postId) {
    // Filter out the post to be deleted
    postsData = postsData.filter(post => post.id !== postId);
    displayPosts(postsData);
  }

  // function to open the modal
  function openModal() {
    postModal.style.display = 'block';
  }
  
  // close the modal when close button is clicked
  postModal.querySelector('.close').addEventListener('click', () => {
    postModal.style.display = 'none';
  });
  // close the modal when clicking outside the modal content
  window.addEventListener('click', (event) => {
    if (event.target === postModal) {
      postModal.style.display = 'none';
    }
  });
  // search functionality
  searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPosts = postsData.filter(post => {
      return post.title.toLowerCase().includes(searchTerm) || post.body.toLowerCase().includes(searchTerm);
    });
    displayPosts(filteredPosts);
  });
});