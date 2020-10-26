import axios from "axios"
import iconv from "iconv-lite"
import {Buffer} from "buffer";

function autoXmlEncode(content){
    if (/encoding\s*?=\s*?"gbk"/i.test(content)){
        return "gbk";
    }
    return "utf8";
}
export async function getHtml(url, encoding=''){
    const response = await axios.get(url, {
        responseType: "arraybuffer"
    })
    const htmlBuf = response.data;
    //自动编码
    const content = Buffer.from(htmlBuf).toString();
    if (encoding === ''){
        encoding = autoXmlEncode(content)
    }
    return iconv.decode(Buffer.from(htmlBuf), encoding)
}

class RssReader{

    async reader(url){
        let html = await getHtml('/feed.xml');
        return this.parse(html);
    }


    parse(xml){
        // var x2js = require('x2js');
        // var info2 = new x2js().xml2js(xml);
        // if (info2.rss && info2.rss.channel){
        //     return info2.rss.channel;
        // }
        // return this.parse2(xml);
    }

    parse2(xml){
        var convert = require('xml-js');
        var result = convert.xml2json(xml, {compact: true, spaces: 4,ignoreAttributes: false,});
        var object = JSON.parse(result);
        object = object.rss.channel;
        console.log(object,object.copyright);
        let info = {
            title: this.getText(object,'title'),
            link: this.getText(object,'link'),
            image: this.getText(object,'image.url'),
            description: this.getText(object,'description'),

            item:[]
        }
        for(let obj of object.item){
            info.item.push({
                author: this.getText(obj,'author'),
                category: this.getText(obj,'category'),
                description: this.getText(obj,'description','_cdata'),
                link: this.getText(obj,'link'),
                pubDate: this.getText(obj,'pubDate'),
                title: this.getText(obj,'title'),
                enclosure: this.getText(obj,'enclosure._attributes','url')
            })
        }
        console.log(info);
        return info;
    }


    getText(obj,name,type='_text',undefine=''){
        let arr = name.split(".");
        if (arr.length > 1){
            let name2 = '';
            for (let i = 1; i < arr.length; i++) {
                name2 += arr[i] + '.';
            }
            name2 = name2.substr(0,name2.length - 1);
            if (obj[arr[0]] === undefined) return undefine;
            return this.getText(obj[arr[0]],name2,type,undefine);
        }else{
            return obj[name]?obj[name][type]:undefine;
        }
    }
}

export default RssReader;
