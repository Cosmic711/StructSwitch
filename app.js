let FS = require("fs");
let OBJECTS = "C:/objects";
let SCRIPTS = "C:/scripts";




let Parse_Files = function() {
	let root_path = PATH;
	let dirs = FS.readdirSync(root_path);
	
	for(let d = 0; d < dirs.length; d++) {
		let dir_path = dirs[d];
		let files_path = (root_path + '/' + dir_path);
		let files = FS.readdirSync(files_path);
		
		for(let f = 0; f < files.length; f++) {
			let file_name = files[f];
			let is_gml = (Get_Ext(file_name) === "gml"); 
			
			if (is_gml) { 
				let file_path = (files_path + '/' + file_name);
				Parse_File(file_path); 
			}
		}
		
		
	}
}

let Get_Ext = function(file_name) {
	let split = file_name.split('.');
	return (split[(split.length - 1)]);
}

let Var_Is_Struct = function(var_str) {
	let var_name = "";
	let index = 0;
	let end = var_str.length;
	
	for(let i = 0; i < end; i++) {
		let char = var_str[i];
		if (char === '=') { index = i; break; }
		else if (char != ' ') { var_name += char; }
	}
	
	let type = '';
	
	for(let i = (index + 1); i < end; i++) {
		let char = var_str[i];
		if (char != ' ') { type = char; break; }
	}
	
	if (type === '{') { return var_name; }
	else { return false; }
}

let Parse_File = function (file_path) {
	let file_data = FS.readFileSync(file_path, 'utf-8');
	let split = file_data.split("var");
	let structs = [];
	
	for(let i = 1; i < split.length; i++) {
		let var_str = split[i];
		let is_struct = Var_Is_Struct(var_str);
	}
	
	//for(let i = 0; i < data.length; i++) {
		//test = 
	//}
}

Parse_Files();


/* planned functionality:
local vars get turned into arrays, even more properties added 
(simply count how many times props are added, and init array)

for simplicity, object vars that change in size across scripts 
will not be converted to arrays 

any functions/constructors will be converted to arrays 

any usage of structs created by constructors will change to use array indicies

for example:

var my_struct = new Struct();
show_message(my_struct.a);

assuming Struct has one property (a), it will change to

show_message(my_struct[0]);

if Struct has a function:

var my_struct = new Struct();
my_struct.doStuff(1, 2, 3);

will become

my_struct[0](1, 2, 3);

in order for this to work I also need to temporarily replace macros 
*/

