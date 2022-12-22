// Just an exmaple as an aide memoire. needs a valid token from https://github.com/settings/tokens
// Unauthenticated requests are rate limited but won't be a problem for a demo site like this.
// const opt = {headers: {'Authorization': 'token ghp_FKJadH46sgsJHjkhfds7734kjhsfd88dA'}} 

const username = 'trunten';
let apiUrl = `https://api.github.com/users/${username}/repos`;

// use my api_key if running locally (i.e. debugging) to avoid rate limit
if (window.location.hostname === '127.0.0.1') {
    fetch('../../api_key')
    .then(response => response.text())
    .then((data) => {
        githubLanguages( { headers: {'Authorization': `token ${data}`} } );
    })
} else {
    githubLanguages({});
}

function githubLanguages (opt) {
    fetch(apiUrl, opt)
    .then((response) => {
        if (response.ok) {
            return response.json();
        }  
    })
    .then((data) => {
        languagePromises = [];
        for (let i in data) {
            let repo = data[i];
            if (!repo['fork'] && repo['language']) {
                // console.log(repo['name'], repo['language']);
                let langs = repo['languages_url'];
                languagePromises.push(fetch(langs, opt))
            }
        }
        Promise.all(languagePromises)
        .then((responses) => { 
            let languages = [];
            for (let r of responses) {
                if (r.ok) languages.push(r.json())
            }
            Promise.all(languages)
            .then((resolved) => { 
                let languageTotals = {};
                for (langData of resolved) {
                    for (lang in langData) {
                        if (!languageTotals[lang]) {
                            languageTotals[lang] = 0
                        }
                        languageTotals[lang] += (langData[lang]); 
                    }
                }
                // console.log(languageTotals);
                let sum = 0;
                for (let l in languageTotals) { sum += languageTotals[l] }
                for (let l in languageTotals) {
                    let p = (languageTotals[l] / sum * 100).toFixed(0);
                    p = (p < 1 ? 1 : p) + '%'
                    let percent = document.getElementById(l);
                    let bar = document.getElementById(l + '-bar');
                    if (percent && bar) {
                        percent.innerHTML = p;
                        bar.style.width = p
                    } else {
                        //just for testing when not in project
                        document.write(l,' ', p);
                        document.write('<br>');
                    }
                }
            });
        });
    })
    .catch((e) => {
        console.log(e);
    });
}

// Add event listeners to project images
let projects = document.getElementsByClassName("card");
for (let p of projects) {
  let a = p.getElementsByTagName("a").item(0)
  p.addEventListener("click", function() { a.click(); })
}

// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
// https://hackernoon.com/a-beginners-guide-to-javascripts-the-intersection-observer-api-j8s32rb
const progressBars = document.querySelectorAll(".progress-bar");
for (el of progressBars) {
    const sectionObserver = new IntersectionObserver((el) => { 
        const [bar] = el;
        if (bar.isIntersecting) {
            bar.target.classList.remove('zero');
        } else {
            bar.target.classList.add('zero');
        } 
    }, { root: null, threshold: 0.3, rootMargin: "0" });
    sectionObserver.observe(el);
}