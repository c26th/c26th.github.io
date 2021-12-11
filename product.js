var isMenuExpanded = false;

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

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable) {
            return pair[1];
        }
    }
    return(false);
}

let id = getQueryVariable("id");
if (id == false) {
    id = 0;
}

function generateInfo() {
    let hero = document.getElementById("hero");
    let dets = document.getElementById("dets");
    let vols = document.getElementById("vols");
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "titles-full.json", true);
    
    xhr.onload = function() {
        if (xhr.status == 200) {
            let json = JSON.parse(xhr.response);
            
            let title = document.createElement("h1");
            title.textContent = json.titles[id].title;
            
            var credit = json.titles[id].author;
            if (json.titles[id].author != json.titles[id].artist) {
                credit = "<b>" + credit + "</b>" + ", " + json.titles[id].artist;
            }
            
            let creds = document.createElement("p");
            creds.innerHTML = credit;
            
            hero.style.background = "radial-gradient(transparent, black), url('img/" + id + "/1." + json.titles[id].volumes[0].cover + "')";
            hero.style.backgroundSize = "cover";
            
            hero.appendChild(title);
            hero.appendChild(creds);
            
            // DETAILS
            
            let jp = document.createElement("p");
            jp.innerHTML = "<b>" + json.titles[id].ja + "</b><br/><i>" + json.titles[id].ro + "</i>";
            
            let rating = document.createElement("p");
            rating.classList.add("rating");
            rating.innerHTML = "<b>" + json.titles[id].rating + " <i class=\"bi bi-star-fill\"></i></b>";
            
            let raters = document.createElement("small");
            raters.innerHTML = "based on <b>" + json.titles[id].raters + " users.</b>";
            
            let author = document.createElement("p");
            author.innerHTML = "<b>Author:</b><br/>" + json.titles[id].author;
            
            let artist = document.createElement("p");
            artist.innerHTML = "<b>Artist:</b><br/>" + json.titles[id].artist;
            
            let synopsis = document.createElement("p");
            synopsis.classList.add("flatcard");
            synopsis.textContent = json.titles[id].synopsis;
            
            let genrediv = document.createElement("div");
            genrediv.classList.add("genrelist");
            
            for (x = 0; x < json.titles[id].genres.length; x++) {
                let genre = document.createElement("a");
                genre.href="#";
                genre.classList.add("pill");
                genre.textContent = json.titles[id].genres[x];
                genrediv.appendChild(genre);
            }
            
            dets.appendChild(jp);
            dets.appendChild(rating);
            dets.appendChild(raters);
            dets.appendChild(author);
            dets.appendChild(artist);
            dets.appendChild(synopsis);
            dets.appendChild(genrediv);
            
            if (json.titles[id].alt.length > 0) {
                let alts = document.createElement("p");
                let content = "<b>Alternate Titles:</b><br/>";
                for (x = 0; x < json.titles[id].alt.length; x++) {
                    if (x != json.titles[id].alt.length - 1) {
                        content = content + "<i>" + json.titles[id].alt[x] + "</i>, ";
                    } else {
                        content = content + "<i>" + json.titles[id].alt[x] + "</i>";
                    }
                }
                alts.innerHTML = content;
                dets.appendChild(alts);
            }
            
            for (z = 1; z <= json.titles[id].volumes.length; z++) {
                let cvr = document.createElement("div");
                cvr.classList.add("flatcard");
                cvr.classList.add("flexiblerow");
                cvr.style.background = "radial-gradient(transparent, black), url(\"img/" + id + "/" + z + "." + json.titles[id].volumes[z-1].cover + "\")";
                cvr.style.backgroundSize = "cover";
                
                let num = document.createElement("h1");
                num.classList.add("volno");
                num.innerHTML = "#" + z + " <small>(" + json.titles[id].volumes[z-1].year + ")</small>";
                num.style.color = "white";
                num.style.fontWeight = "900";
                num.style.filter = "drop-shadow(0 0 5px var(--primary))";
                
                let link = document.createElement("p");
                link.setAttribute("onclick", "addToCart(" + id + ", " + z + ")");
                link.classList.add("link");
                link.textContent = "Add to Cart";
                
                cvr.appendChild(num);
                cvr.appendChild(link);
                vols.appendChild(cvr);
            }
        }
    }
    
    xhr.send();
}

const url = "https://sheetdb.io/api/v1/kxcaiak56f5l9";

async function getAllComments() {
    console.log("Getting all comments");
    
    let prom = new Promise(function(resolve) {
    axios.get(url + "/search?manga=" + id).then(response => {
            console.log(response.data);
            resolve(response.data);
        });
        });
    return await prom;
}

async function sanitize(comment) {
    let novo = comment;
    console.log("sanitzer");
    let prom = new Promise(function(resolve) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "profanities.json", true);
        xhr.send();
        xhr.onload = function() {
            if (xhr.status == 200) {
                let bad = JSON.parse(xhr.response);
                console.log(bad);
                for (x = 0; x < bad.en.length; x++) {
                    //console.log("found " + bad.en[x]);
                    
                    let expr = new RegExp(bad.en[x], "gi");
                    novo = novo.replace(expr, "[redacted]");
                }
                for (y = 0; y < bad.fil.length; y++) {
                    let expr = new RegExp(bad.fil[y], "gi");
                    novo = novo.replace(expr, "[redacted]");
                }
                
                resolve(novo);
            }
        };
    });
    return await prom;
}

async function postComment(handle, comment) {
    const unix = Date.now();
    let date = new Date(unix).toLocaleString();
    let prom = new Promise(function(resolve) {
    console.log("before sanitizer");
    sanitize(comment).then(function(value) {
        comment = value;
        axios.post(url,{"data": {"handle": handle, "date": date, "comment": comment, "manga": id}})
        .then(response => {
                resolve(response.data);
            });
        });
    });
    return await prom;
}


function generateComments() {
    getAllComments().then(function(value) {
        let comments = value;
        console.log(comments.length);
        let container = document.getElementById("comments");
        if (comments.length != 0) {
            container.innerHTML = "";
            for (x = 0; x < comments.length; x++) {
                let comment = document.createElement("div");
                comment.classList.add("flatcard");
                comment.classList.add("sh");
                
                let handle = document.createElement("b");
                handle.innerHTML = comments[x].handle + "<br/>";
                
                let date = document.createElement("small");
                date.textContent = comments[x].date;
                
                let cbody = document.createElement("p");
                cbody.innerHTML = comments[x].comment;
                
                comment.appendChild(handle);
                comment.appendChild(date);
                comment.appendChild(cbody);
                
                container.appendChild(comment);
                
            }
        } else {
            container.innerHTML = "<p>There are no comments for this title.<b>Be the first one!</b></p>";
        }
    });
}

function onPostCommentClick(e) {
    e.preventDefault();
    console.log("Ok");
    let handle = document.getElementById("handle");
    let comment = document.getElementById("comment");
    let name = "";
    handle.readOnly = true;
    comment.readOnly = true;
    
    if (handle.value == "") {
        name = "anon";
    } else {
        name = handle.value;
    }
    
    let said = comment.value;
    
    said = said.replace(/(?:\r\n|\r|\n)/g, "<br/>");
    /**
    let unix = Date.now();
    let date = new Date(unix).toLocaleString();
    
    console.log(name + " on " + date + " said: " + said);
    **/
    postComment(name, said).then(function(value) {
        if (value.created == 1) {
            console.log("Created.");
            generateComments();
            handle.innerText = "";
            comment.value = "";
            handle.readOnly = false;
            comment.readOnly = false;
        }
    });
    
}

function addToCart(title, vol) {
    console.log(title + " " + vol);
}

function main() {
    generateInfo();
    generateComments();
}

main();