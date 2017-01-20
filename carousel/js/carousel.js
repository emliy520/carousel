(function($, window){
    
    var Carousel = function(ele, config){      // 构造函数
        this.init(ele, config);
    }

    $.extend(true, Carousel.prototype, {
        init: function(ele, config){
            this.$id = ele,
            this.config = $.extend(true, {
                // id: '#caroursel',
                width:1000,
                height:270,
                posterWidth:640,
                posterHeight:270,
                scale:0.8,
                speed:1000,
                isAutoplay:"true",
                dealy:2000,
                align:'middle'
            }, config || {});

            // li的个数为偶数，末尾自动添加一个
            this.addItem();

            // 缓存变量
            this.render();

            // 第一个li的位置
            this.setFirstPosition();

            // 其他li元素的位置
            this.setRemainPositon();

            // 按钮点击运动
            this.bindEvt();

            // 是否自动播放
            if(this.config.isAutoplay == 'true'){
                this.autoPlay();
            }
            
        },
        // 如果元素的个数为偶数，自动添加一个元素
        addItem: function(){
                this.itemBox = this.$id.find('.poster-list'),
                this.itmes = this.itemBox.find('li'),
                this.len = this.itmes.length;

            if(this.len % 2 ==0){    // 如果元素的个数为偶数，自动添加一个元素
                this.itmes.eq(0).clone().appendTo(this.itemBox); 
            }
        },
        // 存储变量
        render: function(){
            var that = this;
            this.id = this.$id;
            this.itemList = this.id.find('.poster-list');
            this.item = this.itemList.find('li');
            this.firstItem = this.item.first();
            this.lastItem = this.item.last();
            this.prevBtn = this.id.find('.poster-prev-btn');
            this.nextBtn = this.id.find('.poster-next-btn');
            this.off = true;
        },
        // 上下对齐方式
        setVertialType: function(h){
            var doms = this.config;
            var align = doms.align;

            switch (align){
                case 'middle': 
                    return (doms.posterHeight-h)/2;
                    break;
                case 'top':
                    return 0;
                    break;
                case 'bottom':
                    return (doms.posterHeight-h);
                    break;
                default:;
            }
        },
        // 第一个li的位置及按钮的位置
        setFirstPosition: function(){
            var that = this;
            var doms = this.config;

            this.firstItem.css({
                'width': doms.posterWidth,
                'height': doms.posterHeight,
                'left': Math.ceil((doms.width-doms.posterWidth)/2),
                'top': that.setVertialType(doms.posterHeight),
                'z-index': Math.ceil(that.item.length/2)
            });

            // 左边按钮的位置
            this.prevBtn.css({
                'width': (doms.width-doms.posterWidth)/2,
                'height': doms.posterHeight,
                'z-index': Math.ceil(that.item.length/2)
            });

            // 右边按钮的位置
            this.nextBtn.css({
                'width': (doms.width-doms.posterWidth)/2,
                'height': doms.posterHeight,
                'z-index': Math.ceil(that.item.length/2)
            });
        },
        // 其他li元素的位置
        setRemainPositon: function(){
            var that = this;
            var doms = this.config;
            var aItems = this.item.slice(1),
                level = Math.floor(this.item.length/2),
                leftItems = aItems.slice(0, level),
                rightItems = aItems.slice(level),
                gapWidth = (doms.width- doms.posterWidth)/2,
                gap = gapWidth/level;
            

            // 左边li的位置
            var i = 1,
                lIndex = level,
                lw = doms.posterWidth * doms.scale,
                lh = doms.posterHeight * doms.scale;

            $.each(leftItems, function(k, item) {
                $(item).css({
                    'width': lw,
                    'height': lh,
                    'left': gapWidth - i*gap,
                    'z-index': lIndex--,
                    "opacity":1/(i+1),
                    'top': that.setVertialType(lh)
                });

                lw = lw * doms.scale;
                lh = lh * doms.scale;

                i++;
            });

            // 右边li的位置
            var j = 1,
                rIndex = 1,
                rw = leftItems.last().width(),
                rh = leftItems.last().height();

            $.each(rightItems, function(k, item) {
                rLeft = (doms.width - doms.posterWidth)/2 + doms.posterWidth + gapWidth -rw -gap*k;
                $(item).css({
                    'width': rw,
                    'height': rh,
                    'left': rLeft, 
                    'z-index': rIndex++,
                    "opacity":1/(j+1),
                    'top': that.setVertialType(rh)
                });

                rw = rw / doms.scale;
                rh = rh / doms.scale;

                j++;
            });
        },
        // 点击动画
        rotateAnimate: function(dir){
            var that = this;
            var doms = this.config;
            var off = true;

            // 元素的排序不变，只是将元素的样式循环改变           
            if(dir == 'left'){
                that.item.each(function() {
                    var $this = $(this),
                        prev = $this.next().get(0)?$this.next():that.firstItem,
                        width = prev.width(),
                        height = prev.height(),
                        left = prev.css('left'),
                        top = prev.css('top'),
                        opacity = prev.css('opacity'),
                        zIndex = prev.css('z-index');

                    $this.animate({
                        'width': width,
                        'height': height,
                        'left':left,
                        'top':top,
                        'opacity': opacity,
                        'z-index': zIndex
                    },
                        doms.speed, function() {
                            that.off = true;
                    });
                });
            } else if(dir == 'right'){
                that.item.each(function() {
                    var $this = $(this),
                        next = $this.prev().get(0)?$this.prev():that.lastItem,
                        width = next.width(),
                        height = next.height(),
                        left = next.css('left'),
                        top = next.css('top'),
                        opacity = next.css('opacity'),
                        zIndex = next.css('z-index');

                    $this.animate({
                        'width': width,
                        'height': height,
                        'left':left,
                        'top':top,
                        'opacity': opacity,
                        'z-index': zIndex
                    },
                        doms.speed, function() {
                            that.off = true;
                    });
                });
            }
        },
        // 按钮点击
        bindEvt: function(){
            var that = this;

            this.prevBtn.on('click', function(){
                if(that.off){
                    that.off = false;
                    that.rotateAnimate('left');
                }
                
            });
            this.nextBtn.on('click', function(){
                if(that.off){
                    that.off = false;
                    that.rotateAnimate('right');
                }
            })
        },
        // 自动播放
        autoPlay: function(){
            var that = this;
            var doms = that.config;

            that.timer = setInterval(function(){
                that.prevBtn.trigger('click');
            }, doms.dealy);

            this.id.on({
                mouseover: function(){
                    clearInterval(that.timer)
                },
                mouseout: function(){
                    that.timer = setInterval(function(){
                        that.prevBtn.trigger('click');
                    }, doms.dealy);
                }
            })
        }
    });


    $.fn.myPlugin = function(config){

        return new Carousel(this, config);

        // return plugin.init();
    }

    // window.Carousel = Carousel;

})(jQuery, window)