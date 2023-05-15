(function() {
  "use strict";
  /**
   * Easy selector helper function
   */

  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  let data = []
  let currentData = []
  let dataLength = 0
  let currentPage = 1
  let maxPage = Math.floor(dataLength / 7 + 1)
  const itemPerPage = 6
  const render_data = (data, currentPage) =>{
    let content = `<div class="row personal-blog-container" data-aos="fade-up" data-aos-duration="500">`
    for (var index in data) {
      if(index < currentPage * itemPerPage & index >= (currentPage - 1) *itemPerPage){
        const item = data[index];
        const template = `<div class="col-lg-4 col-md-6 personal-blog-item ${item['filter']}">
              <a href='${item['link']}'>
                  <div class="personal-blog-wrap" style="height:100%">
                  <img src="${item['image']}" class="img-fluid" alt="">
                  <div class="personal-blog-links">
                    <h5 style="text-align:center; padding-bottom: '10px'; color: #333">${item['header']}</h5>
                  </div>
                </div>
              </a>
            </div>`;
      content = content + template;
      }
    }
    content = content + '</div>'
    var contentElement = document.getElementById("personal_blog_data");
    contentElement.innerHTML = content;
  }

  //get data
  fetch('/personal_blog/data.json')
  .then(response => response.json())
  .then(res => {
    data = res.data;
    currentData = [...data];
    render_data(currentData, currentPage);
    dataLength = currentData.length;
    maxPage = Math.floor(dataLength / 7 + 1)
    render_nav()
  })
  .catch(error => console.error(error));


  // handle change page
  const pageItems = document.querySelectorAll('#personal_blog_nav .pagination .page-item');
  const prevBtn = document.querySelector('#personal_blog_nav  .pagination .page-item-previous');
  const nextBtn = document.querySelector('#personal_blog_nav .pagination .page-item-next');
  let page = document.querySelectorAll('#personal_blog_nav .pagination .page-item.active');
  pageItems.forEach(pageItem => {
    pageItem.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the link from triggering a page reload
      
      // Remove the 'active' class from all page items
      pageItems.forEach(item => {
        item.classList.remove('active');
        if(parseInt(item.textContent) >maxPage){
          item.classList.add('disable-btn');
        }
      });
      
      // Add the 'active' class to the clicked page item
      this.classList.add('active');
      
      // Update the text of the current page item
      currentPage = parseInt(this.textContent);
      render_data(currentData, currentPage)
    })
  });

  //handle prev
  prevBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the link from triggering a page reload
    if(currentPage > 1){
      currentPage -= 1;
    }
    let is_in_nav = false
    pageItems.forEach(item => {
      item.classList.remove('active');
      if(parseInt(item.textContent)== currentPage){
        item.classList.add('active');
        is_in_nav = true
      }
      if(parseInt(item.textContent) >maxPage){
        item.classList.add('disable-btn');
      }
    });

    if(is_in_nav == false){ // change number
      let i = 0;
      pageItems.forEach(item => {
        item.innerHTML = `<span class="page-link">`+String(currentPage + i)+`</span>`
        if(currentPage + i == currentPage){
          item.classList.add('active');
        }
        i = i +1;
      });
    }
    render_data(currentData, currentPage)
  });


  //handle next
  nextBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the link from triggering a page reload
    if(currentPage < maxPage){
      currentPage += 1;
    }
    console.log(currentPage)
    let is_in_nav = false
    pageItems.forEach(item => {
      item.classList.remove('active');
      if(parseInt(item.textContent) >maxPage){
        item.classList.add('disable-btn');
      }
      if(parseInt(item.textContent)== currentPage){
        item.classList.add('active');
        is_in_nav = true
      }
    });

    if(is_in_nav == false){ // change number
      let i = 2;
      pageItems.forEach(item => {
        console.log(i)
        item.innerHTML = `<span class="page-link">`+String(currentPage - i)+`</span>`
        if( currentPage - i == currentPage){
          item.classList.add('active');
        }
        i = i -  1;
      });
    }
    render_data(currentData, currentPage)
  });
  const render_nav = (maxPage) =>{
    const Items = document.querySelectorAll('#personal_blog_nav .pagination .page-item');
    Items.forEach(item => {
      item.classList.remove('disable-btn');
      item.classList.remove('active');
      if(item.textContent == currentPage){
        item.classList.add('active');
      }
      if(parseInt(item.textContent) >maxPage){
        item.classList.add('disable-btn');
      }
    });
  }
  
  window.addEventListener('load', () => {
    let portfolioContainer = select('.personal-blog-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.personal-blog-item'
      });

      let portfolioFilters = select('#personal-blog-filters li', true);

      on('click', '#personal-blog-filters li', function(e) {
        e.preventDefault();

        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');
        const filter = this.getAttribute('data-filter')
        if(filter == '*'){
          currentData = data
        }else{
          currentData = data.filter(item => item['filter'] == filter.split('.')[1]);
        }
        currentPage = 1
        dataLength = currentData.length
        maxPage = Math.floor(dataLength / 7 + 1)
        console.log('max Page', maxPage)
        render_data(currentData, currentPage)
        render_nav(maxPage)
      }, true);
    }

  });

  window.addEventListener('load', () => {
    AOS.init({
      duration: 300,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });
})()