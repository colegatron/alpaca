(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.FileField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.FileField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class File control with nice custom styles.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {
            this.base();            
            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldFile");
        },
                
        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(value) {
            // be sure to call into base method
            // We won't be able to actually set the value for file input field so we use the mask input
            var tmp = this.field;
            this.field = $('.alpaca-filefield-control',this.fieldContainer);
            this.base(value);

            // switch it back to actual file input
            this.field = tmp;
        },
        
        /**
         * @see Alpaca.Fields.TextField#postRender
         */
            // TODO; Set a procedure to be able to :
            // - set the file content in edit mode
            // - edit the file content in some way. Probably it would be fine to show a template
            //   which shows a input file control to upload a new image, show also the current image
            //   in a 100x100 thunmail and a checkbox to mark it as deleted (to be able to delete without
            //   uploading a new one).
            // - Set a method to handle the checkbox input for deletion
        postRender: function() {
            this.base();
            // apply additional css
            if (this.fieldContainer) {
                this.fieldContainer.addClass("alpaca-controlfield-file");
            }
            var thelement = this;
            // The file data is accesible once the onchange evt is fired
            this.field[0].onchange = function(evt) {
                var reader = new FileReader();
                reader.onload=(function(evt2) {
                    var dataUri = evt2.target.result;
                    // If I set the value, it does nothing. Not sure how Api works and I've not more
                    // spare time.
                    //this.setValue(dataUri);
                    // Overriding the getValue method you get the image data and can be stored on backend
                    // You loose the filename, but usually an image named fieldname should be fine, because
                    // in the backend you know which field refers to and which data type it is looking into
                    // the dataUri
                    thelement.getValue = function() { return dataUri; }

                });
                if ( this.files ) {
                    reader.readAsDataURL(this.files[0]);
                }
            };
        },//__BUILDER_HELPERS
		
		/**
         * @see Alpaca.Fields.TextField#getTitle
		 */
		getTitle: function() {
			return "File Field";
		},
		
		/**
         * @see Alpaca.Fields.TextField#getDescription
		 */
		getDescription: function() {
			return "Field for uploading files.";
		},

		/**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "file";
        }//__END_OF_BUILDER_HELPERS
    });
    
    Alpaca.registerTemplate("controlFieldFile", '<input type="file" id="${id}" {{if options.size}}size="${options.size}"{{/if}} {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerFieldClass("file", Alpaca.Fields.FileField);
})(jQuery);
