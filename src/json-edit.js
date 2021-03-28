function animeSeperator(json_file, anime = {}){
    if(json_file.Nodes){
        var tags = ["normal", "shoujo", "shounen", "ecchi"]
        for (var key in json_file.Nodes) { 
            for (var x = 0; x < json_file.Nodes[key].length; x++) {
                    if (Array.isArray(json_file.Nodes[key][x])){
                    curr_array = json_file.Nodes[key][x]
                    var id = curr_array[1].replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, '-').toLowerCase();
                    if (!anime[id]){
                        var title = curr_array[1]
                        var desc = curr_array[0]
                        var img = null
                        var tag = "normal"
                        var changes = "false"
                        if (curr_array[2]){
                            img = curr_array[2]
                        }
                        if (curr_array[3]){
                            if (tags.indexOf(curr_array[3]) >= 0){
                                tag = curr_array[3]
                            } else {
                                changes = curr_array[3]
                            }
                            if(curr_array[4]){
                                if (tags.indexOf(curr_array[4]) >= 0){
                                    tag = curr_array[4]
                                } else {
                                    changes = curr_array[4]
                                }
                            }
                        }
                        anime[id] = {
                            "title":title,
                            "desc":desc,
                            "img":img,
                            "tags":{changes:changes, audience:tag}
                        }
                        }
                    json_file.Nodes[key][x] = id
                }
            } 
        }
        for (var key in json_file.Edges) { 
            if(Array.isArray(json_file.Edges[key])){
                var edgelist = {}
                for (var x = 0; x < json_file.Edges[key].length; x++) {
                    edgelist[json_file.Edges[key][x].Destination] = json_file.Edges[key][x]
                }
                json_file.Edges[key] = edgelist
            } 
        }
        return [json_file, anime]
    } else{
        return
    }
}