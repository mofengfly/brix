KISSY.add('brix/gallery/tips/index', function (S, Brick, Node, Template) {
    var $ = Node.all, D = S.DOM;
    var count = 0;

    function Tips() {
        Tips.superclass.constructor.apply(this, arguments);
    }

    Tips.ATTRS = {
        dataAttrName:{
            value:'data-tips'
        },
        closeable:{
            value:true
        },
        length:{

        },
        'tmpl-tip':{
            value:'<div id="{{id}}" class="bx-tips-show" style="display: none;position: absolute;top:-9999px;left:-9999px;"><p>{{tips}}</p><i class="bx-tips-tri bx-tips-top"></i></div>'
        },
        tips:{
            value:{}
        },
        timers:{
            value:{}
        },
        prex:{
            value:'bx-tip-'
        },
        trisize:{
            value:{
                width:16,
                height:9,
                distance:14
            }
        }

    };

    Tips.ATTACH = {
        '.bx-tips':{
            mouseenter:function (e) {
                var el = e.currentTarget;
                this.showTips(el);
            },
            mouseleave:function (e) {
                var el = e.currentTarget;
                //this.hideTips(el);
            }
        }
    };

    Tips.METHOD = {
        showTips:function (el) {
            var self = this;
            var _id = self._getTipId(el);
            if (!_id || !self.get("tips")[_id]) {
                _id = self._createTipId();
                var __tip = Template(self.get("tmpl-tip"))
                    .render({'id':_id, 'tips':D.attr(el, self.get("dataAttrName"))});
                self.get("tips")[_id] = true;
                D.attr(el, "data-tipid", _id);
                $(__tip).appendTo('body');
            }
            self._posTip(el, D.get("#" + _id));

        },
        hideTips:function (el) {
            var self = this;
            var _id = self._getTipId(el);
            var _timer = setTimeout(function () {
                D.hide(D.get("#" + _id));
            }, 3000);
            self.get("timers")[_id] = _timer;
        },
        _createTipId:function () {
            return this.get('prex') + ++count;
        },

        _posTip:function (el, tip) {
            var self = this;
            var elOffset = D.offset(el);
            var elX1 = elOffset.left;
            var elY2 = elOffset.top;
            var _el = {
                x1:elX1,
                y1:elY2,
                x2:elX1 + D.innerWidth(el),
                y2:elY2 + D.innerHeight(el)
            };

            var _viewW = D.viewportWidth();
            var _viewH = D.viewportHeight();
            var _left = D.scrollLeft(window);
            var _top = D.scrollTop(window);
            var _view = {
                x1:_left,
                y1:_top,
                x2:_left + _viewW,
                y2:_top + _viewH
            }
            var _timer = self.get("timers")[self._getTipId(el)];
            if (_timer) {
                clearTimeout(_timer);
                delete self.get("timers")[self._getTipId(el)];
            }
            D.show(tip);
            var _tip = {
                w:D.innerWidth(tip),
                h:D.innerHeight(tip)
            };
            var _offset = self._testBR(_el, _tip, _view) || self._testTL(_el, _tip, _view) || self._testBL(_el, _tip, _view) || self._testTR(_el, _tip, _view);
            console.log(_offset);
            var _tri = D.get('.bx-tips-tri', tip);
            D.removeClass(_tri, 'bx-tips-left');
            D.removeClass(_tri, 'bx-tips-right');
            D.removeClass(_tri, 'bx-tips-top');
            D.removeClass(_tri, 'bx-tips-bottom');
            D.addClass(_tri, _offset.class);
            D.css(_tri, {left:_offset.trileft + 'px', top:_offset.tritop + 'px'});
            D.css(tip, {position:'absolute', left:_offset.left + 'px', top:_offset.top + 'px'});


        },
        _testBR:function (el, tip, view) {
            var trisize = this.get("trisize");
            var adjust_left = trisize.width + trisize.distance * 2;
            var adjust_top = trisize.height;
            var x1 = el.x2 - adjust_left;
            var y1 = el.y2 + adjust_top;
            var x2 = x1 + tip.w - adjust_left;
            var y2 = y1 + tip.h + adjust_top;
            if (x2 > view.x2 || y2 > view.y2) {
                return false;
            } else {
                return {
                    left:x1,
                    top:y1,
                    class:'bx-tips-top',
                    trileft:trisize.distance,
                    tritop:-trisize.height
                };
            }
        },
        _testTL:function (el, tip, view) {
            var trisize = this.get("trisize");
            var adjust_left = trisize.width + trisize.distance * 2;
            var adjust_top = trisize.height;
            var x1 = el.x1 - tip.w + adjust_left;
            var y1 = el.y1 - tip.h - adjust_top;
            if (x1 < view.x1 || y1 < view.y1) {
                return false;
            } else
                return {
                    left:x1,
                    top:y1,
                    class:'bx-tips-bottom',
                    trileft:tip.w - trisize.width - trisize.distance,
                    tritop:tip.h
                };
        },
        _testBL:function (el, tip, view) {
            var trisize = this.get("trisize");
            var adjust_left = trisize.width + trisize.distance * 2;
            var adjust_top = trisize.height;
            var x1 = el.x1 - tip.w + adjust_left;
            var y1 = el.y2 + adjust_top;
            var x2 = el.x2 + adjust_left;
            var y2 = y1 + tip.h + adjust_top;
            if (x1 < view.x1 || y2 > view.y2) {
                return false;
            } else
                return {
                    left:x1,
                    top:y1,
                    class:'bx-tips-top',
                    trileft:tip.w - trisize.width - trisize.distance,
                    tritop:-trisize.height
                };
        },
        _testTR:function (el, tip, view) {
            var trisize = this.get("trisize");
            var adjust_left = trisize.width + trisize.distance * 2;
            var adjust_top = trisize.height;
            var x1 = el.x2 - adjust_left;
            var y1 = el.y1 - tip.h - adjust_top;
            var x2 = el.x2 + tip.w - adjust_left;
            var y2 = y1;
            if (x2 > view.x2 || y1 < view.y1) {
                return false;
            } else
                return {
                    left:x1,
                    top:y1,
                    class:'bx-tips-bottom',
                    trileft:trisize.distance,
                    tritop:tip.h
                };
        },
        _getTipId:function (el) {
            return D.attr(el, "data-tipid");
        }
    };
    S.extend(Tips, Brick, {
        initialize:function () {

        },
        destructor:function () {

        }
    });

    S.augment(Tips, Tips.METHOD);
    return Tips;


}, {
    requires:["brix/core/brick", "node", "template"]
});