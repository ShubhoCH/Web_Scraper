const fs = require('fs');
var path = require('path');
const cherio = require("cherio");
const mongoose = require("mongoose");
const request = require("request-promise");
const imageDownloader = require("node-image-downloader");

//News Sections:
const news = "https://www.firstpost.com/";
const sports = "https://www.firstpost.com/category/sports";
const business = "https://www.firstpost.com/category/business";
const sections = [news, sports, business];

//DATABASE
mongoose.connect("mongodb://localhost:27017/webData");

//Schema1:
const itemSchema = {
    title: String,
    content: String,
    link: String
};
const Item = mongoose.model("Item", itemSchema);

//Schema2:
const DataArticle = {
    data: [itemSchema]
};
const dataArticle = mongoose.model("DataArticle", DataArticle);

//Schema3:
const imageModel  = new mongoose.Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
const imgModel = mongoose.model("imageModel", imageModel);

(async () => {
    const DATA = [];
    for(let section of sections){
        const temp = [];
        const res = await request({
            uri: section,
            headers: {
                accept: 
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9"
            },
            gzip: true
        });
        let $ = cherio.load(res)
        let imgIndex = 1;
        $(".big-thumb").each(function(){
            if($(this).find(".copy").length > 0){
                //Download Imgaes to "images" folder:
                $(this).find("img").each((index, image)=>{
                    imgUrl = $(image).attr('src');
                    imageDownloader({
                        imgs: [
                            {
                                uri: imgUrl,
                                filename: 'Img_Section' + String(DATA.length + 1) + "_" + String(imgIndex++)
                            }
                        ],
                        dest: './images', //destination folder
                        })
                        .then((info) => {
                            //All Well!
                            
                            // var obj = {
                            //     name: 'Img_Section' + String(DATA.length + 1) + "_" + String(imgIndex),
                            //     desc: 'Img_Section' + String(DATA.length + 1) + "_" + String(imgIndex),
                            //     img: {
                            //         data: fs.readFileSync(path.join("Img_Section1_1.jpg")),
                            //         contentType: 'image/png'
                            //     }
                            // }
                            // imgModel.create(obj, (err, item) => {
                            //     if (err) {
                            //         console.log(err);
                            //     }
                            //     else {
                            //         console.log("SSSSaved");
                            //     }
                            // });
                        })
                        .catch((error, response, body) => {
                            console.log('something goes bad!');
                            console.log(error);
                        })
                });
                //Get the title of the Article:
                let title = $(this).find('.main-title').text().trim();
                //Get the Content of the Article
                let content = $(this).find('.copy').text().trim();
                //Get the Link to the page for the current Article:
                let link = $(this).find("a").attr('href');
                temp.push({
                    title,
                    content,
                    link
                })
            }
        });
        //Add all the articles for the current news section to DATA array:
        DATA.push(temp);
    }

    //All the Articles scrapped from the Website in the format of:
    // [
    //      [1st section Containing Title, Content, and Link]
    //      [2nd section Containing Title, Content, and Link]
    //      [3rd section Containing Title, Content, and Link]
    // ]
    console.log(DATA)
    console.log(DATA.length);
    
    //Add all the Data to a MongoDB Collection:
    dataArticle.findOne({}, function(err, foundList){
        if(!err){
            if(!foundList){
                //Create New List:
                var news = new Array();
                for(let i=0;i<DATA.length;i++){
                    for(let j=0 ;j<DATA[i].length;j++){
                        const scrappedData = new Item({
                            title: DATA[i][j].title,
                            content: DATA[i][j].content,
                            link: DATA[i][j].link
                        });
                        news[(i)*DATA[0].length + j] = scrappedData;
                    }
                }
                const d = new dataArticle({
                    data: news
                })
                d.save()
            }else
                console.log("Not Added! Already there");
        }
    })
})();