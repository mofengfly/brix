(function(S) {
    var BASE_WIDTH = 960;
    var Msg = new S.Base();
    Msg.set('pageWidth', BASE_WIDTH, {slient: true});

    function cssGen(width) {
        if (cssGen.ALL[width]) return;
        cssGen.ALL[width] = true;

        var total = Math.ceil(width / 20);
        var css = '.w' + width + '{width: ' + width + 'px}' +
                '.w' + width + ' .span0_' + width + '{display: none}';

        for (var i=0; i<total; ) {
            ++i;
            css += '.w' + width + ' .span' + i + '_' + width + '{width: ' + (20 * i - 10) + 'px}';
        }

        S.DOM.addStyleSheet(css);
    }
    cssGen.ALL = {};
    cssGen.ALL[BASE_WIDTH] = true;

    Msg.on('afterPageWidthChange', function(e) {
        var width = e.newVal;
        S.one('#r-content').attr('class', 'w' + width);
        cssGen(width);
    });

    S.one('.r-resolution').delegate('click', 'li', function(e) {
        var el = S.one(e.currentTarget);
        
        if (el.hasClass('active')) return;

        el.addClass('active');
        el.siblings('.active').removeClass('active');

        Msg.set('pageWidth', parseInt(el.html(), 10));
    });

    S.one('#r-content')
        .delegate('click', '.r-add-section', function(e) {
            S.one(e.currentTarget).before(
                '<div class="r-section">' +
                    '<div class="row"></div>' +
                    '<div class="r-section-panel">' +
                        '<a class="r-add-div btn btn-size25"><span class="iconfont">&#410</span>新增区块</a>' +
                        '<a class="r-clear-section btn btn-size25"><span class="iconfont">&#223</span>清除区域</a>' +
                        '<a class="r-remove-section btn btn-size25"><span class="iconfont">&#356</span>删除区域</a>' +
                    '</div>' +
                '</div>');
        })
        .delegate('click', '.r-add-div', function(e) {
            var el = S.one(e.currentTarget).parent('.r-section').one('.row');

            el.append('<div class="r-div span10">' +
                    '<p class="r-div-size">190x100</p>' +
                    '<div class="r-div-panel">' +
                        '<input class="r-resize-div" value="190x100">' +
                        '<a class="r-remove-div btn btn-size25"><span class="iconfont">&#356</span>删除区块</a>' +
                    '</div>' +
                '</div>');
        })
        .delegate('click', '.r-clear-section', function(e) {
            S.one(e.currentTarget).parent('.r-section').one('.row').empty();
        })
        .delegate('click', '.r-remove-section', function(e) {
            S.one(e.currentTarget).parent('.r-section').remove();
        })
        .delegate('change', '.r-resize-div', function(e) {
            var el = S.one(e.currentTarget);
            var val = el.val();
            var matches = val.match(/(\d+)x(\d+)/);
            if (!matches) return;

            var width = matches[1];
            var height = matches[2];
            var pageWidth = Msg.get('pageWidth');
            el = el.parent('.r-div');
            el.height(height);

            var cls = el.attr('class').split(/\s+/);
            var suf = pageWidth === BASE_WIDTH ? '' : '_' + pageWidth;
            var reg = new RegExp('^span\\d+' + suf + '$');
            for (var i=0; i<cls.length; ) {
                if (cls[i].match(reg)) {
                    cls.splice(i, 1);
                } else {
                    ++i;
                }
            }
            cls.push('span' + Math.ceil(width/20) + suf);
            el.attr('class', cls.join(' '));

            el.one('.r-div-size').html(val);
        })
        .delegate('click', '.r-remove-div', function(e) {
            S.one(e.currentTarget).parent('.r-div').remove();
        });

})(KISSY);