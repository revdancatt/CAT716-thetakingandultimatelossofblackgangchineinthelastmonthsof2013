map = {

    display: null,

    init: function() {

        var layer = new MM.StamenTileLayer("toner");
        this.display = new MM.Map(document.getElementById("map"), layer);
        this.display.setCenterZoom(new MM.Location(50.69,-1.35), 11);

    },

    reset: function() {
        this.display.setCenterZoom(new MM.Location(50.69,-1.35), 11);
    }
};
