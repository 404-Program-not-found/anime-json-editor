console.log("Cards is being generated...");
const table = document.getElementById('recommends');
const button_table = document.getElementById('choices')
var json_file
var step_count
var datastr_main
var anime_file = {}
var modalWrap = null;
const {basename, sep} = require('path')
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

$(document).on("click", ".buttonChoices", function(){
    update_page(this.id, json_file)
})

$(window).on("keydown", function(event){
    if(event.key == "Enter") {
      event.preventDefault();
      if ($("#exampleModal").hasClass('show')) {
        $('#saveBtn').trigger('click');
      }
      return false;
    }
  });

$("#addBtn").on("click", function(){
    createModalAdd()
})

$("#deleteBtn").on("click",function(){
    var editbtn = $("#editBtn")
    $(".buttonChoices-disabled #buttonText").attr('contenteditable','false');
    editbtn.css("background-color", "#FFF");
    editbtn.css("border-color", "#FFF");
    editbtn.css("color", "#000")
    $(".card-editing").removeClass('card-editing');
    if($(this).css("backgroundColor") === 'rgb(255, 255, 255)' && json_file){
        $(".deletion").addClass('active-deletion').removeClass('deletion');
        $(".buttonChoices").addClass('buttonChoices-disabled').removeClass('buttonChoices');
        $(this).css("background-color", "#03a5fc");
        $(this).css("border-color", "#03a5fc");
        $(this).css("color", "#FFF")
        
    } else {
        $(".active-deletion").addClass('deletion').removeClass('active-deletion');
        $(".buttonChoices-disabled").addClass('buttonChoices').removeClass('buttonChoices-disabled');
        $(this).css("background-color", "#FFF");
        $(this).css("border-color", "#FFF");
        $(this).css("color", "#000")
    }
})

$("#editBtn").on("click",function(){
    $(".active-deletion").addClass('deletion').removeClass('active-deletion');
    var delbtn = $("#deleteBtn")
    delbtn.css("background-color", "#FFF");
    delbtn.css("border-color", "#FFF");
    delbtn.css("color", "#000")
    if($(this).css("backgroundColor") === 'rgb(255, 255, 255)' && json_file){
        $(".buttonChoices #buttonText").attr('contenteditable','true');
        $(".buttonChoices").addClass('buttonChoices-disabled').removeClass('buttonChoices');
        $(".card").addClass('card-editing')
        $(this).css("background-color", "#03a5fc");
        $(this).css("border-color", "#03a5fc");
        $(this).css("color", "#FFF")
    }else{
        $(".buttonChoices-disabled #buttonText").attr('contenteditable','false');
        $(".buttonChoices-disabled").addClass('buttonChoices').removeClass('buttonChoices-disabled');
        $(".card-editing").removeClass('card-editing');
        $(this).css("background-color", "#FFF");
        $(this).css("border-color", "#FFF");
        $(this).css("color", "#000")
    }
})

function editSave(target_dom){
    var hint_string = []
    const old_id = target_dom.id
    var new_tag = $('#tag-select').find(":selected").text();
    var change = $('#slowbuner').is(':checked').toString();
    var data_tags = {"normal":"normal", "shoujo":"shoujo border-info border-3 colored-border", "shounen":"shounen border-success border-3 colored-border", "ecchi":" ecchi border-danger border-3 colored-border"}
    var change_tags = {"true":"changes border-3", "false":"not-change"}
    var tooltip_tags = {"normal":"", "shoujo":"targets female audiences (usually include themes of romance and friendship)", "shounen":"targets male audiences (usually aims to be adventurous and energetic)", "ecchi":"contains mild NSFW content", "true":"contains a plot twist or a slow start", "false":""}
    var new_id = $('#IDInput').val()
    backgroundColor = data_tags[new_tag]
    hint_string.push(tooltip_tags[new_tag])
    hint_string.push(tooltip_tags[change])
    outline = (change_tags[change]); 
    document.getElementById(old_id).classList = "card deletion card-editing";
    document.getElementById(old_id).classList.add(...backgroundColor.split(" "));
    document.getElementById(old_id).classList.add(...outline.split(" "));
    if (new_tag !== anime_file[old_id].tags.audience){
        anime_file[old_id].tags.audience = new_tag
    } if (change !==anime_file[old_id].tags.changes){
        anime_file[old_id].tags.changes= change
    }
    if(document.getElementById(old_id).classList.contains("border-3")){
        const inline_hint = document.createElement('span');
        inline_hint.setAttribute("data-bs-toggle", "tooltip");
        inline_hint.className = "bi bi-question-circle";
        inline_hint.id = "tooltip";
        inline_hint.setAttribute("data-bs-placement", "bottom");
        inline_hint.setAttribute("data-bs-original-title", `This show ${hint_string.filter(item => item).join(" and ")}`);
        $(`#${old_id} .card-body #tooltip`).remove()
        $(`#${old_id} .card-body`).append(inline_hint);
    }
    if (target_dom.id !== new_id){
        anime_file[new_id] = anime_file[target_dom.id];
        delete anime_file[target_dom.id];
        json_file = JSON.parse(JSON.stringify(json_file).replace(target_dom.id, new_id))
        $(`#${target_dom.id}`).attr('id', new_id)
    }
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)})
}

function createModalEdit (target_dom){
    if(modalWrap !== null){
        modalWrap.remove()
    }
    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${target_dom.querySelector("#textTitle").textContent}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row g-3 align-items-center">
                        <div class="col-auto">
                            <label for="IDInput" class="col-form-label">ID</label>
                        </div>
                        <div class="col-auto">
                            <input id="IDInput" class="form-control" value=${target_dom.id}>
                        </div>
                    </div>
                    <div class="row g-3 align-items-center">
                        <div class="col-auto">
                            <label for="IDInput" class="col-form-label">Content Tag</label>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" id="tag-select"></select>
                        </div>
                    </div>
                    <div class="row g-3 align-items-center">
                        <div class="col-auto">
                            <label for="IDInput" class="col-form-label">Show Changes/Slow burner?</label>
                        </div>
                        <div class="col-auto">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="slowbuner">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveBtn">Save changes</button>
            </div>
            </div>
        </div>
    </div>
    `;
    var index = 1;
    for(element in ["normal", "shounen", "shoujo", "ecchi"]){
        var opt = document.createElement("option");
        opt.value= index;
        opt.innerHTML = ["normal", "shounen", "shoujo", "ecchi"][element]; // whatever property it hastar
        if (target_dom.classList.contains(opt.innerHTML)){
            var selectedIndex = index
        }
        // then append it to the select element
        if (target_dom.classList.contains("changes")){modalWrap.querySelector("#slowbuner").checked = true}
        modalWrap.querySelector("#tag-select").appendChild(opt);
        index++;
        }
    modalWrap.querySelector('#saveBtn').onclick = function() {editSave(target_dom);}
    document.getElementsByClassName('content')[0].append(modalWrap)
    modalWrap.querySelector("#tag-select").value = selectedIndex
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

function createModalAdd (){
    if(modalWrap !== null){
        modalWrap.remove()
    }
    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Element...</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <button type="button" class="btn btn-dark btn-small settings-btn"><i class="fas fa-id-badge"></i></button>
                <button type="button" class="btn btn-dark btn-small settings-btn"><i class="fas fa-link"></i></button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveBtn">Save changes</button>
            </div>
            </div>
        </div>
    </div>
    `;
    document.getElementsByClassName('content')[0].append(modalWrap)
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

$(document).on("input", ".editable", function(event) {
    const child_dom = event.target
    if (json_file){
        if(child_dom.parentElement.className == "card-body"){
            parent_id = child_dom.parentElement.parentElement.id
            const convert = {"textTitle":"title", "textDesc":"desc"}
            anime_file[parent_id][convert[child_dom.id]] = child_dom.textContent
        } else if (child_dom.id == "mainTitle"){
            json_file.Title[step_count] = child_dom.textContent
        } else if (child_dom.id == "buttonText"){
            json_file.Edges[step_count][child_dom.parentElement.id].Text = child_dom.textContent
        }
        
    }
    
});

$(document).on("click", ".active-deletion",function(event) {
    if (json_file){
        if(event.target.closest(".card")){
            var target_dom = event.target.closest(".card")
            id = target_dom.id
            delete json_file.Nodes[step_count][id]
        } else if(event.target.closest(".buttonChoices-disabled")){
            var target_dom = event.target.closest(".buttonChoices-disabled")
            delete json_file.Edges[step_count][target_dom.id]
        }
        target_dom.remove();
    }
    
});

$(document).on("click", ".card-editing", function(event) {
    if (json_file){
        var target_dom = event.target.closest(".card")
        console.log("clicked")
        createModalEdit(target_dom)
    }
    
});


$(document).on("click", ".header *",function(e) {
    e.stopPropagation();
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
            if (err) throw err;               console.log('Flowchart saved');
          }); 
        fs.writeFile(datastr_main[2].split(datastr_main[1])[0]+"anime.json", JSON.stringify(anime_file, null, 1), function (err) {
            if (err) throw err;               console.log('anime.json Saved');
          }); 
    }
})

ipcRenderer.on('print-file', (event, datastr) => {
  if(datastr[0].hasOwnProperty("Root")){
      try{
        fs.readFile(datastr[2].split(datastr[1])[0]+"anime.json", (err, data) => {
            if (!err) {
              anime_file = JSON.parse(data)
              } else {
                  anime_file = {}
              } 
        })
        var seperated = animeSeperator(datastr[0], anime_file)
        anime_file = seperated[1]
        console.log(datastr)
        step_count = datastr[0].Root
        json_file = seperated[0]
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
    
    var data_tags = {"normal":"normal", "shoujo":"shoujo border-info border-3 colored-border", "shounen":"shounen border-success border-3 colored-border", "ecchi":" ecchi border-danger border-3 colored-border"}
    var change_tags = {"true":"changes border-3", "false":"not-change"}
    var tooltip_tags = {"normal":"", "shoujo":"targets female audiences (usually include themes of romance and friendship)", "shounen":"targets male audiences (usually aims to be adventurous and energetic)", "ecchi":"contains mild NSFW content", "true":"contains a plot twist or a slow start", "false":""}
    const align = document.createElement("div")
    align.className = "col-md mb-5"
    const card = document.createElement('div');
    card.className = "card deletion";
    const cardBody = document.createElement("div");
    cardBody.className = "card-body"
    const textTitle = document.createElement("h5");
    textTitle.textContent = anime_file[parsed_value].title;
    textTitle.id = "textTitle"
    textTitle.className = "card-title editable"
    textTitle.contentEditable = "true"
    textTitle.spellcheck = "true"
    const topName = document.createElement("span");
    topName.textContent = anime_file[parsed_value].desc;
    topName.className="card-text editable"
    topName.id = "textDesc"
    topName.contentEditable = "true"
    topName.spellcheck = "true"
    var backgroundColor = data_tags.normal
    var outline = change_tags.false
    var hint_string = []
    backgroundColor = data_tags[anime_file[parsed_value].tags.audience]
    hint_string.push(tooltip_tags[anime_file[parsed_value].tags.audience])
    hint_string.push(tooltip_tags[anime_file[parsed_value].tags.changes])
    outline = (change_tags[anime_file[parsed_value].tags.changes]);
    card.classList.add(...backgroundColor.split(" "));
    card.classList.add(...outline.split(" "));
    if(anime_file[parsed_value].img){
    
    const bottomImage = document.createElement("img");
    fs.access(anime_file[parsed_value].img, fs.F_OK, (err) => {
        if (err) {
            var img_src
            if(!datastr_main[2].includes("img/")){
                img_src = "img/"+ anime_file[parsed_value].img
            }
            img_src = datastr_main[2].split(datastr_main[1])[0] + img_src
            bottomImage.src = img_src
        }else{
            bottomImage.src = anime_file[parsed_value].img;
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
    card.id = parsed_value
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
    button.innerHTML = `<span id="buttonText" class="editable">${text}</span>`
    button.className = `col-md mx-2 mb-5 px-3 deletion buttonChoices`
    button.querySelector('#buttonText').spellcheck = "true"
    button.id = destination
    return button

}

function generatePage(json_obj){
    $(".navbar-btn").css("background-color", "#FFF");
    $(".navbar-btn").css("border-color", "#FFF");
    $(".navbar-btn").css("color", "#000")
    var editbtn = $("#editBtn")
    editbtn.css("background-color", "#FFF");
    editbtn.css("border-color", "#FFF");
    editbtn.css("color", "#000")
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
