let FS = require("fs");
let OBJECTS = "C:/objects";
let SCRIPTS = "C:/scripts";

let Parse_Files = function() {
	let root_path = SCRIPTS;
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
				Parse_Script(file_path); 
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

let Get_Var = function(code, equal_sign) {
	let char = '';
	let name = "";
	let name_start = -1;
	let name_end = -1;
	
	for(let i = (equal_sign - 1); i >= 0; i--) {
		char = code[i];
		if (char != ' ') { name_end = i; break; }
	}
	
	if (name_end < 1) { return false; }
	
	for(let i = (name_end - 1); i >= 0; i--) {
		char = code[i];
		if (char == ' ') { name_start = (i + 1); break; }
	}
	
	if (name_start < 0) { return false; }
	
	for(let i = name_start; i <= name_end; i++) {
		char = code[i];
		name += char;
	}
	
	return name;
}

let Parse_Script = function(script_path) {
	let code = FS.readFileSync(script_path, 'utf-8');
	let scope = 0;
	let data = [{}];
	
	let word = "";
	let char = '';
	let equal_sign = false;
	
	for(let i = 0; i < code.length; i++) {
		char = code[i];
		if (char != ' ') { 
			if ((char === '{') && (equal_sign)) { 
				let structs = data[scope];
				let struct = Get_Var(code, equal_sign); 
				if (struct) { structs[struct] = new Struct(); }
				equal_sign = false;
			}
			
			word += char; 
		}
		
		else { 
			if (word === "function") { 
				scope++;
				if (data.length < (scope + 1)) { data.push({}); }
			}
			
			word = "";
		}
		
		if (char === '=') { equal_sign = i; }	
	}
	
	console.log(data);
	
	
	//for(let i = 0; i < data.length; i++) {
		//test = 
	//}
}

function Struct() {
	this.valid = true;
	this.size = 0;
}


Parse_Files();




