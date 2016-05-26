define(function (require, exports, module) {
    var Backbone = require('backbone');
    var _ = require('underscore');

    require("jquery.form");
    var Step1View = Backbone.View.extend({

        events: {
            'change input[type=file]': 'onChangeExcelFile'
        },

        initialize: function () {
            var type = this.model.get('type').charAt(0).toLowerCase() + this.model.get('type').substr(1);
            var self = this;
            require.async('./../template/' + type + '-step1.html', function (template) {
                self.render.call(self, _.template(template));
            });
        },

        render: function (template) {
            this.$el.html(template(this.model.toJSON()));
            var self = this;
            this.$el.find('form').attr('action', this.model.url + this.model.get('type')).ajaxForm({
                success: function (res) {
                    var status = res.status;
                    var eventListener = 'on' + status.charAt(0).toUpperCase() + status.substr(1);
                    if (Step1View.prototype.hasOwnProperty(eventListener)) {
                        self[eventListener](res);
                    }else {
                        throw new Error("UNKNOWN STATUS:" + status);
                    }
                },
                error: function (error) {
                    console.log('error:', error);
                }
            });
        },

        onChangeExcelFile: function (event) {
            var filename = $(event.currentTarget).val();
            if(filename === ''){
                return;
            }
            this.model.set('file', filename);
            this.$el.find('.filename').val(filename);
        },
        
        onDanger: function (data) {
            this.$el.find('.js-importer-message').addClass('alert-danger').html(data.message).removeClass('hidden');
        },
        
        onError: function (data) {
            Backbone.trigger('step2-error', data);
        },
        
        onSuccess: function (data) {
            Backbone.trigger('step2-success', data);
        }
    });

    module.exports = Step1View;
});
