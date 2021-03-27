console.log("Cards is being generated...");
const table = document.getElementById('recommends');
const button_table = document.getElementById('choices')
var json_file
var step_count
var datastr_main
const {basename} = require('path')
const fs = require('fs')
const { ipcRenderer } = require('electron')

function editImage(target){
    var image_new = ipcRenderer.sendSync('change-img')
    if (image_new){
        target.src = image_new
        var parent_id = target.parentElement.id
        json_file.Nodes[step_count][parent_id][2] = basename(image_new)
        console.log(json_file)
    }
};

$('body').on("input", ".editable", function(event) {
    const child_dom = event.target
    if (json_file){
        if(child_dom.parentElement.className == "card-body"){
            parent_id = child_dom.parentElement.parentElement.id
            const convert = {"textTitle":0, "textDesc":1}
            json_file.Nodes[step_count][parent_id][convert[child_dom.id]] = child_dom.textContent
        } else if (child_dom.id == "mainTitle"){
            json_file.Title[step_count] = child_dom.textContent
        }
        
    }
    
});


window.onpopstate = function(event) {
    if (event.state == null){
        step_count = json_file.Root;
        generatePage(json_file)}
    else if(event.state.step_destination){
            step_count = event.state.step_destination;
            generatePage(json_file)
    }
  };

ipcRenderer.on('save-file', (event) => {
    if (json_file && datastr_main){
        fs.writeFile(datastr_main[2], JSON.stringify(json_file, null, 1), function (err) {
            if (err) throw err;               console.log('Results Received');
          }); 
    }
})

ipcRenderer.on('print-file', (event, datastr) => {
  if(datastr[0].hasOwnProperty("Root")){
      try{
        console.log(datastr)
        step_count = datastr[0].Root
        json_file = datastr[0]
        datastr_main = datastr
        generatePage(datastr[0])
      } catch{
        snackBarShow()
      }
  } else{
    snackBarShow()
  }
})

function snackBarShow() {
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function(toastEl) {
    // Creates an array of toasts (it only initializes them)
      return new bootstrap.Toast(toastEl) // No need for options; use the default options
    });
   toastList.forEach(toast => toast.show()); 
};
  

function createCard(parsed_value, key) {
    
    var data_tags = {"normal":"normal", "shoujo":"border-info border-3 colored-border", "shounen":"border-success border-3 colored-border", "ecchi":"border-danger border-3 colored-border"}
    var change_tags = {"true":"changes border-3", "false":"not-change"}
    var tooltip_tags = {"normal":"", "shoujo":"targets female audiences (usually include themes of romance and friendship)", "shounen":"targets male audiences (usually aims to be adventurous and energetic)", "ecchi":"contains mild NSFW content", "true":"contains a plot twist or a slow start", "false":""}
    const align = document.createElement("div")
    align.className = "col-md mb-5"
    const card = document.createElement('div');
    card.className = "card";
    const cardBody = document.createElement("div");
    cardBody.className = "card-body"
    const textTitle = document.createElement("h5");
    textTitle.textContent = parsed_value[0];
    textTitle.id = "textTitle"
    textTitle.className = "card-title editable"
    textTitle.contentEditable = "true"
    textTitle.spellcheck = "true"
    const topName = document.createElement("span");
    topName.textContent = parsed_value[1];
    topName.className="card-text editable"
    topName.id = "textDesc"
    topName.contentEditable = "true"
    topName.spellcheck = "true"
    var backgroundColor = data_tags.normal
    var outline = change_tags.false
    var hint_string = []
    if (data_tags[parsed_value[3]] || data_tags[parsed_value[4]]){
        var i = data_tags[parsed_value[3]] ? parsed_value[3]:parsed_value[4]
       backgroundColor = data_tags[i]
       hint_string.push(tooltip_tags[i])
    };
    if (change_tags[parsed_value[4]] || change_tags[parsed_value[3]]){
        var i = change_tags[parsed_value[3]] ? parsed_value[3]: parsed_value[4];
        outline = (change_tags[i]);
        hint_string.push(tooltip_tags[i]);
    };
    card.classList.add(...backgroundColor.split(" "));
    card.classList.add(...outline.split(" "));
    if(parsed_value[2]){
    
    const bottomImage = document.createElement("img");
    fs.access(parsed_value[2], fs.F_OK, (err) => {
        if (err) {
            var img_src
            if(!datastr_main[2].includes("img/")){
                img_src = "img/"+ parsed_value[2]
            }
            img_src = datastr_main[2].split(datastr_main[1])[0] + img_src
            bottomImage.src = img_src
        }else{
            bottomImage.src = parsed_value[2];
        }})
    bottomImage.className = "card-img-top"
    bottomImage.setAttribute("ondblclick", "editImage(this)")
    bottomImage.id = "bottomImage";
    card.append(bottomImage);
}
    cardBody.append(textTitle);
    cardBody.append(topName);
    if(card.classList.contains("border-3")){
        const inline_hint = document.createElement('span');
        inline_hint.setAttribute("data-bs-toggle", "tooltip");
        inline_hint.className = "bi bi-question-circle";
        inline_hint.id = "tooltip";
        inline_hint.setAttribute("data-bs-placement", "bottom");
        inline_hint.setAttribute("data-bs-original-title", `This show ${hint_string.filter(item => item).join(" and ")}`);
        cardBody.append(inline_hint);
    }
    card.append(cardBody)
    card.id = key
    align.appendChild(card) 
    return align
}

function update_page(destination, json_obj){
    if (step_count == json_file.Root){
        history.pushState({"step":step_count, "step_destination":step_count}, "", window.location);
    }
    history.pushState({"step":step_count, "step_destination":destination}, "", window.location);
    console.log({"step":step_count});
    step_count = destination;
    generatePage(json_obj);

}

function back(){
    console.log(history.state)
    history.back();
}

function createButton(text, destination, json_obj){
    const button = document.createElement('button');
    button.textContent = text
    button.onclick = function() {update_page(destination, json_obj)};
    button.className = `col-md mx-2 mb-5 px-3 editable ${destination}`
    button.contentEditable = "true"
    button.spellcheck = "true"
    button.id = "buttonChoices" 
    return button

}

function generatePage(json_obj){
    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }
    while (button_table.hasChildNodes()) {
        button_table.removeChild(button_table.lastChild);
    }
    var step_dict = step_count in json_obj["Nodes"]? json_obj["Nodes"][step_count]:NaN
    var step_edges = step_count in json_obj["Edges"]? json_obj["Edges"][step_count]:NaN
    if(step_dict != NaN){
        const rowDiv = document.createElement('div')
        rowDiv.className = "row"
        for (var i in step_dict){
        rowDiv.appendChild(createCard(step_dict[i], i))
    }
    table.appendChild(rowDiv)
}   
    const backBtn = document.getElementById("backBtn")
    if(step_count != json_obj.Root){
        backBtn.onclick = function() {back()};
        if(backBtn.classList.contains("disabled")){backBtn.classList.remove("disabled");}
    }
    else{
        if(!backBtn.classList.contains("disabled")){backBtn.classList.add("disabled");}
    }
    if(step_edges != NaN){
        const rowDiv = document.createElement('div')
        rowDiv.className = "d-grid gap-2 d-md-block"
        for (var key in step_edges){
        rowDiv.appendChild(createButton(step_edges[key]["Text"], step_edges[key]["Destination"], json_obj));
    }
    button_table.appendChild(rowDiv)
}
    document.getElementById("mainTitle").innerHTML = null
    if(json_obj["Title"][step_count]){
        document.getElementById("mainTitle").innerHTML = json_obj["Title"][step_count].replace(/(\r\n|\r|\n)/g, '<br>');
    };
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})
    
}
