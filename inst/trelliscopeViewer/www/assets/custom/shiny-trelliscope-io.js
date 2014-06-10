function renderTemplate(objId, data, templateId) {
   // assumption is that element with objId="id" has associated template
   // content in an element named "id-template"
   // otherwise templateId needs to be provided
   templateId = (typeof templateId === "undefined") ? (objId + "-template") : templateId;
   var tmplObj = document.getElementById(templateId);
   var outObj = document.getElementById(objId);
   if(tmplObj) {
      if(outObj) {
         var templ = tmplObj.innerHTML;
         var output = Mustache.render(templ, data);
         outObj.innerHTML = output;
      } else {
         console.log("Warning: could not find element with id=" + objId + " in which to place rendered template output")
      }
   } else {
      console.log("Warning: could not find template for id=" + templateId + "-template")
   }
   
   // if there is a post-render function (useful for binding events 
   // to newly-renedered content), execute it
   var pr = $(outObj).data("post-render");
   if(pr) {
      if(window[pr])
         window[pr](data);
   }
}

var templateOutputBinding = new Shiny.OutputBinding();
$.extend(templateOutputBinding, {
   find: function(scope) {
      return $(scope).find(".shiny-template-output");
   },
   renderValue: function(el, data) {
      data = JSON.parse(data);
      if(data) {
         var objId = $(el).attr("id");
         // console.log(objId);
         // console.log(data);
         var templateId = $(el).data("template-id");
         if(!templateId)
            templateId = objId + "-template";
         // console.log("Rendering template '" + templateId + "' to element '" + objId + "'");
         Shiny.unbindAll(el);
         renderTemplate(objId, data, templateId);
         Shiny.bindAll(el);         
      } else {
         // if there is no data, empty the element
         $(el).html("");
      }
   }
});
Shiny.outputBindings.register(templateOutputBinding, "shiny.templateOutputBinding");


var d3outputBinding = new Shiny.OutputBinding();
$.extend(d3outputBinding, {
   find: function(scope) {
      return $(scope).find(".shiny-d3-output");
   },
   renderValue: function(el, data) {
      if(data) {
         data = JSON.parse(data);
         // console.log(data);
         var functionName = $(el).data("d3-fn");
         window[functionName](data, $(el).attr("id"));
         
         var callbackName = $(el).data("callback");
         if(callbackName) {
            if(window[callbackName])
               window[callbackName]();
         }
         
         // stop a spinner, if there is one...
         var spinner = $(el).data("spinner");
         if(spinner) {
            if(window[spinner])
               window[spinner].stop(document.getElementById($(el).attr("id")));
         }
      }
   }
});
Shiny.outputBindings.register(d3outputBinding, "shiny.d3outputBinding");


var myShinyDataInputBinding = new Shiny.InputBinding();
$.extend(myShinyDataInputBinding, {
   find: function(scope) {
      return $(scope).find(".shiny-my-data-input");
   },
   getValue: function(el) {
      return $(el).data("myShinyData");
   },
   setValue: function(el, value) {
      $(el).text(value);
   },
   subscribe: function(el, callback) {
      $(el).on("change.myShinyDataInputBinding", function(e) {
         callback();
      });
   },
   unsubscribe: function(el) {
      $(el).off(".myShinyDataInputBinding");
   }
});
Shiny.inputBindings.register(myShinyDataInputBinding);


var dataOutputBinding = new Shiny.OutputBinding();
$.extend(dataOutputBinding, {
   find: function(scope) {
      return $(scope).find(".shiny-my-data-output");
   },
   renderValue: function(el, data) {
      data = JSON.parse(data);
      $(el).data("myShinyData", data);
      
      var callbackName = $(el).data("callback");
      if(callbackName) {
         if(window[callbackName])
            window[callbackName]();
      }
   }
});
Shiny.outputBindings.register(dataOutputBinding, "shiny.dataOutputBinding");




var displaySelectInputBinding = new Shiny.InputBinding();
$.extend(displaySelectInputBinding, {
   find: function(scope) {
      return $(scope).find(".shiny-display-select-input");
   },
   getValue: function(el) {
      var row = $(el).find(".clicked");
      $(row).removeClass("clicked");
      if($(row).length == 0) {
         return null;
      } else {
         var res = $(row).data();
         console.log("Opened display: name=" + res.name + ", group=" + res.group);
         $("#openModal").modal("hide");
         
         return res;
      }
   },
   setValue: function(el, value) {
      $(el).text(value);
   },
   subscribe: function(el, callback) {
      $(el).on("click.displaySelectInputBinding", "tr", function(e) {
         $(this).addClass("clicked");
         callback();
      });
   },
   unsubscribe: function(el) {
      $(el).off(".displaySelectInputBinding");
   }
});
Shiny.inputBindings.register(displaySelectInputBinding);

