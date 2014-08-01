
/*
 * aciSortable jQuery Plugin v1.6.0
 * http://acoderinsights.ro
 *
 * Copyright (c) 2013 Dragos Ursu
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Require jQuery Library >= v1.7.1 http://jquery.com
 * + aciPlugin >= v1.4.0 https://github.com/dragosu/jquery-aciPlugin
 */

/*
 * Note: there is a placeholder that is always shown on the valid drop-targets 
 * and a helper that folows the mouse pointer on drag. You can offset the helper
 * by using CSS margins or you can hide it with CSS. The invalid non-draggable 
 * items and the invalid drop targets will not show the placeholder. Also the
 * placeholder is not shown for silly drop-targets like before and after the
 * dragged item itself, the parent dragged over his childrens and when dragging 
 * ouside of the top sortable container.
 * 
 * Use the options callback functions to implement your wanted functionality into
 * aciSortable. By using the options callbacks - you can:
 * + prevent a item to be dragged (see options.before);
 * + init the placeholder/helper based on the dragged item (see options.start);
 * + prevent a item to be dropped to a target (see options.valid);
 * + do something when in the drag (see options.drag);
 * + create/remove a child container when in the drag (so that the dragged item
 *   can be added as children of an item without a child container,
 *   see options.create/options.remove);
 * + set the dragged item to the final drop position (see options.end).
 */

(function($, window, undefined) {

    // default options

    var options = {
        container: 'ul',                                    // selector for the container element (need to be direct parent of 'item')
        item: 'li',                                         // selector for the item element - the sortable items (need to be direct children of 'container')
        distance: 4,                                        // mouse pointer min-distance to consider for drag operations
        handle: '*',                                        // selector for the sortable handle (by default 'mousedown' event over any element is accepted)
        disable: 'a,input,textarea,select,option,button',   // selector for elements that should not start a drag operation on 'mousedown' event over them
        child: null,                                        // [0..100] % from item height/width to consider for container creation (for items without a child container)
        // use NULL to disable creating child containers (the 'draggable' need to be TRUE to be able to create child containers)
        childHolder: '<ul class="aciSortableChild"></ul>',  // HTML markup for the child container (to be created when hovering over a item without a child container)
        childHolderSelector: '.aciSortableChild',           // selector for the container added to a item and used to remove the container (need to match the 'childHolder')
        exclude: null,                                      // selector for containers/items to be excluded from the drop targets/draggable items
        vertical: true,                                     // BOOL to tell if it's vertical or horizontal sortable
        placeholder: '<li class="aciSortablePlaceholder"><div></div></li>',   // HTML markup for showing up the placeholder (when in the drag operation)
        placeholderSelector: '.aciSortablePlaceholder',                       // selector for the placeholder (need to match the 'placeholder')
        helper: '<div class="aciSortableHelper"></div>',                      // HTML markup for showing up the helper (following the mouse pointer)
        helperSelector: '.aciSortableHelper',                                 // selector for the helper (need to match the 'helper')
        relative: false,                                                      // if FALSE then helper top/left will be on mouse cursor position
        // if TRUE will be relative to the starting drag point
        draggable: true,                                                      // if FALSE then the items can only be sorted inside the same container
        gluedPlaceholder: false,                                              // if TRUE then the placeholder will always be visible
        connectDrop: null,                                                    // selector for other sortables to connect this sortable with (as drop targets)
        dropPosition: null,                                                   // if -1 then the placeholder will always be before the first item, if 1 then will be after the last item
        simpleDrop: null,                                                     // selector for other elements to connect this sortable with (as drop targets)
        scroll: 80,                                                           // the distance from margin to consider for scrolling speed[pixels/50ms]=options.scroll/[1+1.04^(-distance+60)]
        // use NULL to disable scrolling
        scrollParent: 'window',                                               // selector for parent elements to scroll (when in drag and the mouse pointer gets close to a margin)
        /**
         * Called before start dragging.
         * @param {jQuery} item The sorted element
         * @returns {bool} FALSE for non-draggable items
         */
        before: function(item) {
            if (this._instance.options.exclude) {
                // test if excluded from drag
                var container = this.containerFrom(item);
                return !container.is(this._instance.options.exclude) && !item.is(this._instance.options.exclude);
            }
            return true;
        },
        /**
         * Called one time just before dragging (the helper content should be set here).
         * @param {jQuery} item The sorted element
         * @param {jQuery} placeholder The placeholder element
         * @param {jQuery} helper The element that follows the mouse pointer
         */
        start: function(item, placeholder, helper) {
            var clone = item.clone();
            clone.children(this._instance.options.container).remove();
            // copy item text to the helper
            helper.html(clone.text());
        },
        /**
         * Called to check the drop target.
         * @param {jQuery} item The sorted element
         * @param {jQuery} hover The element under the mouse pointer (or a created child container - when 'isContainer' !== FALSE)
         * @param {bool/NULL} before TRUE if the drop target is before the 'hover' item, FALSE if it is after the 'hover' item and NULL when testing if a container can be created
         * @param {bool} isContainer TRUE if 'hover' is a empty container, FALSE if 'hover' is a item
         * @param {jQuery} placeholder The placeholder element
         * @param {jQuery} helper The element that follows the mouse pointer
         * @returns {bool} FALSE for a invalid drop target
         */
        valid: function(item, hover, before, isContainer, placeholder, helper) {
            if (this._instance.options.exclude) {
                // test if excluded from drop
                if (isContainer) {
                    return !hover.is(this._instance.options.exclude);
                } else {
                    var container = this.containerFrom(hover);
                    return !container.is(this._instance.options.exclude);
                }
            }
            return true;
        },
        /**
         * Called when in the drag operation (after the reposition of the placeholder).
         * @param {jQuery} item The sorted element
         * @param {jQuery} placeholder The placeholder element (inserted into the DOM)
         * @param {bool} isValid TRUE if the current drop-target is valid
         * @param {jQuery} helper The element that follows the mouse pointer
         */
        drag: function(item, placeholder, isValid, helper) {
            // there is no default implementation
        },
        /**
         * Called to create a child container when hovering over a item.
         * @param {jQuery} item The sorted element
         * @param {jQuery} hover The element under the mouse pointer
         * @returns {bool} TRUE if the container was created
         */
        create: function(item, hover) {
            // append a new child container
            hover.append(this._instance.options.childHolder);
            return true;
        },
        /**
         * Called when the child container should be removed.
         * @param {jQuery} item The sorted element
         * @param {jQuery} hover The element with the created container
         */
        remove: function(item, hover) {
            // remove the child container
            hover.children(this._instance.options.childHolderSelector).remove();
        },
        /**
         * Called on drag end (the item should be repositioned here based on the placeholder).
         * @param {jQuery} item The sorted element
         * @param {jQuery} hover The element under the mouse pointer
         * @param {jQuery} placeholder The placeholder element (need to be detached)
         * @param {jQuery} helper The element that follows the mouse pointer (need to be detached)
         */
        end: function(item, hover, placeholder, helper) {
            // test if placeholder is inserted into the DOM
            if (placeholder.parent().length) {
                // add the item after placeholder
                placeholder.after(item).detach();
            }
            helper.detach();
        }
    };

    // aciSortable plugin core

    var aciSortable = {
        // add extra data
        __extend: function() {
            $.extend(this._instance, {
                sorting: false,     // tell if the drag was started
                item: null,         // hold the dragged item
                hoverItem: null,    // hold the hovered item (where the mouse cursor is)
                isContainer: false, // TRUE when 'hoverItem' is an empty container (not a item)
                pointStart: null,   // starting mouse coords
                pointNow: null,     // current mouse coords
                placeholder: null,  // hold the placeholder (may not be inserted in the DOM)
                helper: null,       // hold the helper (may not be inserted in the DOM)
                relative: null,     // starting mouse offset (if options.relative was TRUE)
                children: null,     // hold the last item with a created container
                scroll: false,      // hold the scroll state
                lastCheck: {
                    // hold the last checked data
                }
            });
        },
        // init
        init: function() {
            if (this.wasInit()) {
                return;
            }
            // bind events to respond to the drag operation
            this._instance.jQuery.on('mousedown' + this._instance.nameSpace, this._instance.options.item, this.proxy(function(event) {
                // mousedown on a item
                var target = $(event.target);
                if (!target.is(this._instance.options.handle) || target.is(this._instance.options.disable)) {
                    return;
                }
                if (!target.is(this._instance.options.disable)) {
                    // prevent text selection
                    event.preventDefault();
                }
                if (target.is(this._instance.options.container)) {
                    // no drag for containers 
                    $(window.document.body).css('cursor', 'no-drop');
                } else {
                    this._delayStart(event);
                }
            })).on('mousemove' + this._instance.nameSpace, this._instance.options.item, this.proxy(function(event) {
                // mousemove over a item
                if (this._instance.sorting) {
                    event.stopPropagation();
                    this._instance.isContainer = false;
                    var item = this.itemFrom(event.target);
                    if (this._instance.item.has(item).length) {
                        // the parent can't be dropped over his childrens
                        this._instance.hoverItem = null;
                    } else {
                        if (this._instance.options.dropPosition === null) {
                            this._instance.hoverItem = item;
                        } else {
                            var container = this.containerFrom(event.target);
                            this._dropPosition(container);
                        }
                    }
                }
                this._drag(event);
            })).on('mousemove' + this._instance.nameSpace, this._instance.options.container, this.proxy(function(event) {
                // mousemove over a sortable container
                if (this._instance.sorting) {
                    event.stopPropagation();
                    var container = this.containerFrom(event.target);
                    if (!this._instance.item.has(container).length) {
                        // allow container to be a drop target
                        if (this.isEmpty(container)) {
                            this._instance.hoverItem = container;
                            this._instance.isContainer = true;
                        } else {
                            this._instance.isContainer = false;
                            if (this._instance.options.dropPosition === null) {
                                this._instance.hoverItem = this._closestFrom(event);
                            } else {
                                this._dropPosition(container);
                            }
                        }
                    }
                }
                this._drag(event);
            }));
            this._initConnect();
            this._initSimple();
            // ensure we proceess on move/end outside of container
            $(window.document).bind('mousemove' + this._instance.nameSpace + this._instance.index, this.proxy(function(event) {
                // mousemove outside of the sortable
                if (this._instance.sorting) {
                    // can't drag outside of container
                    this._instance.hoverItem = null;
                    this._drag(event);
                }
            })).on('mousemove' + this._instance.nameSpace + this._instance.index, this._instance.options.helperSelector, this.proxy(function(event) {
                // mousemove over the helper
                if (this._instance.sorting) {
                    var element = this._fromCursor(event);
                    if (element) {
                        this._instance.jQuery.trigger($.Event('mousemove', {
                            target: element,
                            pageX: event.pageX,
                            pageY: event.pageY
                        }));
                        event.stopPropagation();
                    }
                }
            })).bind('selectstart' + this._instance.nameSpace + this._instance.index, this.proxy(function(event) {
                if (this._instance.sorting) {
                    // prevent text selection
                    event.preventDefault();
                }
            })).bind('mouseup' + this._instance.nameSpace + this._instance.index, this.proxy(function() {
                // drag ends here
                if (this._instance.sorting) {
                    this._end();
                } else {
                    this._instance.item = null;
                    $(window.document.body).css('cursor', 'default');
                }
            }));
            this._super();
        },
        // run when dropPosition is enabled
        _dropPosition: function(container) {
            if (this._instance.options.dropPosition == -1) {
                this._instance.hoverItem = this._firstItem(container);
            } else {
                this._instance.hoverItem = this._lastItem(container);
            }
            if (!this._instance.hoverItem.length) {
                this._instance.hoverItem = container;
                this._instance.isContainer = true;
            }
        },
        // get first item
        _firstItem: function(container) {
            return container.children(this._instance.options.item).not(this._instance.options.placeholderSelector).first();
        },
        // get last item
        _lastItem: function(container) {
            return container.children(this._instance.options.item).not(this._instance.options.placeholderSelector).last();
        },
        // get closest item from cursor
        _closestFrom: function(event) {
            var item = null;
            var parent = $(event.target);
            if (this._instance.options.vertical) {
                var scroll = $(window).scrollTop();
                var min = parent.height();
                parent.find(this._instance.options.item).not(this._instance.options.placeholderSelector).each(function() {
                    var rect = this.getBoundingClientRect();
                    var diff = window.Math.abs(scroll + rect.top + (rect.bottom - rect.top) / 2 - event.pageY);
                    if (diff < min) {
                        min = diff;
                        item = $(this);
                    }
                });
            } else {
                var scroll = $(window).scrollLeft();
                var min = parent.width();
                parent.find(this._instance.options.item).not(this._instance.options.placeholderSelector).each(function() {
                    var rect = this.getBoundingClientRect();
                    var diff = window.Math.abs(scroll + rect.left + (rect.right - rect.left) / 2 - event.pageX);
                    if (diff < min) {
                        min = diff;
                        item = $(this);
                    }
                });
            }
            return item;
        },
        // get element from cursor
        _fromCursor: function(event) {
            if (this._instance.helper && this._instance.helper.parent().length) {
                if ($(event.target).closest(this._instance.options.helperSelector).length) {
                    this._instance.helper.hide();
                    var element = window.document.elementFromPoint(event.clientX, event.clientY);
                    this._instance.helper.show();
                    if (element && (element != window.document.body)) {
                        return element;
                    }
                }
            }
            return null;
        },
        // init connect sortables
        _initConnect: function() {
            if (this._instance.options.connectDrop) {
                $(window.document).on('mousemove' + this._instance.nameSpace + 'connect' + this._instance.index, this._instance.options.connectDrop, this.proxy(function(event) {
                    // mousemove over the related sortables
                    var element = $(event.target);
                    if (this._instance.sorting && !this._instance.jQuery.has(element).length) {
                        if (!element.is(this._instance.options.connectDrop)) {
                            element = element.closest(this._instance.options.connectDrop);
                        }
                        this._connect(element);
                    }
                }));
            }
        },
        // done connect sortables
        _doneConnect: function() {
            $(window.document).off(this._instance.nameSpace + 'connect' + this._instance.index);
        },
        // init simple drop
        _initSimple: function() {
            if (this._instance.options.simpleDrop) {
                $(window.document).on('mousemove' + this._instance.nameSpace + 'simple' + this._instance.index, this._instance.options.simpleDrop, this.proxy(function(event) {
                    // mousemove over the related elements
                    var element = $(event.target);
                    if (this._instance.sorting && !this._instance.jQuery.has(element).length) {
                        event.stopPropagation();
                        if (!element.is(this._instance.options.simpleDrop)) {
                            element = element.closest(this._instance.options.simpleDrop);
                        }
                        this._instance.hoverItem = element;
                        this._instance.isContainer = false;
                    }
                    this._drag(event);
                }));
            }
        },
        // done simple drop
        _doneSimple: function() {
            $(window.document).off(this._instance.nameSpace + 'simple' + this._instance.index);
        },
        // trigger event
        _trigger: function(eventName, params) {
            var event = $.Event('acisortable');
            this._instance.jQuery.trigger(event, [this, eventName, params]);
            return !event.isDefaultPrevented();
        },
        // call options callback
        _call: function(callbackName, params) {
            var toArray = [];
            for (var i in params) {
                toArray.push(params[i]);
            }
            var result = true;
            if (!this._trigger('before' + callbackName, params)) {
                return false;
            }
            if (this._instance.options[callbackName]) {
                result = this._instance.options[callbackName].apply(this, toArray);
            }
            if (!this._trigger(callbackName, params)) {
                result = false;
            }
            return result;
        },
        // connect with other sortable
        _connect: function(element) {
            var sortable = element.aciSortable('api');
            if (sortable.wasInit()) {
                sortable._instance.item = this._instance.item
                sortable._instance.pointStart = this._instance.pointStart;
                sortable._instance.relative = this._instance.relative;
                sortable._instance.helper = this._instance.helper.clone();
                var dummy = $('<div style="display:none"></div>');
                $(window.document.body).append(dummy);
                this._instance.item = dummy;
                this._instance.placeholder.detach();
                this._instance.helper.detach();
                this._end();
                dummy.remove();
                sortable._start();
            }
        },
        // test if this sortable has item
        hasItem: function(item) {
            return this._instance.jQuery.has(item).length > 0;
        },
        // get the sortable top container from element
        sortableFrom: function(element) {
            if (this._instance.jQuery.has(element).length) {
                return this._instance.jQuery;
            }
            if (this._instance.options.connectDrop) {
                return $(element).closest(this._instance.options.connectDrop);
            }
            return $();
        },
        // return item from element
        itemFrom: function(element) {
            return $(element).closest(this._instance.options.item);
        },
        // return container from element
        containerFrom: function(element) {
            return $(element).closest(this._instance.options.container);
        },
        // test if item has childrens
        hasChildrens: function(item) {
            return item.children(this._instance.options.container).children(this._instance.options.item).not(this._instance.options.placeholderSelector).length > 0;
        },
        // test if item has container
        hasContainer: function(item) {
            return item.children(this._instance.options.container).length > 0;
        },
        // test if container is empty
        isEmpty: function(container) {
            return !container.children(this._instance.options.item).not(this._instance.options.placeholderSelector).length;
        },
        // start drag with a delay
        _delayStart: function(event) {
            var item = this.itemFrom(event.target)
            if (this._call('before', {
                item: item
            })) {
                this._instance.item = item;
                this._instance.pointStart = {
                    x: event.pageX,
                    y: event.pageY
                };
                if (this._instance.options.relative) {
                    var top = $(window).scrollTop();
                    var left = $(window).scrollLeft();
                    var rect = this._instance.item.get(0).getBoundingClientRect();
                    this._instance.relative = {
                        x: rect.left + left - event.pageX,
                        y: rect.top + top - event.pageY
                    };
                } else {
                    this._instance.relative = {
                        x: 0,
                        y: 0
                    };
                }
                this._drag(event);
            } else {
                $(window.document.body).css('cursor', 'no-drop');
            }
        },
        // start drag
        _start: function() {
            this._instance.sorting = true;
            if (!this._instance.placeholder) {
                this._instance.placeholder = $(this._instance.options.placeholder);
            }
            if (!this._instance.helper) {
                this._instance.helper = $(this._instance.options.helper);
            }
            this._call('start', {
                item: this._instance.item,
                placeholder: this._instance.placeholder,
                helper: this._instance.helper
            });
            if (this._instance.options.gluedPlaceholder) {
                this._instance.item.after(this._instance.placeholder);
            }
            $(window.document.body).append(this._instance.helper);
            $(window.document.body).css('cursor', 'move');
        },
        // check if should update the position
        _minDistance: function() {
            return (window.Math.abs(this._instance.pointStart.x - this._instance.pointNow.x) > this._instance.options.distance) ||
                    (window.Math.abs(this._instance.pointStart.y - this._instance.pointNow.y) > this._instance.options.distance);
        },
        // process drag
        _drag: function(event) {
            this._instance.pointNow = {
                x: event.pageX,
                y: event.pageY
            };
            if (this._instance.sorting) {
                // we started sorting
                this._helper();
                this._placeholder();
            } else if (this._instance.item) {
                // sorting not yet started
                if (this._minDistance()) {
                    this._start();
                }
            }
        },
        // called on drag
        _onDrag: function(isValid) {
            this._call('drag', {
                item: this._instance.item,
                placeholder: this._instance.placeholder,
                isValid: isValid,
                helper: this._instance.helper
            });
        },
        // test if drag position is valid
        _isValid: function(before, create) {
            if (!this._instance.options.draggable && this.hasItem(this._instance.item) && (this._instance.isContainer || (this.containerFrom(this._instance.item).get(0) !=
                    this.containerFrom(this._instance.hoverItem).get(0)))) {
                return false;
            }
            if (this._call('valid', {
                item: this._instance.item,
                hover: this._instance.hoverItem,
                before: create ? null : ((before === null) ? false : before),
                isContainer: create ? false : this._instance.isContainer,
                placeholder: this._instance.placeholder,
                helper: this._instance.helper
            })) {
                $(window.document.body).css('cursor', 'move');
                return true;
            }
            return false;
        },
        // called to create a child container
        _onCreate: function() {
            this._onRemove();
            if (this._instance.hoverItem.is(this._instance.options.exclude)) {
                // prevent creating containers for excluded items
                return false;
            }
            if (this._isSimple()) {
                // prevent creating containers for simpleDrop targets
                return false;
            }
            if (this._call('create', {
                item: this._instance.item,
                hover: this._instance.hoverItem
            })) {
                this._instance.childItem = this._instance.hoverItem;
                // select the added container
                this._instance.hoverItem = this._instance.hoverItem.children(this._instance.options.childHolderSelector);
                this._instance.isContainer = true;
                this._placeholder();
                return true;
            }
            return false;
        },
        // called to remove a container
        _onRemove: function(item) {
            if (this._instance.childItem && (!item || (item.get(0) != this._instance.childItem.get(0)))) {
                if (this._instance.placeholder) {
                    this._instance.placeholder.detach();
                }
                if (!this.hasChildrens(this._instance.childItem)) {
                    this._call('remove', {
                        item: this._instance.item,
                        hover: this._instance.childItem
                    });
                }
                this._instance.childItem = null;
            }
        },
        // check if last check was the same
        _wasValid: function(before, create, check) {
            if (this._instance.lastCheck) {
                var last = check ? this._instance.lastCheck.check : this._instance.lastCheck.normal;
                var result = last && (last.hoverItem.get(0) == this._instance.hoverItem.get(0)) && (last.before === before) && (last.create === create) &&
                        (last.isContainer == this._instance.isContainer);
            }
            this._instance.lastCheck[check ? 'check' : 'normal'] = {
                hoverItem: this._instance.hoverItem,
                before: before,
                create: create,
                isContainer: this._instance.isContainer
            };
            return result;
        },
        // test if over a simpleDrop target
        _isSimple: function() {
            return this._instance.options.simpleDrop && this._instance.hoverItem && this._instance.hoverItem.is(this._instance.options.simpleDrop);
        },
        // update placeholder
        _placeholder: function() {
            this._instance.pointStart = this._instance.pointNow;
            if (this._instance.hoverItem) {
                if (this._instance.hoverItem.is(this._instance.options.placeholderSelector)) {
                    return;
                }
                if (this._instance.isContainer) {
                    // if the placeholder in an empty container
                    if (this._wasValid(null, false)) {
                        return;
                    }
                    if (this._isValid(null)) {
                        this._instance.hoverItem.append(this._instance.placeholder);
                        this._onDrag(true);
                        return;
                    }
                } else if (this._instance.hoverItem.get(0) != this._instance.item.get(0)) {
                    // do not show if hover is the dragged item
                    var before = false, create = false;
                    var rect = this._instance.hoverItem.get(0).getBoundingClientRect();
                    var container = this._instance.hoverItem.children(this._instance.options.container);
                    if (this._instance.options.vertical) {
                        var scroll = $(window).scrollTop();
                        // take out the child container height
                        var bottom = rect.bottom - ((container.length && container.is(':visible')) ? container.outerHeight(true) : 0);
                        if (this._instance.options.child && (this._instance.options.draggable || !this.hasItem(this._instance.item)) && !this.hasChildrens(this._instance.hoverItem)) {
                            // check if we should create a container
                            var distance = (bottom - rect.top) * (0.5 - this._instance.options.child / 200);
                            if ((this._instance.pointNow.y > scroll + rect.top + distance) && (this._instance.pointNow.y < scroll + bottom - distance)) {
                                create = container.length ? null : true;
                            }
                        }
                        // check if should be before the hover one
                        if (this._instance.pointNow.y < scroll + rect.top + (bottom - rect.top) / 2) {
                            before = true;
                        }
                    } else {
                        var scroll = $(window).scrollLeft();
                        // take out the child container width
                        var right = rect.right - ((container.length && container.is(':visible')) ? container.outerWidth(true) : 0);
                        if (this._instance.options.child && (this._instance.options.draggable || !this.hasItem(this._instance.item)) && !this.hasChildrens(this._instance.hoverItem)) {
                            // check if we should create a container
                            var distance = (right - rect.left) * (0.5 - this._instance.options.child / 200);
                            if ((this._instance.pointNow.x > scroll + rect.left + distance) || (this._instance.pointNow.x < scroll + right - distance)) {
                                create = container.length ? null : true;
                            }
                        }
                        // check if should be before the hover one
                        if (this._instance.pointNow.x < scroll + rect.left + (right - rect.left) / 2) {
                            before = true;
                        }
                    }
                    if (this._instance.options.dropPosition == -1) {
                        before = true;
                    } else if (this._instance.options.dropPosition == 1) {
                        before = false;
                    }
                    if (create !== false) {
                        if (this._wasValid(before, create, true)) {
                            return;
                        }
                        if (this._isValid(null, true) === false) {
                            create = false;
                        }
                    }
                    if (create === null) {
                        this._onRemove(this._instance.hoverItem);
                        this._instance.childItem = this._instance.hoverItem;
                        // select the container
                        this._instance.hoverItem = this._instance.hoverItem.children(this._instance.options.childHolderSelector);
                        this._instance.isContainer = true;
                        if (this._wasValid(null, true)) {
                            return;
                        }
                        if (this._isValid(null)) {
                            if (!this._isSimple()) {
                                this._instance.hoverItem.append(this._instance.placeholder);
                            }
                            this._onDrag(true);
                            return;
                        }
                    } else if (before) {
                        if (this._wasValid(true, create)) {
                            return;
                        }
                        if (this._isValid(true)) {
                            if (create && this._onCreate()) {
                                return
                            }
                            var prevItem = this._instance.hoverItem.prev(this._instance.options.item);
                            if (this._instance.options.gluedPlaceholder || (prevItem.get(0) != this._instance.item.get(0))) {
                                if (!this._isSimple()) {
                                    this._instance.hoverItem.before(this._instance.placeholder);
                                }
                                this._onDrag(true);
                                return;
                            }
                        }
                    } else {
                        if (this._wasValid(false, create)) {
                            return;
                        }
                        if (this._isValid(false)) {
                            if (create && this._onCreate()) {
                                return;
                            }
                            var nextItem = this._instance.hoverItem.next(this._instance.options.item);
                            if (this._instance.options.gluedPlaceholder || (nextItem.get(0) != this._instance.item.get(0))) {
                                if (!this._isSimple()) {
                                    this._instance.hoverItem.after(this._instance.placeholder);
                                }
                                this._onDrag(true);
                                return;
                            }
                        }
                    }
                }
            } else {
                this._instance.lastCheck = {
                };
            }
            // no drop-target
            if (!this._instance.options.gluedPlaceholder) {
                this._instance.placeholder.detach();
            }
            $(window.document.body).css('cursor', 'no-drop');
            this._onDrag(false);
        },
        // process scrolling for the parent
        _scrollParent: function(parent) {
            if (parent) {
                parent = parent.parents(this._instance.options.scrollParent).first();
            } else {
                var parent = this._instance.jQuery.parents(this._instance.options.scrollParent).first();
            }
            if (parent.length) {
                if (!this._scrollContainer(parent)) {
                    return parent;
                }
            } else {
                if (this._instance.options.scrollParent.match(/^(.*,)?window(,.*)?$/)) {
                    this._scrollContainer($(window), true);
                }
            }
            return null;
        },
        // compute scroll amount
        _amount: function(margin, distance) {
            return margin / (1 + window.Math.pow(1.04, -distance + 60));
        },
        // process container scroll
        _scrollContainer: function(container, isWindow) {
            var updated = false;
            var top = $(window).scrollTop(), left = $(window).scrollLeft(), height = container.height(), width = container.width();
            var scrollHeight = isWindow ? window.document.body.scrollHeight : container.get(0).scrollHeight;
            var margin = window.Math.min(this._instance.options.scroll, height / 3);
            var rect = isWindow ? {
                left: 0,
                top: 0,
                right: width,
                bottom: height
            } : container.get(0).getBoundingClientRect();
            if ((scrollHeight > height) && (this._instance.pointNow.x > left + rect.left) && (this._instance.pointNow.x < left + rect.right)) {
                var now = container.scrollTop();
                if (this._instance.pointNow.y < top + rect.top + margin) {
                    if (now > 0) {
                        var distance = top + rect.top + margin - this._instance.pointNow.y;
                        container.scrollTop(window.Math.max(now - this._amount(margin, distance), 0));
                        updated = true;
                    }
                } else if (this._instance.pointNow.y > top + rect.bottom - margin) {
                    if (now + height < scrollHeight) {
                        var distance = this._instance.pointNow.y - (top + rect.bottom - margin);
                        container.scrollTop(window.Math.min(now + this._amount(margin, distance), scrollHeight - height));
                        updated = true;
                    }
                }
            }
            var scrollWidth = isWindow ? window.document.body.scrollWidth : container.get(0).scrollWidth;
            margin = window.Math.min(this._instance.options.scroll, width / 3);
            if ((scrollWidth > width) && (this._instance.pointNow.y > top + rect.top) && (this._instance.pointNow.y < top + rect.bottom)) {
                var now = container.scrollLeft();
                if (this._instance.pointNow.x < left + rect.left + margin) {
                    if (now > 0) {
                        var distance = left + rect.left + margin - this._instance.pointNow.x;
                        container.scrollLeft(window.Math.max(now - this._amount(margin, distance), 0));
                        updated = true;
                    }
                } else if (this._instance.pointNow.x > left + rect.right - margin) {
                    if (now + width < scrollWidth) {
                        var distance = this._instance.pointNow.x - (left + rect.right - margin);
                        container.scrollLeft(window.Math.min(now + this._amount(margin, distance), scrollWidth - width));
                        updated = true;
                    }
                }
            }
            if (isWindow && updated) {
                this._instance.pointNow.x += container.scrollLeft() - left;
                this._instance.pointNow.y += container.scrollTop() - top;
            }
            return updated;
        },
        // process scrolling
        _scroll: function() {
            if (this._instance.scroll) {
                return;
            }
            this._instance.scroll = true;
            if (!this._scrollContainer(this._instance.jQuery) && this._instance.options.scrollParent) {
                var parent = null;
                while (true) {
                    parent = this._scrollParent(parent);
                    if (parent === null) {
                        break;
                    }
                }
            }
            if (this._instance.sorting) {
                window.setTimeout(this.proxy(function() {
                    this._instance.scroll = false;
                    this._helper();
                }), 50);
            } else {
                this._instance.scroll = false;
            }
        },
        // update helper
        _helper: function() {
            if (this._instance.options.scroll) {
                this._scroll();
            }
            this._instance.helper.css({
                left: (this._instance.pointNow.x + this._instance.relative.x) + 'px',
                top: (this._instance.pointNow.y + this._instance.relative.y) + 'px'
            });
        },
        // end drag
        _end: function() {
            if (this._instance.placeholder.parent().length) {
                if ((this._instance.placeholder.prev(this._instance.options.item).get(0) == this._instance.item.get(0)) ||
                        (this._instance.placeholder.next(this._instance.options.item).get(0) == this._instance.item.get(0))) {
                    // when is before/after the dragged item
                    this._instance.placeholder.detach();
                }
            }
            var container = this.containerFrom(this._instance.item);
            this._call('end', {
                item: this._instance.item,
                hover: this._instance.hoverItem,
                placeholder: this._instance.placeholder,
                helper: this._instance.helper
            });
            this._onRemove();
            var parentItem = this.itemFrom(container);
            if (parentItem.length && !this.hasChildrens(parentItem)) {
                this._instance.childItem = parentItem;
                this._onRemove();
            }
            this._instance.sorting = false;
            this._instance.item = null;
            this._instance.hoverItem = null;
            this._instance.lastCheck = {
            };
            $(window.document.body).css('cursor', 'default');
        },
        // override set option
        option: function(option, value) {
            if (this.wasInit()) {
                switch (option) {
                    case 'connectDrop':
                        if (value != this._instance.options.connectDrop) {
                            this._doneConnect();
                            this._instance.options.connectDrop = value;
                            this._initConnect();
                        }
                        break;
                    case 'simpleDrop':
                        if (value != this._instance.options.simpleDrop) {
                            this._doneSimple();
                            this._instance.options.simpleDrop = value;
                            this._initSimple();
                        }
                        break;
                }
            }
            // call the parent
            this._super(option, value);
        },
        // destroy
        destroy: function() {
            if (!this.wasInit()) {
                return;
            }
            this._instance.jQuery.off(this._instance.nameSpace);
            this._doneConnect();
            $(window.document).unbind(this._instance.nameSpace + this._instance.index).off(this._instance.nameSpace + this._instance.index);
            if (this._instance.placeholder) {
                this._instance.placeholder.detach();
            }
            if (this._instance.helper) {
                this._instance.helper.detach();
            }
            this._super();
        }
    };

    // extend the base aciPluginUi class and store into aciPluginClass.plugins
    aciPluginClass.plugins.aciSortable = aciPluginClass.aciPluginUi.extend(aciSortable, 'aciSortable');

    // publish the plugin & the default options
    aciPluginClass.publish('aciSortable', options);

})(jQuery, this);
