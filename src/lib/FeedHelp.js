const RssFeedEmitter = require('@/lib/rss-feed-emitter/FeedEmitter');
const feeder = new RssFeedEmitter({ skipFirstLoad: false });

class FeedHelp{
    constructor() {
        // 初始化从数据库中加载
        this.feeds = this.getFeedsFromDb();
    }

    // 初始化feed列表
    initFeeds(eventHandle){
        this.eventHandle = eventHandle;
        if (this.feeds.length > 0){
            for(let feed of this.feeds){
                if (feed.hide) continue;

                // 加入定时监听器
                feeder.add({
                    url: feed.url,
                    refresh: feed.refresh > 10000?feed.refresh:60000,
                    eventHandle: eventHandle(feed)
                });
            }
        }
        feeder.on('load', ({url,items}) => {
            console.log(url,items);
        })
    }

    // 获取当前加载feed列表
    getLoadFeeds(){
        return this.feeds;
    }

    // 从数据库保存订阅列表
    saveFeedsFromDb() {
        let newfeeds = [];
        for (let feed of this.feeds) {
            if (feed.hide) continue;
            let newfeed = {...feed};
            newfeed.badge = 0;
            newfeed.list = [];
            newfeeds.push(newfeed);
        }
        window.db("feeds", newfeeds);
    }


    // 从数据库获取订阅列表
    getFeedsFromDb(){
        let feeds = window.db ? window.db("feeds") : [];
        if (feeds) return feeds;
        return [];
    }



    // 加入订阅 和 监听器
    async addFeed(item){
        if (this.feeds.find((feedEntry) => feedEntry.url === item.url)){
            throw new Error('重复订阅地址' + item.url)
        }
        try {  //捕获验证异常
            await feeder.check(item.url)
        }catch (e){
            // 尝试自动发现
            let feedUrl = await this.autoFeedUrl(item.url);
            if (feedUrl === false){
                throw new Error('订阅地址验证：' + e.message)
            }
            item.url = feedUrl;
        }
        item.refresh = parseInt(item.refresh);
        item.refresh = item.refresh > 10000?item.refresh:60000

        let feed = {title: item.title, url: item.url,badge: 0,list: [],notify: false,refresh: item.refresh}
        this.feeds.push(feed);

        // 防止订阅就一直通知
        setTimeout(() => {
            feed.notify = true;

            this.saveFeedsFromDb();
        },3000)

        feeder.add({
            url: item.url,
            refresh: item.refresh,
            eventHandle: this.eventHandle(feed)
        });

        this.saveFeedsFromDb();
    }

    async saveFeed(params){
        let item = params.new;

        item.refresh = parseInt(item.refresh);
        item.refresh = item.refresh > 10000?item.refresh:60000

        feeder.remove(params.old.url);
        feeder.add({
            url: item.url,
            refresh: item.refresh,
            eventHandle: this.eventHandle(item)
        });

        for (const feed of this.feeds) {
            if (feed.url === params.old.url){
                feed.refresh = item.refresh;
                feed.url = item.url;
                feed.title = item.title;
                break;
            }
        }

        this.saveFeedsFromDb();
    }

    // 删除订阅 和 监听器
    removeFeed(item){
        // 移除监听器
        feeder.remove(item.url);

        // 删除本地订阅记录
        const pos = this.feeds.findIndex((e) => e.url === item.url);
        if (pos < 0){
            throw new Error("未发现订阅网站")
        }
        this.feeds.splice(pos, 1);


        this.saveFeedsFromDb();
    }


    refreshFeed(item){
        let feed = feeder.findFeed(item);
        if (!feed) throw new Error("未发现订阅网站")
        feeder.refresh(feed);
    }


    async autoFeedUrl(url){
        let domain = null;
        //解析域名
        if (url.indexOf("http") !== -1){
            let arr = url.split("/");
            domain = arr[0] + "//" + arr[2];
        }else{
            let arr = url.split("/");
            domain = "http://" + arr[0];
        }
        let list = [
            `${domain}/forum.php?mod=rss`,  // dz论坛
            `${domain}/feed`,
            `${domain}/rss`,
            `${domain}/rss.xml`,
            `${domain.replace('http://www.',"http://").replace('https://www.',"https://")
                .replace('http://',"http://feed.")
                .replace('https://',"https://feed.")}`,
        ];
        if (url.indexOf("rsshub.app") !== -1){
            list = [
                `${url.replace('rsshub.app',"rss.injahow.cn")}`,
                `${url.replace('rsshub.app',"rss.feiyuyu.net")}`,
                `${url.replace('rsshub.app',"rsshub.170601.xyz")}`,
            ]
        }
        for(let item of list){
            try {  //捕获验证异常
                await feeder.check(item);
                return item;
            }catch (e){}
        }
        return false;
    }

}


module.exports = new FeedHelp();
