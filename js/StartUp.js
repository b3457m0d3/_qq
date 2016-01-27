'use strict';
require.config({
  locale: "en_ca",
  maps: { "*": { 'css': 'helpers/css' } },
  paths:{
   /*[Libraries]==================================================================================*/
    "jquery"       : "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
    "jquery-1-11-3": "http://code.jquery.com/jquery-1.11.3.min",//"lib/jquery",
    "bootstrap"    : "lib/bootstrap",//"https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
    "lodash"       : "lib/lodash",//"https://cdnjs.cloudflare.com/ajax/libs/lodash-compat/3.10.0/lodash",
    "underscore"   : "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
    "backbone"     : "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone-min",
    "Firebase"     : "https://cdn.firebase.com/js/client/2.0.3/firebase",
    "S"            : "https://cdn.rawgit.com/jprichardson/string.js/master/lib/string.min",
    "Velocity"     : "lib/Velocity",
   /*[Extensions]==================================================================================*/
    "associate"    : "ext/backbone-associate",  //define simple relations between Models & Collections
    "listenFor"    : "ext/backbone-listenFor",  //global event bus
    "BackboneFire" : "https://cdn.firebase.com/libs/backbonefire/0.5.1/backbonefire",  //online storage adapter
    "controller"   : "ext/backbone-controller", //one step closer to MVC
    "layoutManager": "ext/backbone.layoutmanager", //enhanced views with lifecycle mgmt and nested sub-views
    "stickit"      : "ext/backbone-stickit",  //view <-> model binding
    "keys"         : "ext/backbone-keys",  //keyboard event handler
    "localStore"   : "https://cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.1.16/backbone.localStorage-min", //offline storage adapter
    "V-UI"         : "ext/Velocity-ui", //animation & fx for DOM elements
    "_str"         : "https://cdnjs.cloudflare.com/ajax/libs/underscore.string/3.1.1/underscore.string.min",
    "jasny"        : "lib/jbs",
   /*[Helpers]=====================================================================================*/
    "text"         : "helpers/text",
    "json"         : "helpers/json",
    "json2"        : "helpers/json2",
    "i18n"         : "helpers/i18n",
    "b3457"        : "helpers/b3457.min",
    "moment"       : "helpers/moment",
  /*[Modules]=====================================================================================*/
    "X"             : "modules/_X",
    "layout"        : "modules/layout",
    "Transitionize" : "modules/Transitionize",
    "Switchery"     : "modules/Switchery",
  /*[#411]========================================================================================
  * If you wish to imply an intrinsic connection between components follow these naming conventions:
  * - model names begin with a lower-case letter  eg) "pet"
  * - collection names are plural                 eg) "pets"
  * - view names begin with a capital letter      eg) "Pet"
  * - templates should be named like models       eg) "pet.html"  /!\ notice that templates also have an extension
  ================================================================================================*/
/*[Backbone Components]==============================================================================*/
  /*[Models]======================================================================================*/
    "BaseModel"  : "models/BaseModel",
    "uiState"    : "models/uiState",
    "tab"        : "models/tab",
    "step"       : "models/step",
    "item"       : "models/item",
    "product"    : "models/product",
    "location"   : "models/location",
    "artWork"    : "models/artWork",
    "color"      : "models/color",
    "format"     : "models/format",
    "error"      : "models/error",
    "progress"   : "models/progressBar",
    "pager"      : "models/pager",
  /*[Collections]======================================================================================*/
    "tabs"      : "collections/tabs",
    "steps"     : "collections/steps",
    "stepList"  : "collections/stepList",
    "items"     : "collections/items",
    "locations" : "collections/locations",
    "artWorks"  : "collections/artWorks",
    "colors"    : "collections/colors",
    "sizes"     : "collections/sizes",
    "formats"   : "collections/formats",
    "errors"    : "collections/formErrors",
  /*[Collection Views]===========================================================================*/
    "Steps"          : "collectionViews/Steps",
    "Tabs"           : "collectionViews/Tabs",
  /*[Views]======================================================================================*/
    "BaseView"       : "views/BaseView",
    "BackForm"       : "views/BackForm",
    "Wizard"         : "views/Wizard",
    "ListView"       : "views/list/Main",
    "EmptyListView"  : "views/list/Empty",
    "ListItemView"   : "views/list/items/default",
    "ColorItem"      : "views/list/items/Color",
    "LocationItem"   : "views/list/items/Location",
    "Start"          : "views/Start",
    "Tab"            : "views/partials/Tab",
    "Step"           : "views/partials/Step",
    "Step1"          : "views/steps/1",
    "Step2"          : "views/steps/2",
    "Step3"          : "views/steps/3",
    "Step4"          : "views/steps/4",
    "ItemInfo"       : "views/partials/ItemInfo",
    "ControlBar"     : "views/partials/ControlBar",
    "Pager"          : "views/partials/Pager",
    "ProgressBar"    : "views/partials/ProgressBar",
  /*[Mixins]=======================================================================================*/
  /*[Plug-ins]==================================================================================*/
    "form"           : "https://cdnjs.cloudflare.com/ajax/libs/jquery.form/3.50/jquery.form.min",
    "fileinput"      : "plugins/fileinput.min",
    "jq-modal"       : "plugins/jq-modal",
  },
  shim: {
    'bootstrap'    : ["jquery"],
    'jasny'        : ["jquery","bootstrap"],
    'backbone'     : ["jquery","lodash"],
    'listenFor'    : ['backbone'],
    'controller'   : ['backbone'],
    'localStore'   : ['backbone'],
    'keys'         : ['backbone'],
  }
});
require(["app"], function(App){
  App.init();
});
