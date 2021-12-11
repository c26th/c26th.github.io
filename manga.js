function $get(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

if ($get("id") != null) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "../titles.json", true);
  xhr.requestType = "application/json";
  xhr.send();
  
  xhr.onload = function() {
    let jsn = xhr.response;
    let dejsn = JSON.parse(jsn);
    loadManga(dejsn);
    
    let xxy = new XMLHttpRequest();
    xxy.open("GET", "../comments.json", true);
    xxy.requestType = "application/json";
    xxy.send();
    
    xxy.onload = function() {
      //createComment(JSON.parse(xxy.response));
    }
    
  }
} else {
  location.replace("../index.html");
}

function loadManga(obj) {
  let id = $get("id");
  
  let ttitle = document.getElementById("ttitle");
  let tindv = document.getElementById("tindv");
  let tjp = document.getElementById("tjp");
  let tdesc = document.getElementById("tdesc");
  let trating = document.getElementById("trating");
  let traters = document.getElementById("traters");
  let talts = document.getElementById("alts");
  let tgenres = document.getElementById("genres");
  let tvols = document.getElementById("vols");
  let hero = document.getElementById("hero");
  
  for (var x = 0; x < obj.titles.length; x++) {
    //console.log(obj.titles[x]);
    //console.log(id);
    if (x == id) {
      let title = obj.titles[x].title;
      let author = obj.titles[x].author;
      let art = obj.titles[x].art;
      let jp = obj.titles[x].jp;
      let desc = obj.titles[x].description;
      let rating = obj.titles[x].rating;
      let raters = obj.titles[x].raters;
      let alts = obj.titles[x].alt;
      let genres = obj.titles[x].genres;
      let vols = obj.titles[x].volumes;
      let short = obj.titles[x].short;
      
      ttitle.innerHTML = title;
      
      if (author == art) {
        tindv.innerHTML = author;
      } else {
        tindv.innerHTML = author + ", " + art;
      }
      
      tjp.innerHTML = jp;
      tdesc.innerHTML = desc;
      
      trating.innerHTML = rating + "<i class=\"bx bxs-star\"></i>";
      traters.innerHTML = raters;
      
      for (var y = 0; y < alts.length; y++) {
        let alternate = document.createElement("p");
        alternate.textContent = alts[y];
        talts.appendChild(alternate);
      }
      
      for (var z = 0; z < genres.length; z++) {
        let genre = document.createElement("p");
        genre.classList.add("pill");
        genre.textContent = genres[z];
        tgenres.appendChild(genre);
      }
      
      let bgpath = null;
      
      for (var w = 0; w < vols.length; w++) {
        if (w+1 == vols.length) {
          bgpath = "../img/" + short + "-" + (w+1) + ".jpg";
          hero.style.backgroundImage = "radial-gradient(transparent, black), url(" + bgpath + ")";
          hero.style.backgroundSize = "cover";
          hero.style.backgroundPosition = "top";
        }
        
        let card = document.createElement("div");
        card.classList.add("whitecard", "row", "tight");
        
        let cover = document.createElement("img");
        cover.src = "../img/" + short + "-" + (w+1) + ".jpg";
        
        let dv = document.createElement("div");
        let no = document.createElement("p");
        let yr = document.createElement("p");
        let lk = document.createElement("a");
        
        no.textContent = "#" + (w+1);
        yr.classList.add("year");
        yr.textContent = vols[w];
        lk.classList.add("link");
        lk.textContent = "Add to Cart";
        
        lk.href = "#";
        
        dv.appendChild(no);
        dv.appendChild(yr);
        dv.appendChild(lk);
        
        card.appendChild(cover);
        card.appendChild(dv);
        
        tvols.appendChild(card);
        
        ttitle.classList.add("shadowed");
        tindv.classList.add("shadowed");
        tjp.classList.add("shadowed");
      }
      
    }
    
  }
}

function sanitize(comment) {
  let common = "";
  let xxx = new XMLHttpRequest();
  xxx.open("GET", "../profanities.json", true);
  xxx.requestType = "application/json";
  xxx.send();
  
  xxx.onload = function() {
    let jason = JSON.parse(xxx.responseText);
    
    for (let x = 0; x < jason.en.length; x++) {
      let stars = "";
      for (let y = 0; y < jason.en[x].length; y++) {
        stars = stars + "*";
      }
      common = comment.split(jason.en[x]).join(stars);
    }
    console.log(common);
  }
  return common;
}

function validateEmail(email) {
  //console.log("Dumaan");
  var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
}

async function sanitizer(comment) {
  let xxx = new XMLHttpRequest();
  xxx.open("GET", "../profanities.json", true);
  xxx.requestType = "application/json";
  xxx.send();
  xxx.onload = function() {
  let jason = JSON.parse(xxx.response);
  let comm = comment.split(" ");
  
  //console.log(jason);
  let x = 0;
  let expr = "";
  while (x < jason.en.length) {
    // number of stars
    let stars = "";
    let y = 0;
    while (y < jason.en[x].length) {
      stars = stars + "*";
      y++;
    }
    expr = new RegExp(jason.en[x], "gi");
    comment = comment.replace(expr, stars);
    
    x++;
  }
  
  x = 0;
  while (x < jason.fil.length) {
    // number of stars
    let stars = "";
    let y = 0;
    while (y < jason.fil[x].length) {
      stars = stars + "*";
      y++;
    }
    expr = new RegExp(jason.fil[x], "gi");
    comment = comment.replace(expr, stars);
    
    x++;
  }
  }
  
  return comment;
}

function censor(comment) {
  // ay yung json file na xhr
  
  sanitizer(comment, xxx).then(
    function(value) {
      return comment;
    },
    function(error) {
      return 0;
    }
  );
}

function explodeCommentJson(t) {
  let list = [];
  
  for (let oo = 0; oo < t.cm.length; oo++) {
    let manga = t.cm[oo].manga;
    let name = t.cm[oo].name;
    let email = t.cm[oo].email;
    let comment = t.cm[oo].comment;
    let jhsn = "{" + "\"manga\":\"" + manga + "\", \"name\":\"" + name + "\", \"email\":\"" + email + "\", \"comment\":\"" + comment + "\"}";
    list.push(jhsn);
  }
  
  return list;
}

function createComment() {
  
  let rhe = "";
  let hare = new XMLHttpRequest();
  hare.open("GET", "../comments.json", true);
  hare.requestType = "application/json";
  hare.send();
  
  hare.onload = function() {
    rhe = JSON.parse(hare.response);
    const zyz = document.getElementById("comments");
    const chpr = document.getElementById("chprof");
    
    for (let cv = 0; cv < rhe.cm.length; cv++) {
      
     let card = document.createElement("div");
     card.classList.add("whitecard");
     let nme = document.createElement("h3");
     let eml = document.createElement("h4");
     let br = document.createElement("br");
     let pre = document.createElement("pre");
     
     nme.textContent = rhe.cm[cv].name;
     eml.textContent = rhe.cm[cv].email;
     pre.textContent = rhe.cm[cv].comment;
     
     card.appendChild(nme);
     card.appendChild(eml);
     card.appendChild(pre);
     zyz.appendChild(card);
    }
  }
  
}

function sewCommentJson(t) {
  let de = t;
  let toj = "";
  toj = toj + "{\"cm\":[";
  for (let gh = 0; gh < de.length; gh++) {
    toj = toj + de[gh];
    if (gh+1 < de.length) {
      toj = toj + ",";
    }
  }
  toj = toj + "]}";
  return JSON.parse(toj);
}

function newCensor(str) {
  let xch = new XMLHttpRequest();
  xch.open("GET", "../profanities.json", true);
  xch.requestType = "application/json";
  xch.send();
  
  xch.onload = function() {
    
    let me = JSON.parse(xch.response);
    
    let x = 0;
    let expr = "";
    while (x < 5) {
      // number of stars
      let stars = "";
      let y = 0;
      while (y < me.en[x].length) {
        stars = stars + "*";
        y++;
      }
      expr = new RegExp(me.en[x], "gi");
      str = str.replace(expr, stars);
      
      x++;
    }
  }
}

function newComment(rhe) {
  
  const zyz = document.getElementById("comments");
  
  for (let x = 0; x < 10; x++) {
    let card = document.createElement("div");
     card.classList.add("whitecard");
     let nme = document.createElement("h3");
     let eml = document.createElement("h4");
     let br = document.createElement("br");
     let pre = document.createElement("pre");
     
     nme.textContent = rhe.cm[x].name;
     eml.textContent = rhe.cm[x].email;
     
     pre.textContent = "Please wait...";
     console.log(rhe.cm[x].comment);
     //pre.textContent = newCensor(rhe.cm[x].comment);
     
     card.appendChild(nme);
     card.appendChild(eml);
     card.appendChild(pre);
     zyz.appendChild(card);
  }
  
}
/**
let hare = new XMLHttpRequest();
hare.open("GET", "../comments.json", true);
hare.requestType = "application/json";
hare.send();

newComment(JSON.parse(hare.response));
**/
function postComment() {
  let err = document.getElementById("err");
  
  const ae = document.getElementById("alias");
  const ee = document.getElementById("email");
  const ce = document.getElementById("comment");
  
  let alias = ae.value;
  let email = ee.value;
  let comment = ce.value;
  
  let ret = true;
  
  if (alias == "" || comment == "") {
    err.innerHTML = "Please fill all required fields.";
    err.classList.add("show");
    return false;
  } else {
    err.classList.remove("show");
    
    if (email != "") {
      if (validateEmail(email)) {
        
        err.classList.add("show");
        err.innerHTML = "please wait";
        
        
        let hare = new XMLHttpRequest();
        hare.open("GET", "../comments.json", true);
        hare.requestType = "application/json";
        hare.send();
        
        hare.onload = function() {
          
          let t = JSON.parse(hare.responseText);
          let exp = explodeCommentJson(t);
          
          let manga = $get("id");
          let name = alias;
          let eml = email;
          let commt = comment;
          let jhsn = "{" + "\"manga\":\"" + manga + "\", \"name\":\"" + name + "\", \"email\":\"" + eml + "\", \"comment\":\"" + commt + "\"}";
          exp.push(jhsn);
          
          let rhe = sewCommentJson(exp);
          console.log(rhe);
          
          newComment(rhe);
          
        }
        
        console.log(comment);
        return false;
        
      } else {
        err.innerHTML = "Email address is invalid.";
        err.classList.add("show");
        return false;
      }
    }
    return false;
  }
}

//createComment();