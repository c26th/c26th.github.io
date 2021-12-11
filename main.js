
var isMenuExpanded = false;

function onLoginClick() {
    console.log("Login clicked.");
    
    let error = document.getElementById("error");
    let uname = document.getElementById("uname");
    let pword = document.getElementById("pword");
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/site/ajax/login/" + uname.value + "/" + pword.value, true);
    
    xhr.onload = function() {
        
        let result = JSON.parse(xhr.responseText);
        
        if (result.error.isError) {
            error.innerHTML = result.error.msg;
            error.style.display = "block";
            error.classList.add("show-me");
        }
        
        if (result.state == "OK") {
            window.location.replace("/site/pages/home");
        }
        
        //error.innerHTML = xhr.responseText;
    }
    
    xhr.send();
}

function onMenuBtnClick() {
    console.log("Menu clicked.");
    let sbar = document.getElementById("sbar");
    let menu = document.getElementById("menu-btn");
    let header = document.getElementById("compname");
    let menuIcon = document.getElementById("menu-icon");
    let menuText = document.getElementById("menubtn-txt");
    let spans = document.querySelectorAll("span.menu-text");
    
    if (isMenuExpanded) {
        if (window.innerWidth <= 640) {
            sbar.style.transform = "translate3d(-100vw, 0, 0)";
        } else {
            header.style.visibility = "hidden";
            menuText.style.display = "none";
            sbar.style.width = "8vw";
            menu.style.width = "2.5rem";
        }
        
        spans.forEach(
            function(node) {
                console.log("Entered");
                node.style.display = "none";
                node.classList.remove("show-me");
            });
        
        header.classList.remove("show-me");
        menuIcon.classList.remove("bi-x");
        menuIcon.classList.add("bi-list");
        menuText.textContent = "Menu";
        isMenuExpanded = false;
    } else {
        if (window.innerWidth <= 640) {
            sbar.style.transform = "translate3d(0, 0, 0)";
            
        } else {
            header.style.visibility = "visible";
            sbar.style.width = "30vw";
            menuText.style.display = "block";
            menu.style.width = "7rem";
        }
        
        spans.forEach(
            function(node) {
                console.log("Entered");
                node.style.display = "inline";
                node.classList.add("show-me");
            });
        
        header.classList.add("show-me");
        menuIcon.classList.remove("bi-list");
        menuIcon.classList.add("bi-x");
        menuText.textContent = "Close";
        
        isMenuExpanded = true;
    }
    
}

function onNavBtnClick() {
    console.log("Clicked.");
}

function heroCarousel() {
    var slides = document.querySelectorAll(".slide");
    var infos = document.querySelectorAll(".info");
    var btns = document.querySelectorAll(".btn");
    let current = 1;
    //let bgs = ["holidays-bg.jpg", "fall-bg.jpg"];
    
    var manualNav = function(man){
        console.log("Manual");
        slides.forEach((slide) => {
            slide.classList.remove("active-slide");
            
            infos.forEach((info) => {
                info.classList.remove("show-me-long");
            });
            
            btns.forEach((btn) => {
                btn.classList.remove("active-btn");
            });
        });
        
        slides[man].classList.add("active-slide");
        infos[man].classList.add("show-me-long");
        btns[man].classList.add("active-btn");
    };
    //console.log(btns);
    
    btns.forEach((btn, i) => {
        btn.addEventListener("click", () => {
            current = i;
            manualNav(i);
            //console.log(btns[i]);
        });
    });
    
    var repeat = function() {
        let active = document.getElementsByClassName("active-slide");
        let i = current;
        
        var repeater = function() {
            console.log("Repeater");
            setTimeout(function() {
               
               slides.forEach((slide) => {
                   slide.classList.remove("active-slide");
               });
               
               btns.forEach((btn) => {
                   btn.classList.remove("active-btn");
               });
               
               slides[current].classList.add("active-slide");
               btns[current].classList.add("active-btn");
               current++;
               
               if (slides.length == current) {
                   current = 0;
               }
               
               if (current >= slides.length) {
                   return;
               }
               repeater();
            }, 5000);
        };
        repeater();
    }
    repeat();
}

function generateCarouselCards() {
    let container = document.getElementById("lightSlider");
    let loading = document.createElement("i");
    loading.classList.add("bi");
    loading.classList.add("bi-arrow-clockwise");
    loading.classList.add("loading");
    container.appendChild(loading);
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "titles-full.json", true);
    
    xhr.onload = function() {
        if (xhr.status == 200) {
            loading.style.display = "none";
            let json = JSON.parse(xhr.response);
            
            for (x = 0; x < json.titles.length; x++) {
                let card = document.createElement("a");
                card.href="product.html?id=" + x;
                card.classList.add("card");
                let cbody = document.createElement("div");
                cbody.classList.add("card-body");
                let cfoot = document.createElement("div");
                cfoot.classList.add("card-footer");
                let details = document.createElement("div");
                details.classList.add("details");
                
                let title = document.createElement("p");
                title.classList.add("title");
                let author = document.createElement("p");
                author.classList.add("author");
                let cover = document.createElement("img");
                
                title.textContent = json.titles[x].title;
                author.textContent = json.titles[x].author;
                
                let vols = json.titles[x].volumes.length;
                cover.src = "img/" + x + "/" + vols + "." + json.titles[x].volumes[vols-1].cover;
                
                cbody.appendChild(cover);
                details.appendChild(title);
                details.appendChild(author);
                cfoot.appendChild(details);
                card.appendChild(cbody);
                card.appendChild(cfoot);
                container.appendChild(card);
                console.log("card planted");
            }
        }
    };
    
    xhr.onprogress = function(event) {
        loading.style.display = "block";
    };
    
    xhr.send();
}

function main() {
    console.log("Started.");
    generateCarouselCards();
    heroCarousel();
    
    $(document).ready(function() {
    $("#lightSlider").lightSlider({
        item: 4,
        autoWidth: false,
        slideMove: 1, // slidemove will be 1 if loop is true
        slideMargin: 10,
 
        addClass: 'mlr',
        mode: "slide",
        useCSS: true,
        cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
        easing: 'linear', //'for jquery animation',////
 
        speed: 400, //ms'
        auto: false,
        loop: true,
        slideEndAnimation: true,
        pause: 2000,
 
        keyPress: false,
        controls: true,
        prevHtml: '',
        nextHtml: '',
 
        rtl:false,
        adaptiveHeight:false,
 
        vertical:false,
        verticalHeight:500,
        vThumbWidth:100,
 
        thumbItem:10,
        pager: false,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
 
        enableTouch:true,
        enableDrag:true,
        freeMove:true,
        swipeThreshold: 40,
 
        responsive : [
            {
                breakpoint:800,
                settings: {
                    item:3,
                    slideMove:1,
                    slideMargin:6,
                  }
            },
            {
                breakpoint:480,
                settings: {
                    item:2,
                    slideMove:1,
                  }
            }
            ],
 
        onBeforeStart: function (el) {},
        onSliderLoad: function (el) {},
        onBeforeSlide: function (el) {},
        onAfterSlide: function (el) {},
        onBeforeNextSlide: function (el) {},
        onBeforePrevSlide: function (el) {}
    });
    });
}

main();