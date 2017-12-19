'use strict';


// return whether the input is null OR undefined
window.isEmpty = function(v) {
    if(v === null || v === undefined) {
        return true;
    }

    return false;
};

$(function(){
    var App = Stapes.subclass({
        constructor: function() {
            this.setupFormIntercept();
        },

        setupFormIntercept: function() {
            // prevent normal form submissions, we'll handle them here
            $('form').on('submit', function(e){
                try {
                    var st = $(e.currentTarget).attr('data-form-type');

                    if(st === 'traditional') {
                        return;
                    }

                    this.submitForm(e);
                } catch(e) {
                    this.notify('Form Error: ' + e.message, 'error');
                }

                e.preventDefault();
            }.bind(this));
        },

        submitForm: function(event){
            var form = $(event.target);
            var formEl = form.get(0);
            var url = '';

            if (formEl.action && formEl.action.length > 0) {
                url = formEl.action;
            } else if (name = form.attr('name')) {
                url = '/api/' + name;
            } else {
                this.notify('Could not determine path to submit data to', 'error');
                return;
            }

            var createNew = true;
            var record = {};

            $.each(form.serializeArray(), function(i, field) {
                if(field.value == '' || field.value == '0'){
                    delete field['value'];
                }


                if(field.name == "_id"){
                    if(field.value){
                        createNew = false;
                    }

                    record['_id'] = field.value;
                }else if(!isEmpty(field.value)){
                    record[field.name] = field.value;
                }
            });

            $.ajax(url, {
                method: (form.attr('method') || (createNew ? 'POST' : 'PUT')),
                data:   record,
                success: function(){
                    var redirectTo = '/';

                    if (form.data('redirect-to')) {
                        redirectTo = form.data('redirect-to');
                    } else if (form.attr('name')) {
                        redirectTo = '/' + form.attr('name');
                    }

                    location.href = redirectTo;
                }.bind(this),
                error: this.showResponseError.bind(this),
            })
        },

        // show a notification alert bubble
        notify: function(message, type, details, config){
            $.notify($.extend(details, {
                'message': message,
            }), $.extend(config, {
                'type': (type || 'info'),
            }));
        },

        // show a notification bubble for response errors
        showResponseError: function(response){
            this.notify(response.responseText, 'danger', {
                'icon': 'fa fa-warning',
                'title': '<b>' +
                    response.statusText + ' (HTTP '+response.status.toString()+')' +
                    '<br />' +
                '</b>',
            });
        },
    });

    window.bop = new App();
});
