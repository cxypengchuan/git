//把所有与文章相关的操作写在这里
var article = {
    get: function () {
        return $.get(APILIST.article_get)
    },
}