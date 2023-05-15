(function() {
    "use strict";
    // const url = 'technical_blog/detail';
    const url = 'inner-page.html';
    const path = window.location.pathname;

    if(path.indexOf(url) !== -1){
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        fetch('technical_blog/'+page+"/"+page+'.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();})
        .then(html => {
          const injectedContent = document.querySelector('#content_blog');
          injectedContent.innerHTML = html;
          const myLink = document.getElementById('page-name');
          myLink.textContent = page;
        })
        .catch(e =>{
          const injectedContent = document.querySelector('#content_blog');
          injectedContent.innerHTML = '404';
        });
    }else{
        const injectedContent = document.querySelector('#content_blog');
        injectedContent.innerHTML = '404';
    }

  })()