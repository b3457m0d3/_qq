(function(window, factory) {
  "use strict";
  if(typeof define === "function" && define.amd) define(["backbone","X","jquery","stickit","listenFor"], function(){ return factory.apply(window,arguments);});
  else factory.call(window, window.Backbone, window._, window.Backbone.$);
}(typeof global === "object" ? global : this, function(Backbone, _, $, Stickit) {
  "use strict";
  var window = this;
  var ViewConstructor = Backbone.View;
  var aPush = Array.prototype.push;
  var aConcat = Array.prototype.concat;
  var aSplice = Array.prototype.splice;
  var trim = String.prototype.trim ? _.bind(String.prototype.trim.call, String.prototype.trim) : $.trim;
  var LayoutManager = Backbone.View.extend({
    //mixins: ['template'],
    _render: function() {
      var view = this;
      var manager = view.__manager__;
      var beforeRender = view.beforeRender;
      var def = view.deferred();

      if (view.hasRendered) {
        view._removeViews();
      }

      manager.callback = function() {
        delete manager.isAsync;
        delete manager.callback;
        view.trigger("beforeRender", view);
        view._viewRender(manager).render().then(function() {
          def.resolve();
        });
      };
      if (beforeRender) {
        var ret = beforeRender.call(view, view);
        if (ret && ret.then) {
          manager.isAsync = true;
          ret.then(function() {
            manager.callback();
            def.resolve();
          }, def.resolve);
        }
        if (ret === false) {
          return def.resolve();
        }
      }
      if (!manager.isAsync) {
        manager.callback();
      }
      return def.promise();
    },
    _applyTemplate: function(rendered, manager, def) {
      // Actually put the rendered contents into the element.
      if (_.isString(rendered)) {
        // If no container is specified, we must replace the content.
        if (manager.noel) {
          rendered = $.parseHTML(rendered, true);

          // Remove extra root elements.
          this.$el.slice(1).remove();

          // Swap out the View on the first top level element to avoid
          // duplication.
          this.$el.replaceWith(rendered);

          // Don't delegate events here - we'll do that in resolve()
          this.setElement(rendered, false);
        } else {
          this.html(this.$el, rendered);
        }
      }

      // Resolve only after fetch and render have succeeded.
      def.resolveWith(this, [this]);
    },
    _viewRender: function(manager) {
      var url, contents, def, root = this;
      function done(context, template) {
        var rendered;
        manager.callback = function(rendered) {
          delete manager.isAsync;
          delete manager.callback;
          root._applyTemplate(rendered, manager, def);
        };
        LayoutManager.cache(url, template);
        if (template) {
          rendered = root.renderTemplate.call(root, template, context);
        }
        if (!manager.isAsync) {
          root._applyTemplate(rendered, manager, def);
        }
      }
      return {
        render: function() {
          var context = root.serialize;
          var template = root.template;
          def = root.deferred();
          if (_.isFunction(context)) {
            context = context.call(root);
          }
          manager.callback = function(contents) {
            delete manager.isAsync;
            delete manager.callback;
            done(context, contents);
          };
          if (typeof template === "string") {
            url = root.prefix + template;
          }
          if (contents = LayoutManager.cache(url)) {
            done(context, contents, url);
            return def;
          }
          if (typeof template === "string") {
            contents = root.fetchTemplate.call(root, root.prefix + template);
          } else if (typeof template === "function") {
            contents = template;
          } else if (template != null) {
            contents = root.fetchTemplate.call(root, template);
          }
          if (!manager.isAsync) {
            done(context, contents);
          }
          return def;
        }
      };
    },
    constructor: function Layout(options) {
      this.manage = true;
      _.extend(this, options);
      Backbone.View.apply(this, arguments);
    },
    async: function() {
      var manager = this.__manager__;
      manager.isAsync = true;
      return manager.callback;
    },
    promise: function() {
      return this.__manager__.renderDeferred.promise();
    },
    then: function() {
      return this.promise().then.apply(this, arguments);
    },
    renderViews: function(views) {
      var manager = this.__manager__;
      var newDeferred = this.deferred();
      if (views && _.isArray(views)) {
        views = _.chain(views);
      } else {
        views = this.getViews(views);
      }
      var promises = views.map(function(view) {
        return view.render().__manager__.renderDeferred;
      }).value();
      manager.renderDeferred = newDeferred.promise();
      this.when(promises).then(function() {
        newDeferred.resolveWith(this, [this]);
      });
      return this;
    },
    insertView: function(selector, view) {
      if (view) {
        return this.setView(selector, view, true);
      }
      return this.setView(selector, true);
    },
    insertViews: function(views) {
      // If an array of views was passed it should be inserted into the
      // root view. Much like calling insertView without a selector.
      if (_.isArray(views)) {
        return this.setViews({ "": views });
      }

      _.each(views, function(view, selector) {
        views[selector] = _.isArray(view) ? view : [view];
      });

      return this.setViews(views);
    },
    getView: function(fn) {
      // If `getView` is invoked with undefined as the first argument, then the
      // second argument will be used instead.  This is to allow
      // `getViews(undefined, fn)` to work as `getViews(fn)`.  Useful for when
      // you are allowing an optional selector.
      if (fn == null) {
        fn = arguments[1];
      }

      return this.getViews(fn).first().value();
    },
    getViews: function(fn) {
      var views;
      if (typeof fn === "string") {
        fn = this.sections[fn] || fn;
        views = this.views[fn] || [];
        return _.chain([].concat(views));
      }
      views = _.chain(this.views).map(function(view) {
        return _.isArray(view) ? view : [view];
      }, this).flatten();
      if (typeof fn === "object") {
        return views.where(fn);
      }
      return typeof fn === "function" ? views.filter(fn) : views;
    },
    removeView: function(fn) {
      var views;
      views = this.getViews(fn).each(function(nestedView) {
        nestedView.remove();
      });
      views.value();
      return views;
    },
    setView: function(name, view, insert) {
      var manager, selector;
      var root = this;
      if (typeof name !== "string") {
        insert = view;
        view = name;
        name = "";
      }
      manager = view.__manager__;
      if (!manager) {
        throw new Error("The arg assoc w/ selector '" + name +"' is a View.  Set `manage` to true for " + "Backbone.View instances.");
      }
      manager.parent = root;
      selector = manager.selector = root.sections[name] || name;
      if (!insert) {
        if (root.getView(name) !== view) {
          root.removeView(name);
        }
        return root.views[selector] = view;
      }
      root.views[selector] = aConcat.call([], root.views[name] || [], view);
      root.__manager__.insert = true;

      return view;
    },
    setViews: function(views) {
      // Iterate over all the views and use the View's view method to assign.
      _.each(views, function(view, name) {
        // If the view is an array put all views into insert mode.
        if (_.isArray(view)) {
          return _.each(view, function(view) {
            this.insertView(name, view);
          }, this);
        }

        // Assign each view using the view function.
        this.setView(name, view);
      }, this);

      // Allow for chaining
      return this;
    },
    render: function() {
      var root = this;
      var manager = root.__manager__;
      var parent = manager.parent;
      var rentManager = parent && parent.__manager__;
      var def = root.deferred();
      function resolve() {
        _.each(root.views, function(views, selector){ if (_.isArray(views)) root.htmlBatch(root, views, selector); });
        if (parent && !manager.insertedViaFragment)
          if (!root.contains(parent.el, root.el)) parent.partial(parent.$el, root.$el, rentManager, manager);
        root.delegateEvents();
        root.hasRendered = true;
        manager.renderInProgress = false;
        delete manager.triggeredByRAF;
        if (manager.queue && manager.queue.length) (manager.queue.shift())(); else delete manager.queue;
        function completeRender() {
          var console = window.console, afterRender = root.afterRender;
          if (afterRender) afterRender.call(root, root);
          root.trigger("afterRender", root);
          if (manager.noel && root.$el.length > 1) {
            if (_.isFunction(console.warn) && !root.suppressWarnings) {
              console.warn("`el: false` with multiple top level elements is " + "not supported.");
              if (_.isFunction(console.trace)) console.trace();
            }
          }
        }
        if (rentManager && (rentManager.renderInProgress || rentManager.queue)) parent.once("afterRender", completeRender); else completeRender();
        return def.resolveWith(root, [root]);
      }
      function actuallyRender() {
        root._render().done(function() {
          if (!_.keys(root.views).length) return resolve();
          var promises = _.map(root.views, function(view) {
            var insert = _.isArray(view);
            if (insert && view.length) {
              return root.when(_.map(view, function(subView) {
                subView.__manager__.insertedViaFragment = true;
                return subView.render().__manager__.renderDeferred;
              }));
            }
            return !insert ? view.render().__manager__.renderDeferred : view;
          });
          root.when(promises).done(resolve);
        });
      }
      manager.renderInProgress = true;
      root._registerWithRAF(actuallyRender, def);
      manager.renderDeferred = def;
      return root;
    },
    remove: function() {
      // Force remove itself from its parent.
      LayoutManager._removeView(this, true);

      // Call the original remove function.
      return this._remove.apply(this, arguments);
    },
    _registerWithRAF: function(callback, deferred) {
      var root = this;
      var manager = root.__manager__;
      var rentManager = manager.parent && manager.parent.__manager__;
      if (this.useRAF === false) {
        if (manager.queue) {
          aPush.call(manager.queue, callback);
        } else {
          manager.queue = [];
          callback();
        }
        return;
      }
      manager.deferreds = manager.deferreds || [];
      manager.deferreds.push(deferred);

      deferred.done(resolveDeferreds);

      // Cancel any other renders on this view that are queued to execute.
      this._cancelQueuedRAFRender();

      // Trigger immediately if the parent was triggered by RAF.
      // The flag propagates downward so this view's children are also
      // rendered immediately.
      if (rentManager && rentManager.triggeredByRAF) {
        return finish();
      }

      // Register this request with requestAnimationFrame.
      manager.rafID = root.requestAnimationFrame(finish);

      function finish() {
        // Remove this ID as it is no longer valid.
        manager.rafID = null;

        // Set flag (will propagate to children) so they render
        // without waiting for RAF.
        manager.triggeredByRAF = true;

        // Call original cb.
        callback();
      }

      // Resolve all deferreds that were cancelled previously, if any.
      // This allows the user to bind callbacks to any render callback,
      // even if it was cancelled above.
      function resolveDeferreds() {
        for (var i = 0; i < manager.deferreds.length; i++){
          manager.deferreds[i].resolveWith(root, [root]);
        }
        manager.deferreds = [];
      }
    },
    _cancelQueuedRAFRender: function() {
      var root = this;
      var manager = root.__manager__;
      if (manager.rafID != null) {
        root.cancelAnimationFrame(manager.rafID);
      }
    }
  },{ // Static Properties
    _cache: {},
    _removeViews: function(root, force) {
      // Shift arguments around.
      if (typeof root === "boolean") {
        force = root;
        root = this;
      }

      // Allow removeView to be called on instances.
      root = root || this;

      // Iterate over all of the nested View's and remove.
      root.getViews().each(function(view) {
        // Force doesn't care about if a View has rendered or not.
        if (view.hasRendered || force) {
          LayoutManager._removeView(view, force);
        }

      // call value() in case this chain is evaluated lazily
      }).value();
    },
    _removeView: function(view, force) {
      var parentViews;
      // Shorthand the managers for easier access.
      var manager = view.__manager__;
      var rentManager = manager.parent && manager.parent.__manager__;
      // Test for keep.
      var keep = typeof view.keep === "boolean" ? view.keep : view.options.keep;

      // In insert mode, remove views that do not have `keep` attribute set,
      // unless the force flag is set.
      if ((!keep && rentManager && rentManager.insert === true) || force) {
        // Clean out the events.
        LayoutManager.cleanViews(view);

        // Since we are removing this view, force subviews to remove
        view._removeViews(true);

        // Remove the View completely.
        view.$el.remove();

        // Cancel any pending renders, if present.
        view._cancelQueuedRAFRender();

        // Bail out early if no parent exists.
        if (!manager.parent) { return; }

        // Assign (if they exist) the sibling Views to a property.
        parentViews = manager.parent.views[manager.selector];

        // If this is an array of items remove items that are not marked to
        // keep.
        if (_.isArray(parentViews)) {
          // Remove duplicate Views.
          _.each(_.clone(parentViews), function(view, i) {
            // If the managers match, splice off this View.
            if (view && view.__manager__ === manager) {
              aSplice.call(parentViews, i, 1);
            }
          });
          if (_.isEmpty(parentViews)) {
            manager.parent.trigger("empty", manager.selector);
          }
          return;
        }

        // Otherwise delete the parent selector.
        delete manager.parent.views[manager.selector];
        manager.parent.trigger("empty", manager.selector);
      }
    },
    cache: function(path, contents) {
      if (path in this._cache && contents == null) {
        return this._cache[path];
      } else if (path != null && contents != null) {
        return this._cache[path] = contents;
      }
    },
    cleanViews: function(views) {
      // Clear out all existing views.
      _.each(aConcat.call([], views), function(view) {
        // fire cleanup event to the attached handlers
        view.trigger("cleanup", view);

        // Remove all custom events attached to this View.
        view.unbind();

        // Automatically unbind `model`.
        if (view.model instanceof Backbone.Model) {
          view.model.off(null, null, view);
        }

        // Automatically unbind `collection`.
        if (view.collection instanceof Backbone.Collection) {
          view.collection.off(null, null, view);
        }

        // Automatically unbind events bound to this View.
        view.stopListening();

        // If a custom cleanup method was provided on the view, call it after
        // the initial cleanup is done
        if (_.isFunction(view.cleanup)) {
          view.cleanup();
        }
      });
    },
    configure: function(options) {
      _.extend(LayoutManager.prototype, options);
      if (options.manage) {
        Backbone.View.prototype.manage = true;
      }
      if (options.el === false) {
        Backbone.View.prototype.el = false;
      }
      if (options.suppressWarnings === true) {
        Backbone.View.prototype.suppressWarnings = true;
      }
      if (options.useRAF === false) {
        Backbone.View.prototype.useRAF = false;
      }
      if (options._) _ = options._;
    },
    setupView: function(views, options) {
      // Ensure that options is always an object, and clone it so that
      // changes to the original object don't screw up this view.
      options = _.extend({}, options);

      // Set up all Views passed.
      _.each(aConcat.call([], views), function(view) {
        // If the View has already been setup, no need to do it again.
        if (view.__manager__) {
          return;
        }

        var views, declaredViews;
        var proto = LayoutManager.prototype;

        // Ensure necessary properties are set.
        _.defaults(view, {
          // Ensure a view always has a views object.
          views: {},

          // Ensure a view always has a sections object.
          sections: {},

          // Internal state object used to store whether or not a View has been
          // taken over by layout manager and if it has been rendered into the
          // DOM.
          __manager__: {},

          // Add the ability to remove all Views.
          _removeViews: LayoutManager._removeViews,

          // Add the ability to remove itself.
          _removeView: LayoutManager._removeView

        // Mix in all LayoutManager prototype properties as well.
        }, LayoutManager.prototype);

        // Assign passed options.
        view.options = options;

        // Merge the View options into the View.
        _.extend(view, options);

        // By default the original Remove function is the Backbone.View one.
        view._remove = Backbone.View.prototype.remove;

        // Ensure the render is always set correctly.
        view.render = LayoutManager.prototype.render;

        // If the user provided their own remove override, use that instead of
        // the default.
        if (view.remove !== proto.remove) {
          view._remove = view.remove;
          view.remove = proto.remove;
        }

        // Normalize views to exist on either instance or options, default to
        // options.
        views = options.views || view.views;

        // Set the internal views, only if selectors have been provided.
        if (_.keys(views).length) {
          // Keep original object declared containing Views.
          declaredViews = views;

          // Reset the property to avoid duplication or overwritting.
          view.views = {};

          // If any declared view is wrapped in a function, invoke it.
          _.each(declaredViews, function(declaredView, key) {
            if (typeof declaredView === "function") {
              declaredViews[key] = declaredView.call(view, view);
            }
          });

          // Set the declared Views.
          view.setViews(declaredViews);
        }
      });
    }
  });
  LayoutManager.VERSION = "0.9.7";
  Backbone.Layout = LayoutManager;
  Backbone.View.prototype.constructor = function(options) {
    var noel;
    options = options || {};

    if ("el" in options ? options.el === false : this.el === false) noel = true;
    if (options.manage || this.manage) {
      LayoutManager.setupView(this, options);
    }
    if (this.__manager__) {
      this.__manager__.noel = noel;
      this.__manager__.suppressWarnings = options.suppressWarnings;
    }
    ViewConstructor.apply(this, arguments);
  };
  Backbone.View = Backbone.View.prototype.constructor;
  Backbone.View.extend = ViewConstructor.extend;
  Backbone.View.prototype = ViewConstructor.prototype;
  var defaultOptions = {
    prefix: "",
    useRAF: true,
    deferred: function() {
      return $.Deferred();
    },
    fetchTemplate: function(path) {
      return _.template($(path).html());
    },
    renderTemplate: function(template, context) {
      return trim(template.call(this, context));
    },
    serialize: function() {
      return this.model ? _.clone(this.model.attributes) : {};
    },
    partial: function($root, $el, rentManager, manager) {
      var $filtered;

      if (manager.selector) {
        if (rentManager.noel) {
          $filtered = $root.filter(manager.selector);
          $root = $filtered.length ? $filtered : $root.find(manager.selector);
        } else {
          $root = $root.find(manager.selector);
        }
      }

      // Use the insert method if the parent's `insert` argument is true.
      if (rentManager.insert) {
        this.insert($root, $el);
      } else {
        this.html($root, $el);
      }
    },
    html: function($root, content) {
      $root.empty().append(content);
    },
    htmlBatch: function(rootView, subViews, selector) {
      // Shorthand the parent manager object.
      var rentManager = rootView.__manager__;
      // Create a simplified manager object that tells partial() where
      // place the elements.
      var manager = { selector: selector };

      // Get the elements to be inserted into the root view.
      var els = _.reduce(subViews, function(memo, sub) {
        // Check if keep is present - do boolean check in case the user
        // has created a `keep` function.
        var keep = typeof sub.keep === "boolean" ? sub.keep : sub.options.keep;
        // If a subView is present, don't push it.  This can only happen if
        // `keep: true`.  We do the keep check for speed as $.contains is not
        // cheap.
        var exists = keep && $.contains(rootView.el, sub.el);

        // If there is an element and it doesn't already exist in our structure
        // attach it.
        if (sub.el && !exists) {
          memo.push(sub.el);
        }

        return memo;
      }, []);

      // Use partial to apply the elements. Wrap els in jQ obj for cheerio.
      return this.partial(rootView.$el, $(els), rentManager, manager);
    },
    insert: function($root, $el) {
      $root.append($el);
    },
    when: function(promises) {
      return $.when.apply(null, promises);
    },
    contains: function(parent, child) {
      return $.contains(parent, child);
    },
    requestAnimationFrame: (function() {
      var lastTime = 0;
      var vendors = ["ms", "moz", "webkit", "o"];
      var requestAnimationFrame = window.requestAnimationFrame;

      for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
      }

      if (!requestAnimationFrame){
        requestAnimationFrame = function(callback) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }

      return _.bind(requestAnimationFrame, window);
    })(),
    cancelAnimationFrame: (function() {
      var vendors = ["ms", "moz", "webkit", "o"];
      var cancelAnimationFrame = window.cancelAnimationFrame;

      for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        cancelAnimationFrame =
          window[vendors[i] + "CancelAnimationFrame"] ||
          window[vendors[i] + "CancelRequestAnimationFrame"];
      }

      if (!cancelAnimationFrame) {
        cancelAnimationFrame = function(id) {
          clearTimeout(id);
        };
      }

      return _.bind(cancelAnimationFrame, window);
    })()
  };
  _.extend(LayoutManager.prototype, defaultOptions);
  return LayoutManager;
}));
