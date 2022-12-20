// const opt = {headers: {'Authorization': 'token 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'}}
const opt = {};
const username = 'trunten';
let apiUrl = `https://api.github.com/users/${username}/repos`;

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
                let p = (languageTotals[l] / sum * 100).toFixed(0) + '%';
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

window.addEventListener('scroll', () => { 
  const progressBars = document.querySelectorAll('.progress-bar');
  progressBars.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop <= (window.innerHeight || document.documentElement.clientHeight)) {
        el.classList.remove('zero');
    } else if (elementTop > (window.innerHeight || document.documentElement.clientHeight)) {
        el.classList.add('zero')
    }
  })
});