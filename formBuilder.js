(function(global, $) {
    class Field{
        constructor(name, label, type, order, validation, disabled, apply, className, width, value, options) {
            this.name = name;
            this.label = label;
            this.type = type;
            this.order = order;
            this.validation = validation;
            this.disabled = disabled;
            this.apply = apply;
            this.className = className;
            this.width = width;
            this.value = value;
            //this.slots = slots;
            this.options = options;
            //field.customProps = "onkeyup='' onchange=''";

            // column in which the field is placed
            // options for the radio and select
            //placeholder
            //prepend or append html content
            //custom props
            //default value
            //Some kind of callback like ajax
            //for file: allowed extensions
            //slots ${field.slots?.columnEnd ?? ""}
        }

        getName() { return this.label; }
        getLabel() { return this.label; }
        getType() { return this.type; }
        getOrder() { return this.order; }
        getValidation() { return this.validation; }
        getDisabled() { return this.disabled; }
        getApply() { return this.apply; }
        getClassName() { return this.className; }
        getWidth() { return this.width; }
        getValue() { return this.value; }
        //getSlots() { return this.slots; }
        //static getFromArray()
    }
    class Form{
        constructor(fields){
            this.validateFieldsConfig(fields);
            this.fields = fields.map(({
                name, 
                label, 
                type, 
                order, 
                validation, 
                disabled = false, 
                apply, 
                className = null,
                width = null, 
                value = null,
                options = []}) => new Field(
                    name, label, type, order, validation, disabled, apply, className, width, value, options));
        }
        
        getFields(){ return this.fields; }

        validateFieldsConfig(fields){
            for (let field of fields){
                if(typeof field.name !== 'string'){
                    throw new Error(`Invalid type for 'name' field: ${typeof field.name}`);
                }
                if(typeof field.label !== 'string'){
                    throw new Error(`Invalid type for 'label' field: ${typeof field.label}`);
                }
                if(typeof field.type !== 'string'){
                    throw new Error(`Invalid type for 'type' field: ${typeof field.type}`);
                }
                // Other validations
            }
        }
    }
    var FormBuilder = function() {

    };
    FormBuilder.prototype.validate = function(form) {

    }
    FormBuilder.prototype.validateHTML = function(html) {
        
    }
    FormBuilder.prototype.destroy = function(target) {
        $(target).empty();
    }
    FormBuilder.prototype.transformRadioOptions = function(radioClassName) {
        return function(option) { 
            return `<input type="radio" id="${option.name}-option" class="${radioClassName} ${option.className ?? ''}" onchange="${option.onChange}" ${field.checked ? "checked" : ""}>
            <label for="${option.name}-option">${option.label}</label>
            <br>`;
        }
    }
    FormBuilder.prototype.build = function(target, fields) {
        // add params: columns, name (for className also)
        //if ($) {
        try {
            const form = new Form(fields);
            const fieldsList = form.getFields();
            let html = "";
            let columns = 2;
            let maxRows = 6;
            let currentRow = 0;

            // Init form
            let colspan = 12/columns;
            //html = `<div class="col-sm-${colspan}">`;

            fieldsList.forEach(function(field, index, array) {
                if(currentRow == 0 && index !== array.length - 1){
                    html += `<div class="col-sm-${colspan}">`;
                    //currentRow++; //starts in 1
                }
                if(field.apply){
                    switch(field.type) {
                        case 'label':
                            html += `<div class="row" id="${field.name}-container">
                                        <div class="col-sm-${field.width || "12"}">
                                            <span id="${field.name}-label">${field.label}</span>
                                        </div>
                                    </div><br>`;
                            currentRow++;
                            break;
                        case 'text':case 'password':case 'number':case 'email':
                            html += `<div class="row" id="${field.name}-container">
                                        <span id="${field.name}-label">${field.label}</span>
                                        <div class="col-sm-${field.width || "12"}">
                                            
                                            <input type="${field.type}" class="form-control ${field.className || ""}" id="${field.name}" value="${field.value || ""}" ${ field.disabled ? "disabled" : "" }>
                                        </div>
                                    </div><br>`;
                            currentRow++;
                            break;
                            
                        case 'file':
                            html += `<div class="row" id="${field.name}-container">
                                        <span>${field.label}</span>
                                        <div class="col-sm-12">
                                            <input type="file" id="${field.name}">
                                        </div>
                                    </div><br>`;
                            currentRow++;
                            break;
                            
                        case 'radio':
                            html += `<div class="row" id="${field.name}-container">
                                        <span>${field.label}</span>
                                        <div class="col-sm-12">
                                            ${field.options?.map(this.transformRadioOptions(field.name + "-radio"))}
                                        </div>
                                    </div><br>`;
                            currentRow++;
                            break;
                            
                        case 'select':
                            html += `<div class="row" id="${field.name}-container">
                                        <span>${field.label}</span>
                                        <div class="col-sm-12">
                                            <select class="form-control" id="${field.name}" value="${field.value}"></select>
                                        </div>
                                    </div><br>`;
                            currentRow++;
                            break;
                            
                        case 'date':
                            html += `<div class="row"  id="${field.name}-container">
                                        <span>${field.label}</span>
                                        <div class="col-sm-12">
                                            <div class="input-group date">
                                                <input type="date" id="${field.name}" class="form-control" value="${field.value}">
                                            </div>
                                        </div>
                                    </div><br>`;
                            currentRow++;
                            break;
                            
                        case 'textarea':
                            html += `<div class="row" id="${field.name}-container">
                                        <span>${field.label}</span>
                                        <div class="col-sm-12">
                                            <textarea style="resize: none; height: 12vh;" class="form-control" maxlength="1000" id="${field.name}">${field.value}</textarea>
                                        </div>
                                    </div><br>`;
                            currentRow++;
                            break;
                            
                        case 'button':
                            html += `<div class="row" id="${field.name}-container">
                                        <div class="col-sm-12">
                                        <button id="${field.name}" class="btn ${field.className || ""}">${field.label}</button>
                                        </div>
                                    </div><br>`;
                            currentRow++;
                            break;
                        case 'custom':
                            html += `<div class="row" id="${field.name}-container">
                                        <div class="col-sm-12">
                                            ${field.customFieldHtml}
                                        </div>
                                    </div><br>`;
                            currentRow++;
                            break;
                    }
                } else {
                    currentRow++; //Keeps the number of rows consistent
                    // html += `<div class="row">
                    //             <div class="col-sm-12">
                    //             </div>
                    //         </div><br>`;
                }
                if(currentRow == maxRows + 1 || index === array.length - 1){ //Reached max rows or is last element in the array
                    html += `</div>`;
                    currentRow = 0;
                } // this condition outside of the apply if will cause insertion of an empty field
            });
            
            $(target).empty().append(html);

            console.log("Form", form);
        } catch (e) {
            console.error("There is a problem with one or more fields", e.message);
        }

        //} else { //no jquery fallback

        //}
    };

    global.FormBuilder = FormBuilder; // getting to the global scope
})(window, window.jQuery || null);

// var fb = new FormBuilder();
// let fields = [
//     { name: "file", label: "File", type: "file", order: 0, validation: null, disabled: true, apply: function() { return true } },
//     { name: "file", label: "File", type: "file", order: 1, validation: null, disabled: true, apply: function() { return true } },
//     { name: "file", label: "File", type: "file", order: 2, validation: null, disabled: true, apply: function() { return true } },
//     { name: "file", label: "File", type: "file", order: 3, validation: null, disabled: true, apply: function() { return true } },
//     { name: "file", label: "File", type: "file", order: 4, validation: null, disabled: true, apply: function() { return true } },
//     { name: "file", label: "File", type: "file", order: 5, validation: null, disabled: true, apply: function() { return true } },
//     { name: "file", label: "File", type: "file", order: 6, validation: null, disabled: true, apply: function() { return true } },
//     { name: "file", label: "File", type: "file", order: 7, validation: null, disabled: true, apply: function() { return true } },
//     { name: "file", label: "File", type: "file", order: 8, validation: null, disabled: true, apply: function() { return true } },
// ];
// fb.build(null, fields);
