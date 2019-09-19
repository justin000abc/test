function _public(o){this.o = o;}
_public.prototype.header_height = function(){
    return this.o.innerWidth>991?0:(this.o.innerWidth>767?79:77);
}
function Pagination_select(o,d,is_ajax){
    var _this = this;
    _this.o = $(o);
    _this.t = $('<div class="title"></div>');
    d&&_this.t.text(d);
    _this.o.prepend(_this.t);
    is_ajax?_this.add_select_ajax(d):_this.add_select(d);
    _this.s.append(_this.option);
}
Pagination_select.prototype.add_select = function(d){
    var _this = this;
    _this.s = $('<select onChange="location = this.options[this.selectedIndex].value;"></select>');
    _this.o.append(_this.s);
    _this.option = d?'<option value="#">'+_this.t.text()+'</option>':'';
    _this.o.find('.option a').each(function(){
        var $this =$(this);
        var is_active = $this.hasClass("active");
        var x = is_active?"selected":"";
        is_active && _this.t.text($this.text());
        _this.option += '<option value="'+$this.attr("href")+'" '+x+'>'+$this.text()+'</option>';
    });
}
Pagination_select.prototype.add_select_ajax = function(d){
    var _this = this;
    _this.s = $('<select></select>');
    _this.o.append(_this.s);
    _this.option = d?'<option value="#">'+_this.t.text()+'</option>':'';
    _this.o.find('.option a').each(function(){
        var $this = $(this);
        var is_active = $this.hasClass("active");
        var x = is_active?"selected":"";
        is_active && _this.t.text($this.text());
        _this.option += '<option value="'+$this.attr("data-url")+'" '+x+'>'+$this.text()+'</option>';
    });
}
function Pagination(args){
    var _ = this;
    _.args = args;
    _.o = $(_.args.o);
    _.window = $(window);
    _.go_point = $('.go');
    _.offset = new _public(window);
    _.item = $('.item',_.o);
    _.page_length = _.args.pages||10;
    _.pages = Math.ceil(_.item.length / _.page_length);
    _.page = (_.args.page||1) - 1;
    _.page = (_.page>_.pages)?1:_.page;
    _.item_arr = new Array();
    _.item.each(function(idx,item){
        var $item = $(item);
        _.item_arr.push($item);
        $item.remove();
    });
    _.init();    
}
Pagination.prototype.init = function(){
    var _ = this;
    if(_.pages>1){
        //超過一頁
        _.page_wrap = $('<div class="pagination_wrap fz15 mt70"></div>');
        _.page_prev = $('<a href="" title="" class="prev">Prev</a>');
        _.page_next = $('<a href="" title="" class="next">Next</a>');
        _.page_pagi = $('<div class="pagination"></div>');
        _.page_option = $('<div class="option"></div>');
        _.o.after(_.page_wrap);
        _.page_wrap.append(_.page_prev).append(_.page_pagi).append(_.page_next);
        _.page_pagi.append(_.page_option);
        _.page_arr = new Array();
        for(var i=0;i<_.pages;i++){
            _.page_arr.push($('<a href="#" class="'+(_.page==i?'active':'')+'" data-url="" title="">'+(i+1)+'</a>'));
            _.page_option.append(_.page_arr[i]);
        }    
        _.pg = new Pagination_select(_.page_pagi,false,true);
        _.page_select = $('select',_.page_pagi);
        _.btn_disable();
        _.page_arr.forEach(function(item,idx){
            item.on('click',function(e){
                e.preventDefault();
                _.change(idx).scroll();
            });
        });
        _.page_select.on('change',function(){
            _.change(this.selectedIndex).scroll();
        });
        _.page_prev.on('click',function(e){
            e.preventDefault();
            _.change(_.page-1).scroll();
        });
        _.page_next.on('click',function(e){
            e.preventDefault();
            _.change(_.page+1).scroll();
        });
    }
    _.draw_item();
    return _;
}
Pagination.prototype.draw_item = function(){
    var _ = this;
    var page_start = _.page*_.page_length;
    for(var i=page_start;i<page_start+_.page_length;i++){
        if(i==_.item.length) break;
        _.o.append(_.item_arr[i]);
        _.args.lazy && _.item_arr[i].attr('src',_.item_arr[i].attr('data-img')).removeAttr('data-img');
    }
}
Pagination.prototype.change = function(idx){
    var _ = this;
    _.page = idx;
    _.o.html('').css('display','none');
    _.draw_item();
    _.o.fadeIn();
    _.pg.t.text('Page: '+_.page_arr[idx].text());
    _.page_arr[idx].addClass('active').siblings('.active').removeClass('active');
    _.btn_disable();
    (_.args.callback.page_hash && typeof(_.args.callback.page_hash) === "function") && _.args.callback.page_hash(idx);
    return _;
}
Pagination.prototype.btn_disable = function(){
    var _ = this;    
    _.page==0?_.page_prev.addClass('disable'):_.page_prev.removeClass('disable');
    _.page==_.pages-1?_.page_next.addClass('disable'):_.page_next.removeClass('disable');
    return _;
}
Pagination.prototype.scroll = function(){
    var _ = this;
    _.args.is_scroll && _.window.scrollTop(_.go_point.offset().top - _.offset.header_height() - 20);
    return _;
}