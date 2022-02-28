numQs = 0;
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

getLS = (tag,) => localStorage["mq-" + tag] ? JSON.parse(localStorage["mq-" + tag]) : undefined
setLS = (tag, val) => localStorage.setItem("mq-" + tag, JSON.stringify(val))
removeLS = (tag) => localStorage.removeItem("mq-" + tag)

addQ = (text, editDist, addToDB) => {
    if (addToDB && !getLS('qs').some(question => question.q == text)) {
        arr = getLS('qs')
        arr.push({ 'q': text, 'dist': editDist })
        setLS('qs', arr)
    }
    qNo = numQs + 1;
    numQs += 1;
    content = getLS('qs-user') ? escapeHtml(getLS('qs-user')[qNo - 1] || "") : ''
    element = ` <tr>
    <td>`+ qNo + `</td>
    <td>`+ editDist + `</td>
    <td>`+ text + `</td>
    <td><textarea class="math" rows="2" id="q`+ qNo + `">` + (content) + `</textarea></td>
    <td id="ans`+ qNo + `"></td>
</tr>`
    $("#mqtable tr:last").after(element)
    $("#q" + qNo).on('input', async (event) => {
        $("#ans" + event.target.id.substr(1)).html('<div class="loadercontainer"><div class="loader">Loading...</div></div>')
        await maybe_submit()
    })
    if (qNo > 1) {
        $("#col2head").text("Edit Dist")
    }
}



function reset() {
    removeLS('qs');
    removeLS('rules');
    removeLS('qs-user');
    window.location.reload();
}

window.onload = async () => {
    document.getElementById('mq-reset')?.addEventListener('click', reset);
    if (getLS('qs') === undefined) {
        setLS('qs', [{
            'q': "Write a math question whose answer is 6.", 'dist': ""
        }])
        setLS('rules', [])
    }
    getLS('qs').forEach(q => addQ(q['q'], q['dist'], false))
    getLS('rules').forEach(rule => $("#rules").append("<li>" + rule + "</li>"))
    await maybe_submit()
}
// TODO: persist answers over refresh

getQs = () => {
    res = []
    for (i = 1; i <= numQs; i++) {
        res.push($("#q" + i)[0].value)
    }
    return res
}

assignGrades = (answers) => answers.forEach((answer, index) => {
    if (answer === 'correct') {
        grade = '✅'
        explanation = "This is a good question."
    } else if (answer === 'malformed') {
        grade = '❗'
        explanation = "This question doesn't make sense."
    } else if (answer === 'incorrect') {
        grade = '❌'
        explanation = "This is question does not satisfy the constraints provided."
    } else if (answer === 'edit') {
        grade = '🚕'
        explanation = "This question is too different from the previous one. You'll confuse the students!"
    } else {
        grade = '🥴'
        explanation = "This shouldn't happen."
    }
    $("#ans" + (index + 1)).html("<span title=\"" + explanation + "\">" + grade + "</span>")
})

async function submit() {
    setLS('qs-user', getQs())
    let res = mock_fetch(getQs());

    if (res['error']) {
        alert(res['error'])
        return
    }
    assignGrades(res['answers'])
    if (res['newq']) {
        newQ = res['newq']
        addQ(newQ.q, newQ.dist, true)
        if (newQ.rules) {
            newQ.rules.forEach(rule => {
                rules = getLS('rules')
                if (!rules.includes(rule)) {
                    rules.push(rule)
                    $("#rules").append("<li>" + rule + "</li>")
                    setLS('rules', rules)
                }
            })
            if (newQ.rules.length > 0) {
                alert("There\u2019s a new rule\u2014make sure to check above and look it over before writing your next question!")
            }
        }
    }
    if (res['students']) {
        $("#aftermq").html(res['students'])
    }
}


waiting = false;
time_left = 0;
async function maybe_submit() {
    if (waiting) {
        return;
    }
    if (time_left) {
        waiting = true;
        return;
    }
    r = $('#r')
    if (r) {
        r.html("<p><i>These results may not exactly reflect the current questions above.</i></p>")
    }
    await submit();
    time_left = 2;
}
setInterval(async () => {
    if (time_left) {
        time_left -= 1
        return
    } else if (waiting) {
        await submit();
        time_left = 1;
        waiting = false;
    }
}, 500)
