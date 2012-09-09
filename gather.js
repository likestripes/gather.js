var gather = templates = data = bindings = views = ctas = {};

var event_types = ['click','mousemove','mouseup','mouseout','mouseover','mousedown','dblclick','keyup','keydown','keypress','unload','scroll','resize','load','error','abort','blur','change','focus','reset','select','submit','unload']; 
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
  
gather.views = function (set) {
  if(set == undefined)
    _.each(views, function (view, template){
      bindings['click'][view.ctas[0]] = function () { gather.switch(template); }
  });
  else
    _.each(set, function (template){
      gather.view(template,['thing'],['.cta-'+template]);
      bindings['click']['.cta-'+template] = function () { gather.switch(template); }
    });
  
  gather.bind_all();
}
  
gather.model = function (model, obj) { data[model] = obj; } 

gather.set = function (model, property, value) { 
  data[model][property] = value; 
} 

gather.return = function(html){ return html; }
  
gather.write = function(html){ document.write(html); } gather.apply = function (template, model, func, args){
  gather[func](_.template(template, model), args);
  gather.bind_all();
}
  
gather.each = function (template, model, func, args){
  _.each(model, function(obj) {
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
  $.post('https://ga.ther.co/token', thing, function(response,status){
    console.log(thing);
  });
}
