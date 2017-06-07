(function($){

    "use strict";

    var pluginName = 'fullscreen',
        PluginClass;


    /* Enter PluginOptions */
    $[pluginName+'Default'] = {
        enabled: true,
        container: window,
        isHtml: false,

        onchange: function() {}
    };

    PluginClass = function() {

        var selfObj = this;
            
        this.initOptions = new Object($[pluginName+'Default']);

        this.item = false;

        this.init = function(elem) {
            selfObj = this;

            if(!this.container)
                this.container = 'body';
            this.elem = elem;
            this.item = $(this.elem);
            this.container = $(this.container);
            this.isHTML = selfObj.item[0].tagName.toLowerCase() === 'html';

            this.loaded();
        };

        this.disable = function() {
            selfObj.enabled = false;
        };

        this.enable = function() {
            selfObj.enabled = true;
        };


        this.toggleFullscreen = function() {
            selfObj.item.toggleClass('open');
            selfObj.container.toggleClass('fullscreen');
            selfObj.onchange();
        };

        this.loadInFullscreen = function() {
            var el = $(selfObj.container)[0];

            if(!selfObj.item.is('.open')) {
                el.requestFullscreen = (function() {
                    return el.requestFullscreen ||
                        el.webkitRequestFullscreen ||
                        el.mozRequestFullScreen ||
                        el.msRequestFullscreen;
                })();

                el.requestFullscreen();
            } else {
                document.exitFullscreen = (function() {
                    return document.exitFullscreen ||
                        document.webkitExitFullscreen ||
                        document.mozCancelFullScreen ||
                        document.msExitFullscreen;
                })();
                document.exitFullscreen();
            }
        };

        this.loaded = function() {

            selfObj.item.click(selfObj.loadInFullscreen);

            if(document.body.requestFullscreen !== undefined) {
                document.addEventListener("fullscreenchange", selfObj.toggleFullscreen);
            }
            if(document.body.webkitRequestFullscreen !== undefined) {
                document.addEventListener("webkitfullscreenchange", selfObj.toggleFullscreen);
            }
            if(document.body.mozRequestFullScreen !== undefined) {
                document.addEventListener("mozfullscreenchange", selfObj.toggleFullscreen);
            }
            if(document.body.msRequestFullscreen !== undefined) {
                document.addEventListener("MSFullscreenChange", selfObj.toggleFullscreen);
            }
        };
    };

    $[pluginName] = $.fn[pluginName] = function(settings) {
        var element = typeof this === 'function'?$('html'):this,
                newData = arguments[1]||{},
                returnElement = [];
                
        returnElement[0] = element.each(function(k,i) {
            var pluginClass = $.data(this, pluginName);

            if(!settings || typeof settings === 'object' || settings === 'init') {

                if(!pluginClass) {
                    if(settings === 'init')
                        settings = arguments[1] || {};
                    pluginClass = new PluginClass();

                    var newOptions = new Object(pluginClass.initOptions);

                    if(settings)
                        newOptions = $.extend(true,{},newOptions,settings);
                    pluginClass = $.extend(newOptions,pluginClass);
                    /** Initialisieren. */
                    this[pluginName] = pluginClass;
                    pluginClass.init(this);
                    if(element.prop('tagName').toLowerCase() !== 'html') {
                        $.data(this, pluginName, pluginClass);
                    } else returnElement[1] = pluginClass;
                } else {
                    pluginClass.init(this,1);
                    if(element.prop('tagName').toLowerCase() !== 'html') {
                        $.data(this, pluginName, pluginClass);
                    } else returnElement[1] = pluginClass;
                }
            } else if(!pluginClass) {
                return;
            } else if(pluginClass[settings]) {
                var method = settings;
                returnElement[1] = pluginClass[method](newData);
            } else {
                return;
            }
        });

        if(returnElement[1] !== undefined) return returnElement[1];
            return returnElement[0];
    };

})(jQuery);
