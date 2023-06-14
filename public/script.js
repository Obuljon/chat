
document.getElementById('fileInput').addEventListener('change', function() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
    
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/api/updatafile', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      const shopimages = document.querySelectorAll("#shopimage");
      for(let i = 0; i <= shopimages.length; i++){
      const imgs = shopimages[i].getElementsByTagName("img");
      for (let j = 0; j < imgs.length; j++) {
        imgs[j].src = `file/${data.image}`;
      }
      } 
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });