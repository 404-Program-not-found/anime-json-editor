console.log("Cards is being generated...");
const table = document.getElementById('recommends');
const button_table = document.getElementById('choices')
var element = document.querySelector('meta[name~="jsonDoc"]');
var content = element && element.getAttribute("content");
var json_file
var step_count
var history = []
var datastr_main
const fs = require('fs')
const { ipcRenderer } = require('electron')

function reqListener () {
    json_file = JSON.parse(this.responseText);
    step_count = json_file.Root
    generatePage(json_file)
}

$(".card-img-top").on("click", function(event){
    var img_target = $(event.target)
    dialog.showOpenDialog(
        {
        properties: ['openFile'],
        filters:[
          {name:"Images", extensions:["png", "jpg", "jpeg"]}
        ] 
        }).then(result => {
          if (result.canceled === false) {
            fs.readFile(result.filePaths[0], (err, data) => {
            if (!err) {
              img_target.src = result.file
              }
            })
          } 
        }).catch(err => {
          console.log(err)
        });
})

window.onpopstate = function(event) {
    if (event.state == null){
        step_count = json_file.Root;
        generatePage(json_file)}
    else if(event.state.step_destination){
            step_count = event.state.step_destination;
            generatePage(json_file)
    }
  };

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
  

function createCard(parsed_value) {
    
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
    const topName = document.createElement("span");
    topName.textContent = parsed_value[1];
    topName.class="card-text editable"
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
            if(!parsed_value[2].includes("img/")){
                parsed_value[2] = "img/"+ parsed_value[2]
            }
            parsed_value[2] = datastr_main[2].split(datastr_main[1])[0] + parsed_value[2]
            bottomImage.src = parsed_value[2];
        }else{
            bottomImage.src = parsed_value[2];
        }})
    bottomImage.className = "card-img-top"
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
    button.className = "col-md mx-2 mb-5 px-3 editable"
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
        rowDiv.appendChild(createCard(step_dict[i]))
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
