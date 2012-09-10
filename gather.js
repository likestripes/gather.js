var gather = {};
var templates = {};
var data = {};
var bindings = {};
var views = {};

var event_types = ['models', 'click','mousemove','mouseup','mouseout','mouseover','mousedown','dblclick','keyup','keydown','keypress','unload','scroll','resize','load','error','abort','blur','change','focus','reset','select','submit','unload']; 
_.each(event_types, function (type) { bindings[type] = {}; }); gather.bind_all = function () {
  _.each(bindings, function (events, type) {
    _.each(events, function (func, selector) {
      $(selector).on(type, func);
    });
  });
}


gather.view = function (template, models, ctas) {
  views[template] = {};
  views[template]['ctas'] = ctas;
  views[template]['models'] = models;
  _.each(models, function (model) {
    if (bindings['models'][model] == undefined)
      bindings['models'][model]=[];
    if (bindings['models'][model].indexOf(template) == -1)
      bindings['models'][model].push(template);
    
  });
}

gather.switch = function (view) {
  if( $("#"+view).length == 0){
    $('body').append('<div id='+view+' ></div>');
    $('#'+view).addClass('pad-top-20, container');
    gather.apply(gather.template(view), data[views[view].models[0]], 'html',view);
  }else{
    gather.apply(gather.template(view), data[views[view].models[0]], 'html',view);
  }
  $(".container").css('display','none');
  $("#"+view).css('display','block');
}
  
gather.views = function(set,models) {
  if (models == undefined) models =['empty'];
  if(set == undefined)
    _.each(views, function (view, template){
      bindings['click'][view.ctas[0]] = function () { gather.switch(template); }
  });
  else
    _.each(set, function (template){
      gather.view(template,models,['.cta-'+template]);
      bindings['click']['.cta-'+template] = function () { gather.switch(template); }
    });
  
  gather.bind_all();
}
  
gather.model = function (model, obj) { data[model] = obj; } 

gather.set = function (model, property, value) { 
  data[model][property] = value; 
  if (bindings['models'][model] != undefined){
    _.each(bindings['models'][model], function (template){
      if ($('#'+template).length > 0){
        gather.apply(gather.template(template),data[model],'html',template); 
      }
    });
  }
} 

gather.apply = function (template, model, func, args){
  gather[func](_.template(template, model), args);
  gather.bind_all();
}
  
gather.apply_many = function (template, many, func, args){
  _.each(many, function(obj) {
    gather[func](_.template(template, obj), args);
    gather.bind_all();
  });
}

gather.generic = function(html, el) {
  $('#'+args[0])[args[1]](html);
}

gather.append = function(html, el) {
  $('#'+el).append(html);
}

gather.prepend = function(html, el) {
  $('#'+el).prepend(html);
}
  
gather.html = function(html, el) {
  $('#'+el).html(html);
}

gather.template = function(name){
  if (templates[name] != undefined) return templates[name];
  
  settings = {
    url:'/templates/'+name,
    success: function(data, status, xhr){
      templates[name] = data;
    },
    async:0
  }
  ajax = $.ajax(settings);
  return templates[name]
}
  
gather.save = function(thing){
  settings = {
    type:'POST',
    url:'/token',
    data:thing,
    dataType:'json',
    success: function(data, status, xhr){
      console.log(thing);
    },
    async:0
  };
  ajax = $.ajax(settings);
}
  
gather.model('empty');